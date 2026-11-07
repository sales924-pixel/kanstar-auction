'use strict';
/*
 * Kanstar Daily Auction — standalone single-seller auction server.
 * Zero npm dependencies: Node's built-in http + node:sqlite only.
 * Requires Node >= 22 (developed/tested on Node 24).
 */
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { DatabaseSync } = require('node:sqlite');

/* ------------------------------ config ------------------------------ */
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const PUBLIC_DIR = path.join(ROOT, 'public');
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const DB_PATH = process.env.DB_PATH || path.join(DATA_DIR, 'auction.db');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads'); // seller-uploaded photos live on the data disk so redeploys never lose them
const TAX_RATE_CA = Number(process.env.TAX_RATE_CA || 0.095); // CA sales tax on item price only
const WAREHOUSE = '1065 S Vail Ave, Montebello, CA 90640';
const FREE_SHIP_THRESHOLD_CENTS = 3000; // shipping free at/above $30 winning bid
const SHIP_FEE_CENTS = 500;             // otherwise +$5
const PROMO_CODE = 'KANSTAR5';          // package-insert card code: $5 off first win
const PROMO_DISCOUNT_CENTS = 500;
const PROMO_MIN_ITEM_CENTS = 1000;      // applies to winning bids of $10 or more

/* Stripe Checkout (env-gated): with no STRIPE_SECRET_KEY set, checkout is
 * record-only exactly as before. Keys come from the host's env, never the repo. */
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const SITE_URL = (process.env.SITE_URL || 'https://kanstarus.com').replace(/\/+$/, '');
const STRIPE_ENABLED = !!STRIPE_SECRET_KEY;

/* Seller passcode: only a scrypt hash lives here (plaintext never stored). */
const SELLER_SALT = 'f784542145dd6fa23460047f30c63cab';
const SELLER_HASH = '00be1340b6c3386ae9dff2fb1f5087ceb965e591396529d6ee9110ecc505b12f405b1126a9b6eafe9321385dff8d3f322eba5e4998c986f437185dc58bbc2620';
function verifyPasscode(pw) {
  if (typeof pw !== 'string' || !pw) return false;
  const h = crypto.scryptSync(pw, Buffer.from(SELLER_SALT, 'hex'), 64);
  return crypto.timingSafeEqual(h, Buffer.from(SELLER_HASH, 'hex'));
}

/* ------------------------------ database ----------------------------- */
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
const db = new DatabaseSync(DB_PATH);
db.exec(`
CREATE TABLE IF NOT EXISTS lots(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL, subtitle TEXT DEFAULT '', category TEXT DEFAULT '',
  zone TEXT NOT NULL DEFAULT 'main',           -- 'main' | 'flash' | 'overseas'
  start_cents INTEGER NOT NULL, retail_cents INTEGER,
  qty_note TEXT DEFAULT '', description TEXT DEFAULT '',
  images TEXT NOT NULL DEFAULT '[]',           -- JSON array of /images/... paths
  created_at INTEGER NOT NULL, ends_at INTEGER NOT NULL,
  duration_ms INTEGER NOT NULL, round INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'active'        -- 'active' | 'ended' | 'removed' (seller-unlisted; history kept)
);
CREATE TABLE IF NOT EXISTS bidders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS bids(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL, round INTEGER NOT NULL DEFAULT 1,
  bidder_id INTEGER NOT NULL, amount_cents INTEGER NOT NULL, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS wins(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER NOT NULL, round INTEGER NOT NULL DEFAULT 1,
  bidder_id INTEGER NOT NULL, amount_cents INTEGER NOT NULL,
  created_at INTEGER NOT NULL, order_id INTEGER,
  UNIQUE(lot_id, round)
);
CREATE TABLE IF NOT EXISTS orders(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  win_id INTEGER NOT NULL, lot_id INTEGER NOT NULL,
  buyer_name TEXT NOT NULL, buyer_email TEXT NOT NULL, phone TEXT NOT NULL,
  method TEXT NOT NULL,                        -- 'pickup' | 'ship'
  dest_state TEXT DEFAULT '', address TEXT DEFAULT '',
  item_cents INTEGER NOT NULL, shipping_cents INTEGER NOT NULL,
  tax_cents INTEGER NOT NULL, total_cents INTEGER NOT NULL,
  created_at INTEGER NOT NULL, status TEXT NOT NULL DEFAULT 'awaiting_contact',
  stripe_session_id TEXT DEFAULT '', paid_at INTEGER
);
CREATE TABLE IF NOT EXISTS messages(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lot_id INTEGER, lot_title TEXT DEFAULT '',
  name TEXT NOT NULL, email TEXT NOT NULL, body TEXT NOT NULL,
  receipt_code TEXT NOT NULL UNIQUE,
  seller_reply TEXT DEFAULT '', replied_at INTEGER,
  is_read INTEGER NOT NULL DEFAULT 0, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS events(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,                          -- 'page' | 'lot' | 'bid'
  lot_id INTEGER, visitor_id TEXT NOT NULL, state TEXT NOT NULL DEFAULT 'Unknown',
  created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS notifications(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,                          -- 'outbid' | 'winner' | 'ending_soon' | 'daily_new'
  to_email TEXT NOT NULL, lot_id INTEGER, body TEXT DEFAULT '',
  created_at INTEGER NOT NULL, sent INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS settings(key TEXT PRIMARY KEY, value TEXT);
CREATE INDEX IF NOT EXISTS idx_bids_lot ON bids(lot_id, round, amount_cents DESC);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(created_at);
`);
/* Migrations for databases created before Stripe support. */
function ensureColumn(table, col, ddl) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all().map((r) => r.name);
  if (!cols.includes(col)) db.exec(`ALTER TABLE ${table} ADD COLUMN ${col} ${ddl}`);
}
ensureColumn('orders', 'stripe_session_id', "TEXT DEFAULT ''");
ensureColumn('orders', 'paid_at', 'INTEGER');
ensureColumn('orders', 'promo_code', "TEXT DEFAULT ''");
ensureColumn('orders', 'discount_cents', 'INTEGER DEFAULT 0');

/* Promo code: $5 off a first win of $10+, one use per email. A use counts
 * once an order exists with the code, unless that order's payment expired
 * or it was cancelled. */
function promoEval(email, itemCents) {
  if (itemCents < PROMO_MIN_ITEM_CENTS) return { discount: 0, state: 'below_min' };
  const used = db.prepare("SELECT COUNT(*) AS c FROM orders WHERE promo_code=? AND lower(buyer_email)=lower(?) AND status NOT IN ('payment_expired','cancelled')").get(PROMO_CODE, String(email || '')).c;
  if (used > 0) return { discount: 0, state: 'used' };
  return { discount: PROMO_DISCOUNT_CENTS, state: 'applied' };
}
function promoFromBody(body, email, itemCents) {
  const raw = String((body && body.code) || '').trim().toUpperCase();
  if (!raw) return { code: '', discount: 0, state: null };
  if (raw !== PROMO_CODE) return { code: raw, discount: 0, state: 'invalid' };
  const r = promoEval(email, itemCents);
  return { code: PROMO_CODE, discount: r.discount, state: r.state };
}

/* ------------------------------ seed lots ---------------------------- */
const img = (lot, n) => Array.from({ length: n }, (_, i) => `/images/lot-${String(lot).padStart(2, '0')}/${String(i + 1).padStart(2, '0')}.jpg`);
const SEED_LOTS = [
  { title: '8-Inch Solar Garden Gnome — Glowing Butterfly & Mushroom', subtitle: 'Solar powered · Glowing butterfly · Sits on a mushroom · 8 in tall', category: 'Garden Decor', start: 300, retail: null, qty: '1 piece', images: img(1, 6), desc: 'Solar garden gnome with a green pointed hat and white beard, sitting on an orange mushroom. The butterfly glows at night. Flower-and-grass base.' },
  { title: 'Hoover CleanPlus Carpet Cleaner & Deodorizer — 2-Pack', subtitle: '2X concentrated · 16 fl oz × 2 bottles · Carpets, rugs, upholstery & car interiors · Works with any machine', category: 'Home & Cleaning', start: 500, retail: null, qty: '2-pack', images: img(2, 6), desc: 'Two 16 fl oz bottles of Hoover CleanPlus carpet cleaner & deodorizer. 2X concentrated formula for any carpet cleaning machine.' },
  { title: '14-Inch Resin Table Lamp — Purple Floral & Butterfly', subtitle: 'Hand-painted resin · Purple floral base & shade trim · Butterfly accents · 14 in tall', category: 'Indoor Lighting', start: 500, retail: null, qty: '1 piece', images: img(3, 6), desc: 'Resin table lamp with a purple floral base, butterfly accents on the stem, and a white shade with purple floral vine trim. 14 inches tall.' },
  { title: 'Garment Bags for Hanging Clothes — 6-Pack, 24" x 40"', subtitle: '6-pack · Translucent · Full-length black zipper · 24 x 40 in', category: 'Home Organization', start: 800, retail: 1999, qty: '6-pack', images: img(4, 5), desc: 'Six translucent garment bags for hanging clothes, 24 x 40 inches, with a full-length black zipper. Protects suits, dresses and coats in the closet.' },
  { title: 'Solar Motion Sensor Wall Lights — 2-Pack', subtitle: 'Solar powered · PIR motion sensor, 120° / up to 26 ft · IP65 waterproof · No wiring needed · 4.6" x 3.7"', category: 'Outdoor Lighting', start: 800, retail: 1799, qty: '2-pack', images: img(5, 5), desc: 'Two solar-powered motion sensor wall lights. PIR sensor with 120° coverage up to 26 ft, IP65 waterproof, no wiring needed.' },
  { title: 'Modern Bedside Table Lamp — Black Metal, Diamond Cut-Out', subtitle: 'Warm ambient light · On/off switch · 6 x 6 x 11 in', category: 'Indoor Lighting', start: 500, retail: 1499, qty: '1 piece', images: img(6, 6), desc: 'Black metal bedside lamp with a diamond cut-out shade that throws warm patterned light. On/off switch. 6 x 6 x 11 inches.' },
  { title: 'Resin Pillar Candle Holders — Set of 3, Baroque Black & Gold', subtitle: 'Graduated 8" / 10" / 12" · Antique black & gold resin · Fits 3" pillar candles (not included)', category: 'Home Decor', start: 1000, retail: 2999, qty: 'Set of 3', images: img(7, 8), desc: 'Set of 3 resin pillar candle holders in antique black & gold with Baroque scroll relief. Graduated 8, 10 and 12 inch heights. Candles not included.' },
  { title: 'Iron Cactus Wall Hooks — Set of 5 Colors', subtitle: 'Set of 5 · 4 inches tall · Sturdy iron, rust-resistant · Dual keyhole mount', category: 'Home Organization', start: 500, retail: 1699, qty: 'Set of 5', images: img(8, 8), desc: 'Set of 5 iron cactus-shaped wall hooks in assorted colors. 4 inches tall, rust-resistant coating, dual keyhole mount. For keys, towels, bags and hats.' },
  { title: 'Drawer Organizer Storage Boxes — Set of 6, Gray', subtitle: 'Set of 6 fabric boxes (3 square + 3 rectangular) · Foldable · For underwear, socks, bras & accessories', category: 'Home Organization', start: 500, retail: 1495, qty: 'Set of 6', images: img(9, 7), desc: 'Set of 6 gray fabric drawer organizer boxes — 3 square and 3 rectangular. Foldable, no assembly. For underwear, socks, bras, ties and accessories.' },
  { title: 'Press-On Nails — 6 Boxes, 144 Pcs, 6 Designs', subtitle: '6 boxes x 24 nails · 6 assorted designs · 12 sizes per box · Reusable, natural look', category: 'Beauty', start: 500, retail: 799, qty: '6 boxes / 144 pcs', images: img(10, 8), desc: 'Six boxes of press-on nails, 24 nails per box, 144 pieces total in 6 assorted designs. 12 sizes per box, reusable, natural look.' },
  { title: '45W Charger + 4 USB Cables Bundle — Type-C & Micro-USB', subtitle: '5-piece set · 2x Type-C + 2x Micro-USB cables, 1.5m rubber, rotating metal heads · 45W USB-A wall charger', category: 'Electronics', start: 500, retail: 799, qty: '5-piece set', images: img(11, 4), desc: 'Bundle: one 45W USB-A wall charger (US plug) plus 4 cables — 2x USB-A to Type-C and 2x USB-A to Micro-USB, 1.5 m rubber jackets with rotating metal connector heads.' },
];
function seedIfEmpty() {
  const row = db.prepare('SELECT COUNT(*) AS c FROM lots').get();
  if (row.c > 0) return;
  const now = Date.now();
  const ins = db.prepare(`INSERT INTO lots(title,subtitle,category,zone,start_cents,retail_cents,qty_note,description,images,created_at,ends_at,duration_ms,round,status)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1,'active')`);
  for (const l of SEED_LOTS) {
    ins.run(l.title, l.subtitle, l.category, 'main', l.start, l.retail, l.qty, l.desc, JSON.stringify(l.images), now, now + 24 * 3600 * 1000, 24 * 3600 * 1000);
  }
  console.log(`Seeded ${SEED_LOTS.length} lots (24h countdowns start at first boot).`);
}
seedIfEmpty();

/* ------------------------------ helpers ------------------------------ */
const now = () => Date.now();
const money = (c) => Math.round(c);

/* ----- Los Angeles time (seller stats report in the user's timezone) ----- */
const laFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Los_Angeles', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
});
function laParts(t) {
  const p = {};
  for (const part of laFmt.formatToParts(new Date(t))) {
    if (part.type !== 'literal') p[part.type] = Number(part.value);
  }
  p.hour %= 24; // some ICU versions still emit 24 at midnight despite h23
  return p;
}
// LA wall-clock offset from UTC (ms) in effect at instant t.
function laOffsetMs(t) {
  const p = laParts(t);
  return Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second) - Math.floor(t / 1000) * 1000;
}
// Epoch ms of 00:00:00 LA time on LA calendar date (y, m, d). Re-checking the
// offset at the candidate instant handles DST transition days (e.g. the
// fall-back day, whose midnight is still on the pre-transition offset).
function laMidnightMs(y, m, d) {
  const wall = Date.UTC(y, m - 1, d);
  let t = wall;
  for (let i = 0; i < 3; i++) {
    const next = wall - laOffsetMs(t);
    if (next === t) break;
    t = next;
  }
  return t;
}
// Start (epoch ms) of the LA calendar day `daysBack` days before the LA day
// containing t. Date arithmetic is done on the LA calendar date itself, so
// DST days (23/25 hours) never shift the boundary.
function laRangeStartMs(daysBack, t) {
  const p = laParts(t);
  const norm = new Date(Date.UTC(p.year, p.month - 1, p.day - daysBack));
  return laMidnightMs(norm.getUTCFullYear(), norm.getUTCMonth() + 1, norm.getUTCDate());
}
const laHour = (t) => laParts(t).hour;
const laDayKey = (t) => { const p = laParts(t); return p.year + '-' + p.month + '-' + p.day; };
function logNotification(kind, toEmail, lotId, body) {
  if (!toEmail) return;
  db.prepare('INSERT INTO notifications(kind,to_email,lot_id,body,created_at,sent) VALUES(?,?,?,?,?,1)')
    .run(kind, toEmail, lotId || null, body || '', now());
  console.log(`[notify:${kind}] -> ${toEmail} (lot ${lotId || '-'})`);
}
function getBidderByEmail(email) {
  return db.prepare('SELECT * FROM bidders WHERE email=?').get(email);
}
function topBid(lotId, round) {
  return db.prepare('SELECT b.*, bd.name AS bidder_name, bd.email AS bidder_email FROM bids b JOIN bidders bd ON bd.id=b.bidder_id WHERE b.lot_id=? AND b.round=? ORDER BY b.amount_cents DESC, b.id ASC LIMIT 1').get(lotId, round);
}
function bidCount(lotId, round) {
  return db.prepare('SELECT COUNT(*) AS c FROM bids WHERE lot_id=? AND round=?').get(lotId, round).c;
}

/* --------------------- visitor state (server-side) ------------------- */
/* The visitor's IP is used transiently for a state-level lookup and is
 * NEVER stored. Only the US state name (or 'Unknown') is recorded. */
const geoCache = new Map();
function clientIp(req) {
  const xff = (req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return xff || (req.socket.remoteAddress || '');
}
function isPrivateIp(ip) {
  return !ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('10.') || ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[0-1])\./.test(ip) || ip.startsWith('::ffff:127.') || ip.startsWith('::ffff:192.168.') || ip.startsWith('::ffff:10.');
}
async function stateFromIp(ip) {
  if (isPrivateIp(ip)) return 'Unknown';
  const clean = ip.replace('::ffff:', '');
  if (geoCache.has(clean)) return geoCache.get(clean);
  let state = 'Unknown';
  try {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 1800);
    const r = await fetch(`http://ip-api.com/json/${encodeURIComponent(clean)}?fields=status,countryCode,regionName`, { signal: ctrl.signal });
    clearTimeout(t);
    const j = await r.json();
    if (j && j.status === 'success' && j.countryCode === 'US' && j.regionName) state = j.regionName;
  } catch { /* offline / blocked -> Unknown */ }
  geoCache.set(clean, state);
  return state;
}

/* --------------------------- lot lifecycle --------------------------- */
function finalizeLot(lot) {
  if (lot.status !== 'active') return; // removed lots never finalize/reopen
  const top = topBid(lot.id, lot.round);
  if (top) {
    db.prepare('INSERT OR IGNORE INTO wins(lot_id,round,bidder_id,amount_cents,created_at) VALUES(?,?,?,?,?)')
      .run(lot.id, lot.round, top.bidder_id, top.amount_cents, now());
    logNotification('winner', top.bidder_email, lot.id, `You won "${lot.title}" for $${(top.amount_cents / 100).toFixed(2)}.`);
  }
  if (lot.zone === 'flash') {
    // close the round and automatically open a fresh 5-minute round
    db.prepare("UPDATE lots SET round=round+1, created_at=?, ends_at=?, status='active' WHERE id=?")
      .run(now(), now() + lot.duration_ms, lot.id);
  } else if (!top) {
    // main/overseas zone, no bids — unsold: automatically relist in place
    // with a fresh round (same lot, round+1, new full duration). Keeps
    // cycling until the lot sells or the seller removes it; no duplicate
    // lots ever appear.
    db.prepare("UPDATE lots SET round=round+1, created_at=?, ends_at=?, status='active' WHERE id=?")
      .run(now(), now() + lot.duration_ms, lot.id);
    endingSoonSent.delete(lot.id);
  } else {
    db.prepare("UPDATE lots SET status='ended' WHERE id=?").run(lot.id);
  }
}
const endingSoonSent = new Set();
function lifecycleSweep() {
  const t = now();
  const lots = db.prepare("SELECT * FROM lots WHERE status='active'").all();
  for (const lot of lots) {
    if (t >= lot.ends_at) { finalizeLot(lot); continue; }
    // ending-soon notification (once per lot per leader)
    if (lot.ends_at - t < 15 * 60 * 1000) {
      const top = topBid(lot.id, lot.round);
      if (top && !endingSoonSent.has(lot.id)) {
        endingSoonSent.add(lot.id);
        logNotification('ending_soon', top.bidder_email, lot.id, `"${lot.title}" ends soon — you are the highest bidder.`);
      }
    }
  }
  // Auto-relist backstop: a main/overseas-zone lot sitting in 'ended' with
  // no win recorded for its round ended unsold (e.g. it closed before
  // auto-relist existed) — open a fresh round in place. Sold lots have a win
  // row and are never touched; removed lots are excluded by the status filter.
  const stale = db.prepare("SELECT * FROM lots WHERE status='ended' AND zone IN ('main','overseas')").all();
  for (const lot of stale) {
    const win = db.prepare('SELECT id FROM wins WHERE lot_id=? AND round=?').get(lot.id, lot.round);
    if (!win) {
      db.prepare("UPDATE lots SET round=round+1, created_at=?, ends_at=?, status='active' WHERE id=?")
        .run(t, t + lot.duration_ms, lot.id);
    }
  }
}
setInterval(lifecycleSweep, 30000).unref();

/* --------------------------- serialization --------------------------- */
function publicLot(lot) {
  const top = topBid(lot.id, lot.round);
  return {
    id: lot.id, title: lot.title, subtitle: lot.subtitle, category: lot.category,
    zone: lot.zone, start_cents: lot.start_cents, retail_cents: lot.retail_cents,
    qty_note: lot.qty_note, description: lot.description,
    images: JSON.parse(lot.images || '[]'),
    created_at: lot.created_at, ends_at: lot.ends_at, duration_ms: lot.duration_ms,
    round: lot.round, status: lot.status,
    current_cents: top ? top.amount_cents : lot.start_cents,
    bid_count: bidCount(lot.id, lot.round),
    has_bids: !!top,
  };
}

/* ------------------------------ http core ---------------------------- */
function sendJson(res, code, obj, headers = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => { data += c; if (data.length > 12 * 1024 * 1024) req.destroy(); });
    req.on('end', () => {
      if (!data) return resolve({});
      try { resolve(JSON.parse(data)); } catch { reject(new Error('bad json')); }
    });
    req.on('error', reject);
  });
}
function readRawBody(req) { // exact bytes — required for webhook HMAC verification
  return new Promise((resolve, reject) => {
    const chunks = [];
    let len = 0;
    req.on('data', (c) => { len += c.length; if (len > 12 * 1024 * 1024) req.destroy(); chunks.push(c); });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}
function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}
async function visitor(req, res) {
  const cookies = parseCookies(req);
  let vid = cookies.kda_visitor;
  if (!vid) {
    vid = crypto.randomUUID();
    res.setHeader('Set-Cookie', `kda_visitor=${vid}; Path=/; Max-Age=31536000; SameSite=Lax`);
  }
  const state = await stateFromIp(clientIp(req));
  return { vid, state };
}
const validEmail = (e) => typeof e === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());
function validUsPhone(p) {
  const d = String(p || '').replace(/\D/g, '');
  return d.length === 10 || (d.length === 11 && d.startsWith('1'));
}
function sellerAuth(req) { return verifyPasscode(req.headers['x-seller-passcode'] || ''); }

/* ------------------------------ Stripe ------------------------------- */
function stripeEncode(params) { // Stripe REST API takes form-encoded bracket notation
  const pairs = [];
  const walk = (key, val) => {
    if (val === undefined || val === null) return;
    if (Array.isArray(val)) { val.forEach((v, i) => walk(`${key}[${i}]`, v)); return; }
    if (typeof val === 'object') { for (const [k, v] of Object.entries(val)) walk(`${key}[${k}]`, v); return; }
    pairs.push(`${key}=${encodeURIComponent(String(val))}`);
  };
  for (const [k, v] of Object.entries(params)) walk(k, v);
  // Stripe substitutes the literal {CHECKOUT_SESSION_ID} placeholder in success_url
  return pairs.join('&').replace(/%7BCHECKOUT_SESSION_ID%7D/g, '{CHECKOUT_SESSION_ID}');
}
async function stripeApi(method, pathName, params) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000); // a hung network must never stall checkout
  try {
    const r = await fetch(`https://api.stripe.com/v1${pathName}`, {
      method,
      signal: ctrl.signal,
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        ...(params ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {}),
      },
      body: params ? stripeEncode(params) : undefined,
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      const e = new Error((j.error && j.error.message) || `stripe_http_${r.status}`);
      e.stripeError = j.error || null;
      throw e;
    }
    return j;
  } finally { clearTimeout(timer); }
}
function verifyStripeSignature(rawBody, sigHeader, secret) {
  if (!sigHeader || !secret) return false;
  let t = null;
  const v1s = [];
  for (const part of String(sigHeader).split(',')) {
    const i = part.indexOf('=');
    if (i < 0) continue;
    const k = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (k === 't') t = val;
    if (k === 'v1') v1s.push(val);
  }
  if (!t || !v1s.length) return false;
  const ts = Number(t);
  if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > 300) return false; // 5-minute tolerance
  const expected = crypto.createHmac('sha256', secret).update(`${t}.`).update(rawBody).digest('hex');
  const expBuf = Buffer.from(expected);
  return v1s.some((v1) => {
    const b = Buffer.from(v1);
    return b.length === expBuf.length && crypto.timingSafeEqual(b, expBuf);
  });
}
function markOrderPaid(orderId, sessionId) {
  const o = db.prepare('SELECT stripe_session_id FROM orders WHERE id=?').get(orderId);
  if (!o) return;
  db.prepare("UPDATE orders SET status='paid', paid_at=?, stripe_session_id=? WHERE id=?")
    .run(now(), sessionId || o.stripe_session_id || '', orderId);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const p = url.pathname;
  try {
    /* ------------------------------ API ------------------------------ */
    if (p === '/api/lots' && req.method === 'GET') {
      lifecycleSweep();
      const lots = db.prepare("SELECT * FROM lots WHERE status IN ('active','ended') ORDER BY zone DESC, ends_at ASC").all().map(publicLot);
      return sendJson(res, 200, { now: now(), lots });
    }
    if (p.startsWith('/api/lots/') && req.method === 'GET') {
      lifecycleSweep();
      const id = Number(p.split('/')[3]);
      const lot = db.prepare('SELECT * FROM lots WHERE id=?').get(id);
      if (!lot || lot.status === 'removed' || lot.status === 'cancelled') return sendJson(res, 404, { error: 'not_found' });
      return sendJson(res, 200, { now: now(), lot: publicLot(lot) });
    }
    if (p === '/api/track' && req.method === 'POST') {
      const body = await readBody(req);
      const { vid, state } = await visitor(req, res);
      const type = body.type === 'lot' ? 'lot' : 'page';
      db.prepare('INSERT INTO events(type,lot_id,visitor_id,state,created_at) VALUES(?,?,?,?,?)')
        .run(type, body.lotId ? Number(body.lotId) : null, vid, state, now());
      return sendJson(res, 200, { ok: true });
    }
    if (p === '/api/bid' && req.method === 'POST') {
      const body = await readBody(req);
      lifecycleSweep();
      const lot = db.prepare('SELECT * FROM lots WHERE id=?').get(Number(body.lotId));
      if (!lot) return sendJson(res, 404, { error: 'not_found' });
      if (lot.status !== 'active' || now() >= lot.ends_at) return sendJson(res, 400, { error: 'auction_ended' });
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      if (name.length < 2) return sendJson(res, 400, { error: 'name_required' });
      if (!validEmail(email)) return sendJson(res, 400, { error: 'invalid_email' });
      const amount = Math.round(Number(body.amount) * 100);
      const top = topBid(lot.id, lot.round);
      const minNext = top ? top.amount_cents + 50 : lot.start_cents;
      if (!Number.isFinite(amount) || amount < minNext) return sendJson(res, 400, { error: 'bid_too_low', min_cents: minNext });
      const stepBase = top ? top.amount_cents : lot.start_cents;
      if ((amount - stepBase) % 50 !== 0) return sendJson(res, 400, { error: 'bid_step' });
      let bidder = getBidderByEmail(email);
      if (!bidder) {
        db.prepare('INSERT INTO bidders(name,email,created_at) VALUES(?,?,?)').run(name, email, now());
        bidder = getBidderByEmail(email);
      } else if (bidder.name !== name) {
        db.prepare('UPDATE bidders SET name=? WHERE id=?').run(name, bidder.id);
      }
      const prevTop = top;
      db.prepare('INSERT INTO bids(lot_id,round,bidder_id,amount_cents,created_at) VALUES(?,?,?,?,?)')
        .run(lot.id, lot.round, bidder.id, amount, now());
      // traffic event for the bid (no IP stored)
      const { vid, state } = await visitor(req, res);
      db.prepare('INSERT INTO events(type,lot_id,visitor_id,state,created_at) VALUES(?,?,?,?,?)')
        .run('bid', lot.id, vid, state, now());
      if (prevTop && prevTop.bidder_id !== bidder.id) {
        logNotification('outbid', prevTop.bidder_email, lot.id, `You were outbid on "${lot.title}". Current bid: $${(amount / 100).toFixed(2)}.`);
      }
      // flash zone: a bid in the last 30 seconds extends the round by 30s
      let endsAt = lot.ends_at;
      if (lot.zone === 'flash' && endsAt - now() <= 30000) {
        endsAt += 30000;
        db.prepare('UPDATE lots SET ends_at=? WHERE id=?').run(endsAt, lot.id);
      }
      return sendJson(res, 200, { ok: true, current_cents: amount, ends_at: endsAt, bid_count: bidCount(lot.id, lot.round) });
    }
    if (p === '/api/my/bids' && req.method === 'GET') {
      lifecycleSweep();
      const email = (url.searchParams.get('email') || '').trim().toLowerCase();
      if (!validEmail(email)) return sendJson(res, 400, { error: 'invalid_email' });
      const bidder = getBidderByEmail(email);
      if (!bidder) return sendJson(res, 200, { bids: [], wins: [] });
      const bids = db.prepare(`SELECT b.amount_cents, b.created_at, l.id AS lot_id, l.title, l.images, l.status, l.ends_at, l.zone, l.round AS lot_round, b.round AS bid_round,
          (SELECT MAX(amount_cents) FROM bids WHERE lot_id=l.id AND round=b.round) AS top_cents
        FROM bids b JOIN lots l ON l.id=b.lot_id WHERE b.bidder_id=? ORDER BY b.created_at DESC`).all(bidder.id)
        .map((b) => ({ ...b, cover: (JSON.parse(b.images || '[]')[0] || null), images: undefined }));
      const wins = db.prepare(`SELECT w.id AS win_id, w.amount_cents, w.lot_id, l.title, l.images, w.order_id
        FROM wins w JOIN lots l ON l.id=w.lot_id WHERE w.bidder_id=? ORDER BY w.created_at DESC`).all(bidder.id)
        .map((w) => ({ ...w, images: JSON.parse(w.images || '[]') }));
      return sendJson(res, 200, { bids, wins });
    }
    if (p === '/api/checkout/quote' && req.method === 'POST') {
      const body = await readBody(req);
      const item = Number(body.item_cents) || 0;
      const method = body.method === 'ship' ? 'ship' : 'pickup';
      const state = String(body.state || '').toUpperCase();
      const shipping = method === 'pickup' ? 0 : (item >= FREE_SHIP_THRESHOLD_CENTS ? 0 : SHIP_FEE_CENTS);
      const tax = (method === 'pickup' || state === 'CA') ? money(item * TAX_RATE_CA) : 0;
      const promo = promoFromBody(body, body.email, item);
      return sendJson(res, 200, { item_cents: item, shipping_cents: shipping, tax_cents: tax, discount_cents: promo.discount, promo_state: promo.state, total_cents: item + shipping + tax - promo.discount, tax_rate: TAX_RATE_CA });
    }
    if (p === '/api/checkout' && req.method === 'POST') {
      const body = await readBody(req);
      lifecycleSweep();
      const win = db.prepare('SELECT w.*, l.title FROM wins w JOIN lots l ON l.id=w.lot_id WHERE w.id=?').get(Number(body.winId));
      if (!win) return sendJson(res, 404, { error: 'win_not_found' });
      if (win.order_id) return sendJson(res, 400, { error: 'already_ordered' });
      const bidder = db.prepare('SELECT * FROM bidders WHERE id=?').get(win.bidder_id);
      const email = String(body.email || '').trim().toLowerCase();
      if (!bidder || bidder.email !== email) return sendJson(res, 403, { error: 'winner_email_mismatch' });
      if (!validUsPhone(body.phone)) return sendJson(res, 400, { error: 'invalid_phone' });
      const method = body.method === 'ship' ? 'ship' : 'pickup';
      const state = String(body.state || '').toUpperCase();
      if (method === 'ship' && state.length !== 2) return sendJson(res, 400, { error: 'state_required' });
      const item = win.amount_cents;
      const shipping = method === 'pickup' ? 0 : (item >= FREE_SHIP_THRESHOLD_CENTS ? 0 : SHIP_FEE_CENTS);
      const tax = (method === 'pickup' || state === 'CA') ? money(item * TAX_RATE_CA) : 0;
      const promo = promoFromBody(body, bidder.email, item);
      const discount = promo.discount;
      const total = item + shipping + tax - discount;
      const r = db.prepare(`INSERT INTO orders(win_id,lot_id,buyer_name,buyer_email,phone,method,dest_state,address,item_cents,shipping_cents,tax_cents,total_cents,created_at,status,promo_code,discount_cents)
        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`).run(win.id, win.lot_id, bidder.name, bidder.email, String(body.phone).trim(), method,
        method === 'pickup' ? 'CA' : state, String(body.address || '').trim(), item, shipping, tax, total, now(),
        STRIPE_ENABLED ? 'pending_payment' : 'awaiting_contact', discount > 0 ? PROMO_CODE : '', discount);
      const orderId = Number(r.lastInsertRowid);
      db.prepare('UPDATE wins SET order_id=? WHERE id=?').run(orderId, win.id);
      const base = { ok: true, order_id: orderId, item_cents: item, shipping_cents: shipping, tax_cents: tax, discount_cents: discount, promo_state: promo.state, total_cents: total };
      if (!STRIPE_ENABLED) return sendJson(res, 200, base); // record-only mode (no keys configured)
      try {
        const session = await stripeApi('POST', '/checkout/sessions', {
          mode: 'payment',
          customer_email: bidder.email,
          line_items: [{ quantity: 1, price_data: { currency: 'usd', unit_amount: total, product_data: { name: `${win.title} — Kanstar Daily Auction` } } }],
          metadata: { order_id: String(orderId) },
          success_url: `${SITE_URL}/?paid=${orderId}&session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${SITE_URL}/?pay_cancelled=${orderId}`,
        });
        db.prepare('UPDATE orders SET stripe_session_id=? WHERE id=?').run(session.id, orderId);
        return sendJson(res, 200, { ...base, checkout_url: session.url });
      } catch (e) {
        // Order stays 'pending_payment' so the seller can see and follow up; never crash checkout.
        console.error(`[stripe] session create failed for order ${orderId}: ${e.message}`);
        return sendJson(res, 502, { error: 'payment_unavailable', order_id: orderId });
      }
    }
    if (p === '/api/stripe/webhook' && req.method === 'POST') {
      const raw = await readRawBody(req);
      if (!STRIPE_WEBHOOK_SECRET) {
        console.error('[stripe] webhook received but STRIPE_WEBHOOK_SECRET is not set');
        return sendJson(res, 400, { error: 'webhook_not_configured' });
      }
      if (!verifyStripeSignature(raw, req.headers['stripe-signature'], STRIPE_WEBHOOK_SECRET)) {
        console.error('[stripe] webhook signature verification failed');
        return sendJson(res, 400, { error: 'bad_signature' });
      }
      let evt;
      try { evt = JSON.parse(raw.toString('utf8')); } catch { return sendJson(res, 400, { error: 'bad_json' }); }
      try {
        const s = (evt.data && evt.data.object) || {};
        const orderId = Number(s.metadata && s.metadata.order_id);
        if (evt.type === 'checkout.session.completed' && orderId) {
          markOrderPaid(orderId, s.id);
          console.log(`[stripe] order ${orderId} marked paid (session ${s.id})`);
        } else if (evt.type === 'checkout.session.expired' && orderId) {
          db.prepare("UPDATE orders SET status='payment_expired' WHERE id=? AND status='pending_payment'").run(orderId);
          console.log(`[stripe] order ${orderId} payment session expired`);
        }
      } catch (e) { console.error('[stripe] webhook handler error:', e); }
      return sendJson(res, 200, { received: true });
    }
    if (p === '/api/orders/status' && req.method === 'GET') {
      const orderId = Number(url.searchParams.get('order_id'));
      const sessionId = url.searchParams.get('session_id') || '';
      const order = db.prepare('SELECT * FROM orders WHERE id=?').get(orderId);
      if (!order) return sendJson(res, 404, { error: 'order_not_found' });
      // Reconcile with Stripe when the webhook may not have landed yet.
      // Only the order's own stored session_id is accepted for this.
      if (order.status === 'pending_payment' && STRIPE_ENABLED && sessionId && order.stripe_session_id && sessionId === order.stripe_session_id) {
        try {
          const s = await stripeApi('GET', `/checkout/sessions/${encodeURIComponent(sessionId)}`);
          if (s.payment_status === 'paid') {
            markOrderPaid(order.id, sessionId);
            order.status = 'paid';
          }
        } catch (e) { console.error(`[stripe] session retrieve failed for order ${order.id}: ${e.message}`); }
      }
      return sendJson(res, 200, { order_id: order.id, status: order.status, paid: order.status === 'paid', total_cents: order.total_cents });
    }
    if (p === '/api/messages' && req.method === 'POST') {
      const body = await readBody(req);
      const name = String(body.name || '').trim();
      const email = String(body.email || '').trim().toLowerCase();
      const text = String(body.body || '').trim();
      if (name.length < 2 || !validEmail(email) || text.length < 3) return sendJson(res, 400, { error: 'invalid_message' });
      let lotTitle = '';
      if (body.lotId) { const l = db.prepare('SELECT title FROM lots WHERE id=?').get(Number(body.lotId)); if (l) lotTitle = l.title; }
      const code = crypto.randomBytes(6).toString('hex').toUpperCase();
      db.prepare('INSERT INTO messages(lot_id,lot_title,name,email,body,receipt_code,created_at) VALUES(?,?,?,?,?,?,?)')
        .run(body.lotId ? Number(body.lotId) : null, lotTitle, name, email, text, code, now());
      return sendJson(res, 200, { ok: true, receipt_code: code });
    }
    if (p.startsWith('/api/messages/by-code/') && req.method === 'GET') {
      const code = decodeURIComponent(p.split('/')[4] || '').toUpperCase();
      const m = db.prepare('SELECT lot_title, body, seller_reply, replied_at, created_at FROM messages WHERE receipt_code=?').get(code);
      if (!m) return sendJson(res, 404, { error: 'code_not_found' });
      return sendJson(res, 200, { message: m });
    }

    /* ------------------------- seller backend ------------------------ */
    if (p === '/api/seller/auth' && req.method === 'POST') {
      const body = await readBody(req);
      return verifyPasscode(body.passcode || '')
        ? sendJson(res, 200, { ok: true })
        : sendJson(res, 401, { ok: false });
    }
    if (p.startsWith('/api/seller/')) {
      if (!sellerAuth(req)) return sendJson(res, 401, { error: 'unauthorized' }); // wrong passcode -> nothing
      if (p === '/api/seller/lots' && req.method === 'POST') {
        const body = await readBody(req);
        const title = String(body.title || '').trim();
        if (title.length < 3) return sendJson(res, 400, { error: 'title_required' });
        const zone = body.zone === 'flash' ? 'flash' : body.zone === 'overseas' ? 'overseas' : 'main';
        const duration = zone === 'flash' ? 5 * 60 * 1000 : 24 * 3600 * 1000;
        const imagePaths = [];
        if (Array.isArray(body.images)) {
          for (const dataUrl of body.images.slice(0, 8)) {
            const m = /^data:image\/(png|jpe?g|webp);base64,(.+)$/.exec(String(dataUrl));
            if (!m) continue;
            const ext = m[1] === 'png' ? 'png' : 'jpg';
            const fname = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
            fs.writeFileSync(path.join(UPLOADS_DIR, fname), Buffer.from(m[2], 'base64'));
            imagePaths.push(`/uploads/${fname}`);
          }
        }
        const r = db.prepare(`INSERT INTO lots(title,subtitle,category,zone,start_cents,retail_cents,qty_note,description,images,created_at,ends_at,duration_ms,round,status)
          VALUES(?,?,?,?,?,?,?,?,?,?,?,?,1,'active')`).run(
          title, String(body.subtitle || ''), String(body.category || ''), zone,
          Math.max(100, Math.round(Number(body.start) * 100) || 100),
          body.retail ? Math.round(Number(body.retail) * 100) : null,
          String(body.qty_note || ''), String(body.description || ''),
          JSON.stringify(imagePaths), now(), now() + duration, duration);
        // daily-new-lots notification records for known bidders
        const emails = db.prepare('SELECT email FROM bidders').all();
        for (const e of emails) logNotification('daily_new', e.email, r.lastInsertRowid, `New lot listed: "${title}".`);
        return sendJson(res, 200, { ok: true, lot_id: r.lastInsertRowid });
      }
      if (p === '/api/seller/lots' && req.method === 'GET') {
        // Full lot list for the seller Manage tab (includes ended/removed).
        const lots = db.prepare('SELECT * FROM lots ORDER BY (status=\'active\') DESC, ends_at ASC').all().map(publicLot);
        return sendJson(res, 200, { lots });
      }
      if (p.startsWith('/api/seller/lots/') && req.method === 'PATCH') {
        // Edit a live lot in place: prices and copy. Only 'active' lots can be
        // edited (an unsold 'ended' lot reopens within one sweep; a sold one is
        // history). The starting price locks once the current round has bids,
        // so a live auction's terms never change under its bidders.
        const id = Number(p.split('/')[4]);
        const lot = db.prepare('SELECT * FROM lots WHERE id=?').get(id);
        if (!lot) return sendJson(res, 404, { error: 'not_found' });
        if (lot.status === 'removed') return sendJson(res, 400, { error: 'lot_removed' });
        if (lot.status !== 'active') return sendJson(res, 400, { error: 'lot_not_active' });
        const body = await readBody(req);
        const sets = [], vals = [];
        if (body.title !== undefined) {
          const title = String(body.title || '').trim();
          if (title.length < 3) return sendJson(res, 400, { error: 'title_required' });
          sets.push('title=?'); vals.push(title);
        }
        for (const [field, col] of [['subtitle', 'subtitle'], ['category', 'category'], ['qty_note', 'qty_note'], ['description', 'description']]) {
          if (body[field] !== undefined) { sets.push(`${col}=?`); vals.push(String(body[field])); }
        }
        if (body.start !== undefined) {
          const cents = Math.max(100, Math.round(Number(body.start) * 100) || 0);
          if (!cents) return sendJson(res, 400, { error: 'bad_start' });
          if (cents !== lot.start_cents && bidCount(lot.id, lot.round) > 0) {
            return sendJson(res, 400, { error: 'has_bids_price_locked' });
          }
          sets.push('start_cents=?'); vals.push(cents);
        }
        if (body.retail !== undefined) {
          sets.push('retail_cents=?');
          vals.push(body.retail === null || body.retail === '' ? null : Math.max(0, Math.round(Number(body.retail) * 100) || 0));
        }
        if (!sets.length) return sendJson(res, 400, { error: 'nothing_to_update' });
        vals.push(id);
        db.prepare(`UPDATE lots SET ${sets.join(', ')} WHERE id=?`).run(...vals);
        return sendJson(res, 200, { ok: true, lot: publicLot(db.prepare('SELECT * FROM lots WHERE id=?').get(id)) });
      }
      if (p.startsWith('/api/seller/lots/') && req.method === 'DELETE') {
        // Unlist a lot: it vanishes from the public site and stops cycling
        // (lifecycleSweep only touches 'active' lots). Bids/wins/orders rows
        // are kept — history and existing orders stay readable.
        const id = Number(p.split('/')[4]);
        const lot = db.prepare('SELECT id, status FROM lots WHERE id=?').get(id);
        if (!lot) return sendJson(res, 404, { error: 'not_found' });
        if (lot.status !== 'removed') db.prepare("UPDATE lots SET status='removed' WHERE id=?").run(id);
        return sendJson(res, 200, { ok: true, lot_id: id, status: 'removed' });
      }
      if (p.startsWith('/api/seller/lots/') && p.endsWith('/cancel') && req.method === 'POST') {
        // Cancel a live auction (seller misclick / change of mind): the round
        // is voided — no winner is ever declared for it — and the lot leaves
        // the public site. It can be brought back any time with /relist.
        const id = Number(p.split('/')[4]);
        const lot = db.prepare('SELECT * FROM lots WHERE id=?').get(id);
        if (!lot) return sendJson(res, 404, { error: 'not_found' });
        if (lot.status !== 'active') return sendJson(res, 400, { error: 'lot_not_active' });
        const win = db.prepare('SELECT id FROM wins WHERE lot_id=? AND round=?').get(id, lot.round);
        if (win) return sendJson(res, 400, { error: 'already_won' });
        const top = topBid(lot.id, lot.round);
        db.prepare("UPDATE lots SET status='cancelled' WHERE id=?").run(id);
        if (top) logNotification('auction_cancelled', top.bidder_email, lot.id, `The auction for "${lot.title}" was cancelled by the seller. Your bid has been voided.`);
        return sendJson(res, 200, { ok: true, lot_id: id, status: 'cancelled' });
      }
      if (p.startsWith('/api/seller/lots/') && p.endsWith('/relist') && req.method === 'POST') {
        // One-click relist: reopen any finished lot (ended, removed or
        // cancelled) in place — same lot, round+1, same prices and photos,
        // fresh full duration. For a sold lot this sells another unit; the
        // old win and its order stay untouched.
        const id = Number(p.split('/')[4]);
        const lot = db.prepare('SELECT * FROM lots WHERE id=?').get(id);
        if (!lot) return sendJson(res, 404, { error: 'not_found' });
        if (lot.status === 'active') return sendJson(res, 400, { error: 'already_active' });
        const t = now();
        db.prepare("UPDATE lots SET round=round+1, created_at=?, ends_at=?, status='active' WHERE id=?")
          .run(t, t + lot.duration_ms, id);
        endingSoonSent.delete(id);
        return sendJson(res, 200, { ok: true, lot: publicLot(db.prepare('SELECT * FROM lots WHERE id=?').get(id)) });
      }
      if (p === '/api/seller/inbox' && req.method === 'GET') {
        const msgs = db.prepare('SELECT * FROM messages ORDER BY created_at DESC LIMIT 200').all();
        const unread = db.prepare('SELECT COUNT(*) AS c FROM messages WHERE is_read=0').get().c;
        return sendJson(res, 200, { messages: msgs, unread });
      }
      if (p === '/api/seller/inbox/read' && req.method === 'POST') {
        db.prepare('UPDATE messages SET is_read=1 WHERE is_read=0').run();
        return sendJson(res, 200, { ok: true });
      }
      if (p === '/api/seller/inbox/reply' && req.method === 'POST') {
        const body = await readBody(req);
        const reply = String(body.reply || '').trim();
        if (!reply) return sendJson(res, 400, { error: 'reply_required' });
        db.prepare('UPDATE messages SET seller_reply=?, replied_at=?, is_read=1 WHERE id=?').run(reply, now(), Number(body.id));
        return sendJson(res, 200, { ok: true });
      }
      if (p === '/api/seller/orders' && req.method === 'GET') {
        const orders = db.prepare('SELECT o.*, l.title FROM orders o JOIN lots l ON l.id=o.lot_id ORDER BY o.created_at DESC LIMIT 200').all()
          .map((o) => ({
            ...o,
            payment_status: o.status === 'paid' ? 'paid'
              : o.status === 'pending_payment' ? 'pending_payment'
              : o.status === 'payment_expired' ? 'payment_expired'
              : 'recorded', // record-only order (no Stripe payment taken): unpaid (recorded)
          }));
        return sendJson(res, 200, { orders });
      }
      if (p === '/api/seller/unread' && req.method === 'GET') {
        const unread = db.prepare('SELECT COUNT(*) AS c FROM messages WHERE is_read=0').get().c;
        return sendJson(res, 200, { unread });
      }
      if (p === '/api/seller/traffic' && req.method === 'GET') {
        const t = now();
        const range = ['today', 'yesterday', '3d', '7d', '30d'].includes(url.searchParams.get('range')) ? url.searchParams.get('range') : 'today';
        const daysBack = { today: 0, yesterday: 1, '3d': 2, '7d': 6, '30d': 29 }[range];
        const rs = laRangeStartMs(daysBack, t); // range boundary at LA midnight
        const re = range === 'yesterday' ? laRangeStartMs(0, t) : null; // yesterday is a closed window [rs, re)
        const W = re ? 'created_at>=? AND created_at<?' : 'created_at>=?';
        const WE = re ? 'e.created_at>=? AND e.created_at<?' : 'e.created_at>=?';
        const WB = re ? 'b.created_at>=? AND b.created_at<?' : 'b.created_at>=?';
        const WP = re ? [rs, re] : [rs];
        const one = (sql, ...a) => db.prepare(sql).get(...a).c;
        // Unique counting (user rule, 2026-11-01): the same visitor counts once
        // per page/lot viewed in the range, no matter how many times they clicked.
        const stats = {
          visitors: one(`SELECT COUNT(DISTINCT visitor_id) AS c FROM events WHERE ${W}`, ...WP),
          page_views: one(`SELECT COUNT(DISTINCT visitor_id) AS c FROM events WHERE type='page' AND ${W}`, ...WP),
          lot_views: one(`SELECT COUNT(DISTINCT visitor_id || ':' || lot_id) AS c FROM events WHERE type='lot' AND ${W}`, ...WP),
          bids: one(`SELECT COUNT(*) AS c FROM bids WHERE ${W}`, ...WP),
        };
        const hourVisitors = Array.from({ length: 24 }, () => new Set());
        const hourSlots = Array.from({ length: 24 }, () => new Set());
        for (const e of db.prepare(`SELECT visitor_id, created_at FROM events WHERE ${W}`).all(...WP)) {
          const h = laHour(e.created_at);
          hourVisitors[h].add(e.visitor_id);
          hourSlots[h].add(e.visitor_id + '|' + laDayKey(e.created_at));
        }
        const hourly = Array.from({ length: 24 }, (_, h) => ({ hour: h, views: hourSlots[h].size, visitors: hourVisitors[h].size }));
        const byLot = db.prepare(`SELECT l.id, l.title, l.images, l.status, l.zone,
            (SELECT COUNT(DISTINCT e.visitor_id) FROM events e WHERE e.type='lot' AND e.lot_id=l.id AND ${WE}) AS views,
            (SELECT COUNT(*) FROM bids b WHERE b.lot_id=l.id AND ${WB}) AS bids
          FROM lots l ORDER BY views DESC, bids DESC LIMIT 30`).all(...WP, ...WP)
          .map((r) => ({ ...r, cover: (JSON.parse(r.images || '[]')[0] || null), images: undefined }));
        const byState = db.prepare(`SELECT state, COUNT(DISTINCT visitor_id) AS visitors FROM events WHERE ${W} GROUP BY state ORDER BY visitors DESC`).all(...WP);
        return sendJson(res, 200, { range, stats, hourly, by_lot: byLot, by_state: byState, generated_at: t });
      }
      if (p === '/api/seller/bidstats' && req.method === 'GET') {
        const t = now();
        const range = ['today', 'yesterday', '3d', '7d', '30d'].includes(url.searchParams.get('range')) ? url.searchParams.get('range') : 'today';
        const daysBack = { today: 0, yesterday: 1, '3d': 2, '7d': 6, '30d': 29 }[range];
        const rs = laRangeStartMs(daysBack, t); // range boundary at LA midnight
        const re = range === 'yesterday' ? laRangeStartMs(0, t) : null; // yesterday is a closed window [rs, re)
        const W = re ? 'created_at>=? AND created_at<?' : 'created_at>=?';
        const WB = re ? 'b.created_at>=? AND b.created_at<?' : 'b.created_at>=?';
        const WP = re ? [rs, re] : [rs];
        const one = (sql, ...a) => db.prepare(sql).get(...a).c;
        const stats = {
          total_bids: one(`SELECT COUNT(*) AS c FROM bids WHERE ${W}`, ...WP),
          unique_bidders: one(`SELECT COUNT(DISTINCT bidder_id) AS c FROM bids WHERE ${W}`, ...WP),
          lots_with_bids: one(`SELECT COUNT(DISTINCT lot_id) AS c FROM bids WHERE ${W}`, ...WP),
          highest_bid_cents: one(`SELECT COALESCE(MAX(amount_cents),0) AS c FROM bids WHERE ${W}`, ...WP),
          wins_in_range: one(`SELECT COUNT(*) AS c FROM wins WHERE ${W}`, ...WP),
          won_value_cents: one(`SELECT COALESCE(SUM(amount_cents),0) AS c FROM wins WHERE ${W}`, ...WP),
          // Live snapshot (not range-bound): for each active lot, its current-round
          // high bid; lots without bids contribute nothing.
          live_bid_total_cents: one(`SELECT COALESCE(SUM(hi),0) AS c FROM (
            SELECT (SELECT MAX(b.amount_cents) FROM bids b WHERE b.lot_id=l.id AND b.round=l.round) AS hi
            FROM lots l WHERE l.status='active') WHERE hi IS NOT NULL`),
          live_lots_with_bids: one(`SELECT COUNT(*) AS c FROM lots l WHERE l.status='active'
            AND EXISTS (SELECT 1 FROM bids b WHERE b.lot_id=l.id AND b.round=l.round)`),
        };
        const hourCounts = Array.from({ length: 24 }, () => 0);
        for (const b of db.prepare(`SELECT created_at FROM bids WHERE ${W}`).all(...WP)) {
          hourCounts[laHour(b.created_at)]++;
        }
        const hourly = hourCounts.map((bids, hour) => ({ hour, bids }));
        const byLot = db.prepare(`SELECT l.id, l.title, l.images, l.status, l.round,
            (SELECT COUNT(*) FROM bids b WHERE b.lot_id=l.id AND ${WB}) AS bids,
            (SELECT COUNT(DISTINCT b.bidder_id) FROM bids b WHERE b.lot_id=l.id AND ${WB}) AS unique_bidders,
            (SELECT MAX(b.amount_cents) FROM bids b WHERE b.lot_id=l.id AND ${WB}) AS high_cents,
            (SELECT MAX(b.created_at) FROM bids b WHERE b.lot_id=l.id AND ${WB}) AS last_bid_at
          FROM lots l WHERE EXISTS (SELECT 1 FROM bids b WHERE b.lot_id=l.id AND ${WB})
          ORDER BY bids DESC LIMIT 20`).all(...WP, ...WP, ...WP, ...WP, ...WP)
          .map((r) => ({ ...r, cover: (JSON.parse(r.images || '[]')[0] || null), images: undefined }));
        const recent = db.prepare(`SELECT b.lot_id, l.status AS lot_status, l.title AS lot_title, bd.name AS bidder_name, b.amount_cents, b.created_at, b.round
          FROM bids b JOIN lots l ON l.id=b.lot_id JOIN bidders bd ON bd.id=b.bidder_id
          WHERE ${WB} ORDER BY b.created_at DESC LIMIT 25`).all(...WP);
        return sendJson(res, 200, { range, stats, hourly, by_lot: byLot, recent, generated_at: t });
      }
      return sendJson(res, 404, { error: 'not_found' });
    }
    if (p.startsWith('/api/')) return sendJson(res, 404, { error: 'not_found' });

    /* ---------------------------- static ----------------------------- */
    if (p.startsWith('/uploads/')) { // seller uploads are served from the data disk
      const up = path.normalize(path.join(UPLOADS_DIR, p.slice('/uploads/'.length)));
      if (!up.startsWith(UPLOADS_DIR) || !fs.existsSync(up) || fs.statSync(up).isDirectory()) { res.writeHead(404); return res.end('not found'); }
      const uext = path.extname(up).toLowerCase();
      const umime = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' }[uext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': umime, 'Cache-Control': 'public, max-age=86400' });
      return fs.createReadStream(up).pipe(res);
    }
    let filePath = path.normalize(path.join(PUBLIC_DIR, p === '/' ? 'index.html' : p));
    if (!filePath.startsWith(PUBLIC_DIR)) { res.writeHead(403); return res.end('forbidden'); }
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(PUBLIC_DIR, 'index.html'); // SPA fallback
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json', '.json': 'application/json; charset=utf-8' }[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': (ext === '.html' || ext === '.css' || ext === '.js' || p === '/sw.js') ? 'no-cache' : 'public, max-age=86400' });
    fs.createReadStream(filePath).pipe(res);
  } catch (err) {
    console.error(err);
    if (!res.headersSent) sendJson(res, 500, { error: 'server_error' });
  }
});

server.listen(PORT, () => {
  lifecycleSweep();
  console.log(`Kanstar Daily Auction listening on http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
  console.log(STRIPE_ENABLED ? `Stripe Checkout: ENABLED (site ${SITE_URL})` : 'Stripe Checkout: disabled (no STRIPE_SECRET_KEY) — checkout is record-only');
});
