'use strict';
/* Kanstar Daily Auction — front-end SPA (no framework). */

const I18N = {
  en: {
    brand_sub: 'DAILY AUCTION', nav_all: 'All Lots', nav_my: 'My Bids', nav_rules: 'Rules', nav_msg: 'My Messages',
    footer_about: "Kanstar's own warehouse auction. New lots every day — every lot starts with its own 24-hour countdown.",
    footer_pickup_h: 'Warehouse pickup', footer_help_h: 'Questions?', footer_contact: 'Contact us',
    footer_pickup: 'Free pickup on any winning bid. Shipping: free on wins of $30+, otherwise +$5. Local delivery next day; nationwide 3–7 days.',
    seller_login: 'Seller login',
    tab_local: '📍 Local Zone', tab_overseas: '🌏 Overseas Zone', tab_flash: '⚡ 5-Min Flash',
    hero_h: 'Warehouse deals, auctioned daily', hero_p: 'Every lot is sold by Kanstar only. Each lot has its own 24-hour countdown — when it hits zero, the highest bid wins.',
    live_now: 'live auctions now', err_bid_step: 'Bids go up in $0.50 steps only — please use an amount on the $0.50 ladder.', err_bid_amount: 'Please enter a valid bid amount (e.g. 12.50).',
    main_zone: 'Main Zone — 24-Hour Auctions', flash_zone: '5-Minute Flash Zone', flash_empty: 'No flash auctions right now. The seller will light this zone up soon.',
    overseas_zone: 'Overseas Zone', overseas_banner: '🌏 Overseas Zone — Ships from overseas · Arrives in 30–40 days · Consolidated shipping to our Montebello warehouse', overseas_badge: '⏳ 30–40 days delivery', overseas_empty: 'No overseas auctions right now — new items are on the way.',
    current_bid: 'Current bid', starting_bid: 'Starting bid', bids: 'bids', bid: 'bid', retail: 'Retail',
    free_ship: 'FREE SHIP $30+', free_pickup: 'FREE PICKUP', time_left: 'left', ended: 'ENDED', ends_in: 'Ends in',
    view_lot: 'View & bid', photos: 'photos',
    ask: 'Ask about this lot', your_name: 'Your name', your_email: 'Your email', message: 'Message', send: 'Send',
    msg_sent: 'Message sent! Save your receipt code to see the reply:', your_code: 'Your receipt code',
    place_bid: 'Place bid', bid_amount: 'Your bid (USD)', name: 'Name', email: 'Email',
    bid_note: 'Your name and email are only used to contact you about this auction (outbid, ending soon, winning). They are never shown publicly.',
    min_next: 'Minimum next bid', you_lead: 'You are the highest bidder!', bid_ok: 'Bid placed! You are in the lead.',
    desc: 'Details', qty: 'Quantity', category: 'Category', ask_q: 'Questions about this lot?',
    mybids_h: 'My Bids', mybids_p: 'Enter the email you bid with to see your bids and wins.', load: 'Load',
    winning: 'Winning', outbid: 'Outbid', won: 'You won!', checkout: 'Check out', ordered: 'Order placed',
    no_bids: 'No bids found for this email yet.', your_wins: 'Your wins', your_bids: 'Your bids',
    your_bid: 'Your bid', view_all: 'View all', no_active_bids: 'No active bids right now.',
    rules_h: 'Auction Rules & FAQ',
    contact_h: 'Contact Us', contact_p: 'Send us a message and we will get back to you. Save the receipt code you receive — you will need it to read our reply under My Messages.',
    mymsg_h: 'My Messages', mymsg_p: 'Enter the receipt code from your message to see it and our reply.', seller_reply: 'Kanstar replied', no_reply: 'No reply yet — check back soon.',
    code: 'Receipt code', check: 'Check',
    checkout_h: 'Checkout', delivery: 'Delivery', pickup: 'Warehouse pickup — FREE', ship: 'Ship it to me',
    pickup_at: 'Pickup at', phone: 'Phone number (for pickup / delivery contact)', state: 'State (2 letters, e.g. CA)',
    address: 'Shipping address', item: 'Winning bid', shipping: 'Shipping', tax: 'CA sales tax (9.5%)', total: 'Total',
    place_order: 'Place order', order_ok: 'Order placed! We will contact you by phone/email to arrange pickup or delivery.',
    ship_note: 'Shipping is FREE on wins of $30 or more, otherwise +$5. Local delivery next day; nationwide 3–7 days.',
    promo_code: 'Promo code', promo_apply: 'Apply', promo_discount: 'Discount', promo_applied: '$5 off applied!',
    promo_invalid: 'That code is not valid.', promo_used: 'This code was already used with this email.', promo_below_min: 'The $5 code applies to winning bids of $10 or more.',
    tax_note: 'California orders are subject to sales tax.',
    pay: 'Payment', pay_paid: 'PAID', pay_pending: 'PENDING', pay_expired: 'EXPIRED', pay_recorded: 'unpaid (recorded)',
    pay_redirecting: 'Taking you to secure card checkout…',
    pay_unavailable: 'Card payment is unavailable right now — your order was saved (shown in the seller backend) and we will contact you to arrange payment.',
    pay_received_h: 'Payment received — thank you!', pay_received_p: 'Your order is confirmed and paid. We will contact you by phone/email to arrange pickup or delivery.',
    pay_pending_h: 'Payment is still processing', pay_pending_p: 'Stripe has not confirmed your payment yet. Wait a moment and reload this page, or contact us if it does not clear.',
    pay_cancelled_h: 'Payment not completed', pay_cancelled_p: 'Your order is saved, but no payment was taken. Contact us to arrange payment or pickup.',
    seller_h: 'Seller Backend', passcode: 'Seller passcode', unlock: 'Unlock', lock: 'Lock',
    wrong_pass: 'Wrong passcode.', tab_list: 'List an item', tab_inbox: 'Inbox', tab_traffic: 'Traffic', tab_bids: 'Bid stats', tab_orders: 'Orders', tab_manage: 'Manage lots',
    edit_lot: 'Edit', save_changes: 'Save changes', saved_ok: 'Saved.', cancel: 'Cancel',
    m_start: 'Start', m_current: 'Now', m_bids: 'bids', m_round: 'Round', active_tag: 'ACTIVE', ended_tag: 'ENDED',
    err_has_bids_price_locked: 'This lot already has bids, so the starting price is locked. Other fields can still be edited.',
    err_lot_not_active: 'This lot is not live right now, so it cannot be edited.', err_lot_removed: 'This lot was removed.',
    f_title: 'Title', f_sub: 'Subtitle', f_cat: 'Category', f_zone: 'Zone', f_main: 'Main (24 hours)', f_flash: 'Flash (5 minutes)', f_overseas: 'Overseas (24 hours)',
    f_start: 'Starting price (USD)', f_retail: 'Retail price (USD, optional)', f_qty: 'Quantity note', f_desc: 'Description',
    f_photos: 'Photos (up to 8, first = cover)', list_it: 'List it', listed_ok: 'Lot listed! It is live now.',
    inbox_empty: 'No messages yet.', reply: 'Reply', reply_send: 'Send reply', mark_read: 'Mark all read',
    orders_empty: 'No orders yet.',
    remove_lot: 'Remove', removed_tag: 'REMOVED', removed_ok: 'Lot removed.',
    remove_confirm: 'Remove this lot from the site? It disappears for visitors and stops cycling. Existing wins and orders are kept.',
    cancel_lot: 'Cancel auction', cancel_confirm: 'Cancel this auction now? The round ends immediately and all bids in it are voided.',
    cancelled_tag: 'CANCELLED', cancelled_ok: 'Auction cancelled.',
    relist_lot: 'Relist', relist_confirm: 'Relist this lot? A new round starts right away at the same starting price.',
    relisted_ok: 'Relisted — new round is live.',
    mg_all: 'All', mg_local: 'Local', mg_overseas: 'Overseas', mg_flash: 'Flash',
    mg_active: 'Active', mg_ended: 'Ended', mg_cancelled: 'Cancelled', mg_sold: 'Sold (won)',
    mg_search_ph: 'Search title or #id…', mg_more: 'Show more', mg_none: 'No lots match — try a different filter.', mg_showing: 'Showing',
    t_today: 'Visitors today', t_total: 'Total visitors', t_pages: 'Page views', t_lots: 'Lot views', t_bids: 'Bids',
    t_visitors: 'Visitors', t_unique_note: 'Unique counts — repeat visits from the same visitor count once.',
    r_today: 'Today', r_yday: 'Yesterday', r_3d: '3 days', r_7d: '7 days', r_30d: '30 days', cat_all: 'All',
    t_hours: 'Traffic by hour', t_by_lot: 'Views & bids by lot', t_by_state: 'Visitors by state',
    b_total: 'Total bids', b_bidders: 'Bidders', b_lots_bids: 'Lots with bids', b_highest: 'Highest bid',
    b_live_total: 'Live bid total', b_live_lots: 'Live lots with bids', b_wins: 'Lots won', b_won_value: 'Won value',
    b_hours: 'Bids by hour', b_by_lot: 'Bids by lot', b_recent: 'Recent bids', b_high: 'High', b_last: 'Last bid',
    b_round: 'Round', b_none: 'No bids in this range yet.',
    views: 'Views', visitors: 'visitors', loading: 'Loading…', back: '← Back to lots',
    ends_soon: 'Ending soon', new_today: 'New today', per_lot_time: 'Each lot runs on its own 24-hour clock.',
    install_title: 'Get the Kanstar app', install_sub: 'Add Kanstar to your home screen for faster bidding.',
    install_app: 'Install app', install_ios: 'On iPhone: tap Share, then “Add to Home Screen”.',
  },
  es: {
    brand_sub: 'SUBASTA DIARIA', nav_all: 'Todos los lotes', nav_my: 'Mis ofertas', nav_rules: 'Reglas', nav_msg: 'Mis mensajes',
    footer_about: 'La subasta propia de Kanstar. Lotes nuevos cada día: cada lote empieza con su propia cuenta atrás de 24 horas.',
    footer_pickup_h: 'Recogida en el almacén', footer_help_h: '¿Preguntas?', footer_contact: 'Contáctanos',
    footer_pickup: 'Recogida gratis con cualquier oferta ganadora. Envío: gratis en premios de $30 o más; si no, +$5. Entrega local al día siguiente; resto del país 3–7 días.',
    seller_login: 'Acceso del vendedor',
    tab_local: '📍 Zona Local', tab_overseas: '🌏 Zona Internacional', tab_flash: '⚡ Relámpago 5 min',
    hero_h: 'Ofertas de almacén, subastadas cada día', hero_p: 'Todos los lotes los vende solo Kanstar. Cada lote tiene su propia cuenta regresiva de 24 horas: cuando llega a cero, gana la oferta más alta.',
    live_now: 'subastas en curso ahora', err_bid_step: 'Las pujas suben solo en pasos de $0.50 — usa un monto en esa escala.', err_bid_amount: 'Ingresa un monto de puja válido (ej. 12.50).',
    main_zone: 'Zona principal — Subastas de 24 horas', flash_zone: 'Zona Flash de 5 minutos', flash_empty: 'No hay subastas flash ahora. El vendedor activará esta zona pronto.',
    overseas_zone: 'Zona Internacional', overseas_banner: '🌏 Zona Internacional — Envío desde el extranjero · Llega en 30–40 días · Envío consolidado a nuestro almacén de Montebello', overseas_badge: '⏳ Entrega en 30–40 días', overseas_empty: 'No hay subastas internacionales ahora — nuevos artículos en camino.',
    current_bid: 'Oferta actual', starting_bid: 'Oferta inicial', bids: 'ofertas', bid: 'oferta', retail: 'Precio de lista',
    free_ship: 'ENVÍO GRATIS $30+', free_pickup: 'RECOGIDA GRATIS', time_left: 'restante', ended: 'TERMINADO', ends_in: 'Termina en',
    view_lot: 'Ver y ofertar', photos: 'fotos',
    ask: 'Preguntar por este lote', your_name: 'Tu nombre', your_email: 'Tu correo', message: 'Mensaje', send: 'Enviar',
    msg_sent: '¡Mensaje enviado! Guarda tu código de recibo para ver la respuesta:', your_code: 'Tu código de recibo',
    place_bid: 'Ofertar', bid_amount: 'Tu oferta (USD)', name: 'Nombre', email: 'Correo electrónico',
    bid_note: 'Tu nombre y correo solo se usan para avisarte sobre esta subasta (superado, por terminar, ganador). Nunca se muestran en público.',
    min_next: 'Oferta mínima siguiente', you_lead: '¡Vas ganando!', bid_ok: '¡Oferta registrada! Vas en primer lugar.',
    desc: 'Detalles', qty: 'Cantidad', category: 'Categoría', ask_q: '¿Preguntas sobre este lote?',
    mybids_h: 'Mis ofertas', mybids_p: 'Escribe el correo con el que ofertaste para ver tus ofertas y premios.', load: 'Cargar',
    winning: 'Ganando', outbid: 'Superado', won: '¡Ganaste!', checkout: 'Pagar', ordered: 'Pedido hecho',
    no_bids: 'Aún no hay ofertas con este correo.', your_wins: 'Tus premios', your_bids: 'Tus ofertas',
    your_bid: 'Tu oferta', view_all: 'Ver todo', no_active_bids: 'Sin ofertas activas por ahora.',
    rules_h: 'Reglas de la subasta y preguntas frecuentes',
    contact_h: 'Contáctanos', contact_p: 'Envíanos un mensaje y te responderemos. Guarda el código de recibo: lo necesitarás para leer nuestra respuesta en Mis mensajes.',
    mymsg_h: 'Mis mensajes', mymsg_p: 'Escribe el código de recibo de tu mensaje para verlo y leer nuestra respuesta.', seller_reply: 'Kanstar respondió', no_reply: 'Aún sin respuesta — vuelve pronto.',
    code: 'Código de recibo', check: 'Consultar',
    checkout_h: 'Pagar', delivery: 'Entrega', pickup: 'Recogida en almacén — GRATIS', ship: 'Envío a domicilio',
    pickup_at: 'Recogida en', phone: 'Teléfono (para coordinar recogida / envío)', state: 'Estado (2 letras, ej. CA)',
    address: 'Dirección de envío', item: 'Oferta ganadora', shipping: 'Envío', tax: 'Impuesto de CA (9.5%)', total: 'Total',
    place_order: 'Hacer el pedido', order_ok: '¡Pedido hecho! Te contactaremos por teléfono/correo para coordinar la recogida o el envío.',
    ship_note: 'El envío es GRATIS en premios de $30 o más; si no, +$5. Entrega local al día siguiente; resto del país 3–7 días.',
    promo_code: 'Código promocional', promo_apply: 'Aplicar', promo_discount: 'Descuento', promo_applied: '¡$5 de descuento aplicados!',
    promo_invalid: 'Ese código no es válido.', promo_used: 'Este código ya se usó con este correo.', promo_below_min: 'El código de $5 aplica a ofertas ganadoras de $10 o más.',
    tax_note: 'Los pedidos de California están sujetos a impuesto sobre las ventas.',
    pay: 'Pago', pay_paid: 'PAGADO', pay_pending: 'PENDIENTE', pay_expired: 'EXPIRADO', pay_recorded: 'sin pagar (registrado)',
    pay_redirecting: 'Te llevamos al pago seguro con tarjeta…',
    pay_unavailable: 'El pago con tarjeta no está disponible ahora; tu pedido quedó guardado y te contactaremos para coordinar el pago.',
    pay_received_h: '¡Pago recibido — gracias!', pay_received_p: 'Tu pedido está confirmado y pagado. Te contactaremos por teléfono/correo para coordinar la recogida o el envío.',
    pay_pending_h: 'El pago aún se está procesando', pay_pending_p: 'Stripe aún no confirma tu pago. Espera un momento y recarga esta página, o contáctanos si no se acredita.',
    pay_cancelled_h: 'Pago no completado', pay_cancelled_p: 'Tu pedido quedó guardado, pero no se hizo ningún cargo. Contáctanos para coordinar el pago o la recogida.',
    seller_h: 'Panel del vendedor', passcode: 'Clave del vendedor', unlock: 'Entrar', lock: 'Bloquear',
    wrong_pass: 'Clave incorrecta.', tab_list: 'Publicar un lote', tab_inbox: 'Bandeja', tab_traffic: 'Tráfico', tab_bids: 'Ofertas', tab_orders: 'Pedidos', tab_manage: 'Gestionar lotes',
    edit_lot: 'Editar', save_changes: 'Guardar cambios', saved_ok: 'Guardado.', cancel: 'Cancelar',
    m_start: 'Inicio', m_current: 'Ahora', m_bids: 'pujas', m_round: 'Ronda', active_tag: 'ACTIVO', ended_tag: 'TERMINADO',
    err_has_bids_price_locked: 'Este lote ya tiene pujas, así que el precio inicial está bloqueado. Los demás campos sí se pueden editar.',
    err_lot_not_active: 'Este lote no está activo ahora, así que no se puede editar.', err_lot_removed: 'Este lote fue eliminado.',
    f_title: 'Título', f_sub: 'Subtítulo', f_cat: 'Categoría', f_zone: 'Zona', f_main: 'Principal (24 horas)', f_flash: 'Flash (5 minutos)', f_overseas: 'Internacional (24 horas)',
    f_start: 'Precio inicial (USD)', f_retail: 'Precio de lista (USD, opcional)', f_qty: 'Nota de cantidad', f_desc: 'Descripción',
    f_photos: 'Fotos (hasta 8, la primera es la portada)', list_it: 'Publicar', listed_ok: '¡Lote publicado! Ya está en vivo.',
    inbox_empty: 'Aún no hay mensajes.', reply: 'Respuesta', reply_send: 'Enviar respuesta', mark_read: 'Marcar todo leído',
    orders_empty: 'Aún no hay pedidos.',
    remove_lot: 'Quitar', removed_tag: 'ELIMINADO', removed_ok: 'Lote eliminado.',
    remove_confirm: '¿Quitar este lote del sitio? Desaparece para los visitantes y deja de ciclar. Los premios y pedidos existentes se conservan.',
    cancel_lot: 'Cancelar subasta', cancel_confirm: '¿Cancelar esta subasta ahora? La ronda termina de inmediato y todas las pujas quedan anuladas.',
    cancelled_tag: 'CANCELADO', cancelled_ok: 'Subasta cancelada.',
    relist_lot: 'Republicar', relist_confirm: '¿Republicar este lote? Una nueva ronda empieza ahora con el mismo precio inicial.',
    relisted_ok: 'Republicado: la nueva ronda está activa.',
    mg_all: 'Todos', mg_local: 'Local', mg_overseas: 'Internacional', mg_flash: 'Relámpago',
    mg_active: 'Activos', mg_ended: 'Terminados', mg_cancelled: 'Cancelados', mg_sold: 'Vendidos',
    mg_search_ph: 'Buscar título o #id…', mg_more: 'Mostrar más', mg_none: 'Ningún lote coincide — prueba con otro filtro.', mg_showing: 'Mostrando',
    t_today: 'Visitantes hoy', t_total: 'Visitantes totales', t_pages: 'Vistas de página', t_lots: 'Vistas de lotes', t_bids: 'Pujas',
    t_visitors: 'Visitantes', t_unique_note: 'Conteo único — las visitas repetidas del mismo visitante cuentan una sola vez.',
    r_today: 'Hoy', r_yday: 'Ayer', r_3d: '3 días', r_7d: '7 días', r_30d: '30 días', cat_all: 'Todo',
    t_hours: 'Tráfico por hora', t_by_lot: 'Vistas y ofertas por lote', t_by_state: 'Visitantes por estado',
    b_total: 'Pujas totales', b_bidders: 'Pujadores', b_lots_bids: 'Lotes con pujas', b_highest: 'Puja más alta',
    b_live_total: 'Total en vivo', b_live_lots: 'Lotes en vivo con pujas', b_wins: 'Lotes ganados', b_won_value: 'Valor ganado',
    b_hours: 'Pujas por hora', b_by_lot: 'Pujas por lote', b_recent: 'Pujas recientes', b_high: 'Máx.', b_last: 'Última puja',
    b_round: 'Ronda', b_none: 'Aún no hay pujas en este período.',
    views: 'Vistas', visitors: 'visitantes', loading: 'Cargando…', back: '← Volver a los lotes',
    ends_soon: 'Termina pronto', new_today: 'Nuevo hoy', per_lot_time: 'Cada lote corre con su propio reloj de 24 horas.',
    install_title: 'Instala la app de Kanstar', install_sub: 'Agrega Kanstar a tu pantalla de inicio para ofertar más rápido.',
    install_app: 'Instalar la app', install_ios: 'En iPhone: toca Compartir y luego «Añadir a pantalla de inicio».',
  },
};
let lang = localStorage.getItem('kda_lang') || 'en';
let trafficRange = 'today';
let bidRange = 'today';
let homeCat = 'all';
let homeCatOverseas = 'all';
let mgZone = 'all';
let mgStatus = 'active';
let mgQuery = '';
const t = (k) => (I18N[lang] && I18N[lang][k]) || I18N.en[k] || k;
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const fmt = (c) => '$' + (c / 100).toFixed(2);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const app = $('#app');

function applyI18nStatic() {
  document.documentElement.lang = lang;
  $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
  $('#lang-en').classList.toggle('on', lang === 'en');
  $('#lang-es').classList.toggle('on', lang === 'es');
}
$('#lang-en').addEventListener('click', () => { lang = 'en'; localStorage.setItem('kda_lang', 'en'); applyI18nStatic(); render(); });
$('#lang-es').addEventListener('click', () => { lang = 'es'; localStorage.setItem('kda_lang', 'es'); applyI18nStatic(); render(); });

function toast(msg) {
  const el = $('#toast'); el.textContent = msg; el.hidden = false;
  clearTimeout(el._t); el._t = setTimeout(() => { el.hidden = true; }, 4200);
}
async function api(pathname, opts = {}) {
  const r = await fetch(pathname, { headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) }, ...opts });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error(j.error || 'error'), { data: j, status: r.status });
  return j;
}
function track(type, lotId) {
  fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ type, lotId: lotId || null }) }).catch(() => {});
}
const identity = () => { try { return JSON.parse(localStorage.getItem('kda_bidder') || 'null'); } catch { return null; } };
const setIdentity = (name, email) => localStorage.setItem('kda_bidder', JSON.stringify({ name, email }));

/* --------------------- home zone tabs (Local / Overseas / Flash) ----- */
let homeZone = 'local';
const ZONE_HASH = { '#local': 'local', '#overseas': 'overseas', '#flash': 'flash' };
/* The tab bar is sticky under the sticky header; feed it the header's real
   height (the header wraps on narrow screens) so it never overlaps content. */
function syncHeaderH() {
  const h = document.querySelector('.site-header');
  if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px');
}
window.addEventListener('resize', syncHeaderH);
syncHeaderH();
$$('.ztab').forEach((b) => b.addEventListener('click', () => {
  homeZone = b.dataset.zone;
  const target = '#' + homeZone;
  if (location.hash === target) render(); // same hash: no hashchange fires
  else location.hash = target; // hashchange -> render() -> back to top
}));
function paintZoneTabs(counts) {
  const bar = $('#zone-tabs');
  if (bar) bar.style.display = '';
  $$('.ztab').forEach((b) => b.classList.toggle('on', b.dataset.zone === homeZone));
  if (counts) for (const z of ['local', 'overseas', 'flash']) {
    const c = $('#ztc-' + z);
    if (c) c.textContent = counts[z];
  }
}
function hideZoneTabs() { const bar = $('#zone-tabs'); if (bar) bar.style.display = 'none'; }

/* ---------------------- floating My Bids window ---------------------- */
let bidsFabData = null; // cached /api/my/bids payload for the floating window
const bidLive = (b) => b.status === 'active' && b.bid_round === b.lot_round && Number(b.ends_at) > nowMs();
function myLiveBids(data) {
  const byLot = new Map();
  for (const b of data.bids) {
    if (!bidLive(b)) continue;
    const cur = byLot.get(b.lot_id);
    if (!cur || b.amount_cents > cur.amount_cents) byLot.set(b.lot_id, b);
  }
  return [...byLot.values()].sort((a, b) => a.ends_at - b.ends_at);
}
async function fetchMyBids() {
  const me = identity();
  if (!me) { bidsFabData = null; return null; }
  try { bidsFabData = await api('/api/my/bids?email=' + encodeURIComponent(me.email)); } catch { bidsFabData = null; }
  return bidsFabData;
}
function ensureBidsFab() {
  if (document.getElementById('bids-fab')) return;
  const btn = document.createElement('button');
  btn.className = 'bids-fab'; btn.id = 'bids-fab'; btn.type = 'button';
  btn.innerHTML = `🏷️ <span class="fab-label"></span><span class="fab-badge" style="display:none"></span>`;
  btn.addEventListener('click', toggleBidsPop);
  document.body.appendChild(btn);
  const pop = document.createElement('div');
  pop.className = 'bids-pop'; pop.id = 'bids-pop'; pop.style.display = 'none';
  document.body.appendChild(pop);
  document.addEventListener('click', (e) => {
    const p = document.getElementById('bids-pop');
    const b = document.getElementById('bids-fab');
    if (p && b && p.style.display !== 'none' && !p.contains(e.target) && !b.contains(e.target)) p.style.display = 'none';
  });
}
async function updateBidsFab() {
  try {
    ensureBidsFab();
    const btn = document.getElementById('bids-fab');
    if (!btn) return;
    btn.querySelector('.fab-label').textContent = t('nav_my');
    const data = bidsFabData !== null ? bidsFabData : await fetchMyBids();
    const badge = btn.querySelector('.fab-badge');
    const n = data ? myLiveBids(data).length : 0;
    badge.style.display = n ? '' : 'none';
    badge.textContent = n;
  } catch { /* floating window is best-effort */ }
}
function refreshBidsWidget() { bidsFabData = null; updateBidsFab(); }
function bindPopX() {
  const x = document.querySelector('#bids-pop .pop-x');
  if (x) x.addEventListener('click', () => { document.getElementById('bids-pop').style.display = 'none'; });
}
async function toggleBidsPop() {
  ensureBidsFab();
  const pop = document.getElementById('bids-pop');
  if (!pop) return;
  if (pop.style.display !== 'none') { pop.style.display = 'none'; return; }
  pop.style.display = '';
  pop.innerHTML = `<h3>${t('nav_my')}<button class="pop-x" type="button" aria-label="Close">×</button></h3><p class="note">${t('loading')}</p>`;
  bindPopX();
  if (!identity()) {
    pop.innerHTML = `<h3>${t('nav_my')}<button class="pop-x" type="button" aria-label="Close">×</button></h3><p class="note">${t('mybids_p')}</p><a class="btn small" href="#/my-bids">${t('nav_my')}</a>`;
    bindPopX();
    return;
  }
  await fetchMyBids();
  renderBidsPop();
  updateBidsFab();
}
function renderBidsPop() {
  const pop = document.getElementById('bids-pop');
  if (!pop || pop.style.display === 'none') return;
  const head = `<h3>${t('nav_my')}<button class="pop-x" type="button" aria-label="Close">×</button></h3>`;
  const data = bidsFabData;
  if (!data) { pop.innerHTML = head + `<p class="note">${t('no_bids')}</p>`; bindPopX(); return; }
  const live = myLiveBids(data);
  const pendingWins = data.wins.filter((w) => !w.order_id);
  let h = head;
  if (pendingWins.length) {
    h += pendingWins.map((w) => `<div class="bid-row-item">${w.images && w.images[0] ? `<img class="thumb" src="${esc(w.images[0])}" alt="">` : ''}<div class="grow"><div class="ttl">${esc(w.title)}</div><div class="det"><span class="success">${t('won')} ${fmt(w.amount_cents)}</span></div></div><a class="btn small" style="width:auto" href="#/checkout/${w.win_id}">${t('checkout')}</a></div>`).join('');
  }
  if (live.length) {
    h += live.map((b) => {
      const left = Number(b.ends_at) - nowMs();
      const winning = b.amount_cents >= b.top_cents;
      return `<div class="bid-row-item">${b.cover ? `<img class="thumb" src="${esc(b.cover)}" alt="">` : ''}<div class="grow"><div class="ttl"><a href="#/lot/${b.lot_id}">${esc(b.title)}</a></div><div class="det">${t('your_bid')} ${fmt(b.amount_cents)} · ${t('current_bid')} ${fmt(b.top_cents)} · ${fmtLeft(left)}</div></div>${winning ? `<span class="success">${t('winning')}</span>` : `<span style="color:#ff8b6b">${t('outbid')}</span>`}</div>`;
    }).join('');
  } else if (!pendingWins.length) {
    h += `<p class="note">${t('no_active_bids')}</p>`;
  }
  h += `<div class="pop-foot"><a href="#/my-bids">${t('view_all')} →</a></div>`;
  pop.innerHTML = h;
  bindPopX();
  pop.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => { pop.style.display = 'none'; }));
}

/* countdown ticker */
let serverOffset = 0;
const nowMs = () => Date.now() + serverOffset;
function fmtLeft(ms) {
  if (ms <= 0) return t('ended');
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  const p2 = (n) => String(n).padStart(2, '0');
  if (h >= 48) return `${Math.floor(h / 24)}d ${p2(h % 24)}h ${p2(m)}m`;
  return h > 0 ? `${h}h ${p2(m)}m ${p2(ss)}s` : `${m}m ${p2(ss)}s`;
}
setInterval(() => {
  $$('[data-ends]').forEach((el) => {
    const ends = Number(el.dataset.ends), created = Number(el.dataset.created || 0), dur = Number(el.dataset.dur || 0);
    const left = ends - nowMs();
    if (el.classList.contains('countbar')) {
      const fill = el.querySelector('.fill'), txt = el.querySelector('.txt');
      const pct = dur > 0 ? Math.max(0, Math.min(100, (left / dur) * 100)) : 0;
      if (fill) fill.style.width = pct + '%';
      el.classList.toggle('hot', left > 0 && left < 2 * 3600 * 1000);
      if (txt) txt.textContent = left > 0 ? `${fmtLeft(left)} · ${pct.toFixed(0)}%` : t('ended');
    } else {
      el.textContent = left > 0 ? fmtLeft(left) : t('ended');
      el.classList.toggle('hot', left > 0 && left < 2 * 3600 * 1000);
    }
  });
}, 1000);
function countbar(lot) {
  const left = lot.ends_at - nowMs();
  const pct = lot.duration_ms > 0 ? Math.max(0, Math.min(100, (left / lot.duration_ms) * 100)) : 0;
  return `<div class="countbar ${left > 0 && left < 2 * 3600 * 1000 ? 'hot' : ''}" data-ends="${lot.ends_at}" data-created="${lot.created_at}" data-dur="${lot.duration_ms}">
    <div class="fill" style="width:${pct}%"></div><div class="txt">${left > 0 ? `${fmtLeft(left)} · ${pct.toFixed(0)}%` : t('ended')}</div></div>`;
}

/* Bid-amount validation for the text amount inputs (card quick-bid + lot
   detail). Mirrors the old type=number min/step blocking plus the server
   ladder: minCents is the next allowed bid; valid amounts sit on the $0.50
   ladder from it ((cents - minCents) % 50 === 0 is equivalent to the
   server's (amount - stepBase) % 50 check for both the no-bid and has-bid
   cases). Returns {amount} in dollars or {error: 'invalid'|'low'|'step'}. */
function checkBidAmount(raw, minCents) {
  const s = String(raw == null ? '' : raw).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return { error: 'invalid' };
  const cents = Math.round(Number(s) * 100);
  if (cents < minCents) return { error: 'low' };
  if ((cents - minCents) % 50 !== 0) return { error: 'step' };
  return { amount: cents / 100 };
}
function bidAmountErrorText(kind, minCents) {
  if (kind === 'low') return `${t('min_next')}: ${fmt(minCents)}`;
  if (kind === 'step') return t('err_bid_step');
  return t('err_bid_amount');
}

/* ------------------------------- pages ------------------------------- */
function lotCard(lot) {
  const ended = lot.status === 'ended' || lot.ends_at <= nowMs();
  const me = identity();
  const qbMin = lot.has_bids ? lot.current_cents + 50 : lot.start_cents;
  return `<article class="card">
    <a class="photo" href="#/lot/${lot.id}"><img src="${esc(lot.images[0] || '')}" alt="${esc(lot.title)}" loading="lazy"></a>
    ${countbar(lot)}
    <div class="body">
      <h3><a href="#/lot/${lot.id}">${esc(lot.title)}</a></h3>
      <div class="sub">${esc(lot.subtitle)}</div>
      <div class="badges"><span class="chip ship">${t('free_ship')}</span><span class="chip ship">${t('free_pickup')}</span>${lot.zone === 'overseas' ? `<span class="chip overseas">${t('overseas_badge')}</span>` : ''}${lot.qty_note ? `<span class="chip">${esc(lot.qty_note)}</span>` : ''}</div>
      <div class="price-row"><span class="price">${fmt(lot.current_cents)}</span>${lot.retail_cents ? `<span class="retail">${fmt(lot.retail_cents)}</span>` : ''}</div>
      <div class="meta"><span>${lot.has_bids ? t('current_bid') : t('starting_bid')} · ${lot.bid_count} ${lot.bid_count === 1 ? t('bid') : t('bids')}</span>
      <span class="${ended ? 'ended-tag' : ''}" data-ends="${lot.ends_at}">${ended ? t('ended') : fmtLeft(lot.ends_at - nowMs())}</span></div>
      ${ended ? '' : `<form class="qb-form" data-lot="${lot.id}">
        ${me ? '' : `<input class="q-name" placeholder="${t('name')}" autocomplete="name" required>
        <input class="q-email" type="email" placeholder="${t('email')}" autocomplete="email" required>`}
        <div class="bid-row"><input class="q-amount" type="text" inputmode="decimal" data-min-cents="${qbMin}" value="${(qbMin / 100).toFixed(2)}" required>
        <button class="btn" type="submit">${t('place_bid')}</button></div>
        <p class="error qb-err"></p>
      </form>`}
    </div></article>`;
}

async function pageHome() {
  app.innerHTML = `<div class="hero"><h1>${t('hero_h')}</h1><p>${t('hero_p')}</p></div><p class="note">${t('loading')}</p>`;
  const data = await api('/api/lots');
  serverOffset = data.now - Date.now();
  const mainAll = data.lots.filter((l) => l.zone === 'main' && l.status === 'active');
  const overseas = data.lots.filter((l) => l.zone === 'overseas' && l.status === 'active');
  const flash = data.lots.filter((l) => l.zone === 'flash' && l.status === 'active');
  const catCounts = {};
  for (const l of mainAll) { const c = l.category || 'Other'; catCounts[c] = (catCounts[c] || 0) + 1; }
  const cats = Object.keys(catCounts).sort((a, b) => catCounts[b] - catCounts[a] || a.localeCompare(b));
  if (homeCat !== 'all' && !catCounts[homeCat]) homeCat = 'all';
  const main = homeCat === 'all' ? mainAll : mainAll.filter((l) => (l.category || 'Other') === homeCat);
  const ocatCounts = {};
  for (const l of overseas) { const c = l.category || 'Other'; ocatCounts[c] = (ocatCounts[c] || 0) + 1; }
  const ocats = Object.keys(ocatCounts).sort((a, b) => ocatCounts[b] - ocatCounts[a] || a.localeCompare(b));
  if (homeCatOverseas !== 'all' && !ocatCounts[homeCatOverseas]) homeCatOverseas = 'all';
  const overseasShown = homeCatOverseas === 'all' ? overseas : overseas.filter((l) => (l.category || 'Other') === homeCatOverseas);
  let zoneBody;
  if (homeZone === 'overseas') {
    zoneBody = `<section class="overseas-zone solo">
      <h2 class="zone-title"><span class="overseas-badge">OVERSEAS</span>${t('overseas_zone')}</h2>
      <p class="overseas-banner">${t('overseas_banner')}</p>
      ${overseas.length ? `<div class="cat-row"><button class="btn small ${homeCatOverseas === 'all' ? '' : 'secondary'} ocat-btn" data-ocat="all">${t('cat_all')} (${overseas.length})</button>${ocats.map((c) => `<button class="btn small ${homeCatOverseas === c ? '' : 'secondary'} ocat-btn" data-ocat="${esc(c)}">${esc(c)} (${ocatCounts[c]})</button>`).join('')}</div>
      <div class="grid">${overseasShown.map(lotCard).join('')}</div>` : `<p class="note">${t('overseas_empty')}</p>`}
    </section>`;
  } else if (homeZone === 'flash') {
    zoneBody = `<section class="flash-zone solo">
      <h2 class="zone-title"><span class="flash-badge">FLASH</span>${t('flash_zone')}</h2>
      ${flash.length ? `<div class="grid">${flash.map(lotCard).join('')}</div>` : `<p class="note">${t('flash_empty')}</p>`}
    </section>`;
  } else {
    zoneBody = `<div class="cat-row"><button class="btn small ${homeCat === 'all' ? '' : 'secondary'} cat-btn" data-cat="all">${t('cat_all')} (${mainAll.length})</button>${cats.map((c) => `<button class="btn small ${homeCat === c ? '' : 'secondary'} cat-btn" data-cat="${esc(c)}">${esc(c)} (${catCounts[c]})</button>`).join('')}</div>
    <h2 class="zone-title"><span class="dot"></span>${t('main_zone')}</h2>
    <p class="note" style="margin-top:-8px">${t('per_lot_time')}</p>
    <div class="grid">${main.map(lotCard).join('')}</div>`;
  }
  app.innerHTML = `
    <div class="hero"><h1>${t('hero_h')}</h1><p>${t('hero_p')}</p><p class="hero-stat"><span class="live-dot"></span><strong>${mainAll.length + overseas.length + flash.length}</strong>&nbsp;${t('live_now')}</p></div>
    ${zoneBody}`;
  paintZoneTabs({ local: mainAll.length, overseas: overseas.length, flash: flash.length });
  $$('.qb-form').forEach((f) => f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const err = f.querySelector('.qb-err');
    err.textContent = '';
    const me = identity();
    const name = me ? me.name : f.querySelector('.q-name').value.trim();
    const email = me ? me.email : f.querySelector('.q-email').value.trim().toLowerCase();
    const amtEl = f.querySelector('.q-amount');
    const minCents = Number(amtEl.dataset.minCents);
    const chk = checkBidAmount(amtEl.value, minCents);
    if (chk.error) { err.textContent = bidAmountErrorText(chk.error, minCents); return; }
    const amount = chk.amount;
    try {
      await api('/api/bid', { method: 'POST', body: JSON.stringify({ lotId: Number(f.dataset.lot), name, email, amount }) });
      setIdentity(name, email);
      refreshBidsWidget();
      toast(t('bid_ok'));
      pageHome();
    } catch (err2) {
      err.textContent = err2.data && err2.data.error === 'bid_too_low'
        ? `${t('min_next')}: ${fmt(err2.data.min_cents)}`
        : err2.data && err2.data.error === 'bid_step' ? t('err_bid_step') : ((err2.data && err2.data.error) || 'Error');
    }
  }));
  $$('.cat-btn').forEach((b) => b.addEventListener('click', () => {
    homeCat = b.dataset.cat;
    pageHome();
  }));
  $$('.ocat-btn').forEach((b) => b.addEventListener('click', () => {
    homeCatOverseas = b.dataset.ocat;
    pageHome();
  }));
  track('page');
}

async function pageLot(id) {
  app.innerHTML = `<p class="note">${t('loading')}</p>`;
  const data = await api('/api/lots/' + id);
  serverOffset = data.now - Date.now();
  const lot = data.lot;
  if (lot.status !== 'active') { // storefront only shows live lots
    app.innerHTML = `<p><a href="#/">${t('back')}</a></p><div class="empty">${t('ended')}</div>`;
    return;
  }
  const me = identity();
  const ended = lot.status === 'ended' || lot.ends_at <= nowMs();
  const minNext = lot.has_bids ? lot.current_cents + 50 : lot.start_cents;
  let idx = 0;
  app.innerHTML = `
    <p><a href="#/">${t('back')}</a></p>
    <div class="detail">
      <div class="gallery">
        <div class="main-photo">
          <img id="g-main" src="${esc(lot.images[0] || '')}" alt="${esc(lot.title)}">
          ${lot.images.length > 1 ? `<button class="nav-btn prev" id="g-prev" aria-label="Previous">‹</button><button class="nav-btn next" id="g-next" aria-label="Next">›</button>
          <span class="counter" id="g-count">1 / ${lot.images.length}</span>` : ''}
        </div>
        <div class="thumbs">${lot.images.map((src, i) => `<button data-i="${i}" class="${i === 0 ? 'on' : ''}"><img src="${esc(src)}" alt=""></button>`).join('')}</div>
      </div>
      <div>
        <div class="panel">
          <h1>${esc(lot.title)}</h1>
          <p class="sub">${esc(lot.subtitle)}</p>
          ${lot.zone === 'overseas' ? `<p class="overseas-note">${t('overseas_banner')}</p>` : ''}
          <div class="kv"><span>${lot.has_bids ? t('current_bid') : t('starting_bid')}</span><strong style="font-size:1.3rem">${fmt(lot.current_cents)}</strong></div>
          ${lot.retail_cents ? `<div class="kv"><span>${t('retail')}</span><span style="text-decoration:line-through;color:var(--muted)">${fmt(lot.retail_cents)}</span></div>` : ''}
          <div class="kv"><span>${t('bids')}</span><span>${lot.bid_count}</span></div>
          <div class="kv"><span>${t('qty')}</span><span>${esc(lot.qty_note || '—')}</span></div>
          <div class="kv"><span>${t('category')}</span><span>${esc(lot.category)}</span></div>
          <div class="kv"><span>${t('ends_in')}</span><span class="big-count" data-ends="${lot.ends_at}">${fmtLeft(lot.ends_at - nowMs())}</span></div>
          ${countbar(lot)}
          <hr class="hr">
          ${ended ? `<p class="ended-tag">${t('ended')}</p>` : `
          <form id="bid-form">
            <label>${t('name')}</label><input id="b-name" required value="${esc(me ? me.name : '')}" autocomplete="name">
            <label>${t('email')}</label><input id="b-email" type="email" required value="${esc(me ? me.email : '')}" autocomplete="email">
            <label>${t('bid_amount')} — ${t('min_next')}: ${fmt(minNext)}</label>
            <input id="b-amount" type="text" inputmode="decimal" data-min-cents="${minNext}" value="${(minNext / 100).toFixed(2)}" required>
            <p class="note">${t('bid_note')}</p>
            <p class="error" id="bid-err"></p>
            <button class="btn" type="submit">${t('place_bid')}</button>
          </form>`}
        </div>
        <div class="panel" style="margin-top:16px">
          <h3 style="margin-top:0">${t('desc')}</h3>
          <p class="note" style="color:var(--text)">${esc(lot.description)}</p>
          <p class="note">${t('ship_note')}<br>${t('tax_note')}</p>
        </div>
        <div class="panel" style="margin-top:16px">
          <h3 style="margin-top:0">${t('ask_q')}</h3>
          ${askFormHtml(lot.id)}
        </div>
      </div>
    </div>`;
  track('lot', lot.id);
  const setIdx = (i) => {
    idx = (i + lot.images.length) % lot.images.length;
    $('#g-main').src = lot.images[idx];
    const c = $('#g-count'); if (c) c.textContent = `${idx + 1} / ${lot.images.length}`;
    $$('.thumbs button').forEach((b, bi) => b.classList.toggle('on', bi === idx));
  };
  if (lot.images.length > 1) {
    $('#g-prev').addEventListener('click', () => setIdx(idx - 1));
    $('#g-next').addEventListener('click', () => setIdx(idx + 1));
    $$('.thumbs button').forEach((b) => b.addEventListener('click', () => setIdx(Number(b.dataset.i))));
  }
  bindAskForm(lot.id);
  const form = $('#bid-form');
  if (form) form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = $('#b-name').value.trim(), email = $('#b-email').value.trim();
    const chk = checkBidAmount($('#b-amount').value, minNext);
    if (chk.error) { $('#bid-err').textContent = bidAmountErrorText(chk.error, minNext); return; }
    const amount = chk.amount;
    try {
      const r = await api('/api/bid', { method: 'POST', body: JSON.stringify({ lotId: lot.id, name, email, amount }) });
      setIdentity(name, email.toLowerCase());
      refreshBidsWidget();
      toast(t('bid_ok'));
      pageLot(id);
    } catch (err) {
      $('#bid-err').textContent = err.data && err.data.error === 'bid_too_low'
        ? `${t('min_next')}: ${fmt(err.data.min_cents)}`
        : err.data && err.data.error === 'bid_step' ? t('err_bid_step') : ((err.data && err.data.error) || 'Error');
    }
  });
}

function askFormHtml(lotId) {
  const me = identity();
  return `<form class="ask-form" data-lot="${lotId || ''}">
    <label>${t('your_name')}</label><input class="a-name" required value="${esc(me ? me.name : '')}">
    <label>${t('your_email')}</label><input class="a-email" type="email" required value="${esc(me ? me.email : '')}">
    <label>${t('message')}</label><textarea class="a-body" rows="3" required></textarea>
    <p class="error a-err"></p><p class="success a-ok"></p>
    <button class="btn secondary" type="submit">${lotId ? t('ask') : t('send')}</button>
  </form>`;
}
function bindAskForm(lotId, root) {
  $$('.ask-form', root || document).forEach((f) => {
    if (f._bound) return; f._bound = true;
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const payload = {
        lotId: lotId || (f.dataset.lot ? Number(f.dataset.lot) : null),
        name: f.querySelector('.a-name').value.trim(),
        email: f.querySelector('.a-email').value.trim(),
        body: f.querySelector('.a-body').value.trim(),
      };
      try {
        const r = await api('/api/messages', { method: 'POST', body: JSON.stringify(payload) });
        f.querySelector('.a-ok').textContent = `${t('msg_sent')} ${r.receipt_code}`;
        f.querySelector('.a-body').value = '';
      } catch (err) { f.querySelector('.a-err').textContent = err.data.error || 'Error'; }
    });
  });
}

async function pageMyBids() {
  const me = identity();
  app.innerHTML = `<h1>${t('mybids_h')}</h1><p class="note">${t('mybids_p')}</p>
    <form id="mb-form" style="max-width:420px"><label>${t('email')}</label>
    <input id="mb-email" type="email" required value="${esc(me ? me.email : '')}">
    <p class="error" id="mb-err"></p><button class="btn" type="submit">${t('load')}</button></form>
    <div id="mb-out" style="margin-top:20px"></div>`;
  track('page');
  $('#mb-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = $('#mb-email').value.trim().toLowerCase();
    try {
      const data = await api('/api/my/bids?email=' + encodeURIComponent(email));
      // Live auctions first (ending soonest on top), then past bids.
      data.bids.sort((x, y) => {
        const lx = bidLive(x) ? 1 : 0, ly = bidLive(y) ? 1 : 0;
        if (lx !== ly) return ly - lx;
        if (lx && ly) return Number(x.ends_at) - Number(y.ends_at);
        return 0;
      });
      const out = $('#mb-out');
      if (!data.bids.length && !data.wins.length) { out.innerHTML = `<div class="empty">${t('no_bids')}</div>`; return; }
      const myTop = (b) => b.amount_cents >= b.top_cents;
      out.innerHTML = `
        ${data.wins.length ? `<h2>${t('your_wins')}</h2>` + data.wins.map((w) => `
          <div class="msg" style="display:flex;gap:14px;align-items:center">
            ${w.images[0] ? `<img class="thumb-sm" src="${esc(w.images[0])}" alt="">` : ''}
            <div style="flex:1"><strong>${esc(w.title)}</strong><br><span class="success">${t('won')} ${fmt(w.amount_cents)}</span></div>
            ${w.order_id ? `<span class="chip">${t('ordered')} #${w.order_id}</span>` : `<a class="btn small" style="width:auto" href="#/checkout/${w.win_id}">${t('checkout')}</a>`}
          </div>`).join('') : ''}
        <h2>${t('your_bids')}</h2>
        <table><tr><th>Lot</th><th>${t('bid_amount')}</th><th>${t('current_bid')}</th><th></th></tr>
        ${data.bids.map((b) => `<tr><td><span class="mb-lot">${b.cover ? `<img class="thumb" src="${esc(b.cover)}" alt="">` : ''}<a href="#/lot/${b.lot_id}">${esc(b.title)}</a></span></td><td>${fmt(b.amount_cents)}</td><td>${fmt(b.top_cents)}</td>
          <td>${b.status === 'cancelled' ? `<span style="color:#ff8b6b">${t('cancelled_tag')}</span>` : b.status === 'ended' ? '' : (myTop(b) ? `<span class="success">${t('winning')}</span>` : `<span style="color:#ff8b6b">${t('outbid')}</span>`)}</td></tr>`).join('')}
        </table>`;
    } catch (err) { $('#mb-err').textContent = err.data.error || 'Error'; }
  });
  if (me) $('#mb-form').dispatchEvent(new Event('submit'));
}

async function pageCheckout(winId) {
  const me = identity();
  app.innerHTML = `<h1>${t('checkout_h')}</h1><p class="note">${t('loading')}</p>`;
  track('page');
  if (!me) { app.innerHTML = `<h1>${t('checkout_h')}</h1><div class="empty">${t('mybids_p')} <a href="#/my-bids">${t('nav_my')}</a></div>`; return; }
  const data = await api('/api/my/bids?email=' + encodeURIComponent(me.email));
  const win = data.wins.find((w) => w.win_id === winId);
  if (!win) { app.innerHTML = `<div class="empty">${t('no_bids')}</div>`; return; }
  const item = win.amount_cents;
  app.innerHTML = `<h1>${t('checkout_h')}</h1>
    <div class="panel" style="max-width:560px">
      <div style="display:flex;gap:14px;align-items:center;margin-bottom:8px">
        ${win.images[0] ? `<img class="thumb-sm" src="${esc(win.images[0])}" alt="">` : ''}<strong>${esc(win.title)}</strong>
      </div>
      <form id="co-form">
        <label>${t('delivery')}</label>
        <select id="co-method"><option value="pickup">${t('pickup')}</option><option value="ship">${t('ship')}</option></select>
        <p class="note" id="co-pickup-note">${t('pickup_at')}: 1065 S Vail Ave, Montebello, CA 90640</p>
        <div id="co-ship-fields" hidden>
          <label>${t('state')}</label><input id="co-state" maxlength="2" placeholder="CA">
          <label>${t('address')}</label><textarea id="co-address" rows="2"></textarea>
        </div>
        <label>${t('phone')}</label><input id="co-phone" type="tel" placeholder="(626) 555-0123" required>
        <label>${t('promo_code')}</label>
        <div style="display:flex;gap:8px"><input id="co-promo" placeholder="KANSTAR5" style="flex:1"><button class="btn small" style="width:auto" type="button" id="co-promo-apply">${t('promo_apply')}</button></div>
        <p class="note" id="co-promo-msg"></p>
        <hr class="hr">
        <div class="kv"><span>${t('item')}</span><span>${fmt(item)}</span></div>
        <div class="kv"><span>${t('shipping')}</span><span id="q-ship">—</span></div>
        <div class="kv"><span>${t('tax')}</span><span id="q-tax">—</span></div>
        <div class="kv" id="q-discount-row" hidden><span id="q-discount-label">${t('promo_discount')}</span><span id="q-discount">—</span></div>
        <div class="kv total"><span>${t('total')}</span><span id="q-total">—</span></div>
        <p class="note">${t('ship_note')}<br>${t('tax_note')}</p>
        <p class="error" id="co-err"></p><p class="success" id="co-ok"></p>
        <button class="btn" type="submit">${t('place_order')}</button>
      </form>
    </div>`;
  const quote = async () => {
    const method = $('#co-method').value;
    $('#co-ship-fields').hidden = method !== 'ship';
    $('#co-pickup-note').hidden = method === 'ship';
    const code = $('#co-promo').value.trim();
    const q = await api('/api/checkout/quote', { method: 'POST', body: JSON.stringify({ item_cents: item, method, state: $('#co-state').value, email: me.email, code }) });
    $('#q-ship').textContent = q.shipping_cents === 0 ? 'FREE' : fmt(q.shipping_cents);
    $('#q-tax').textContent = fmt(q.tax_cents);
    $('#q-total').textContent = fmt(q.total_cents);
    const dRow = $('#q-discount-row');
    if (q.discount_cents > 0) {
      dRow.hidden = false;
      $('#q-discount-label').textContent = `${t('promo_discount')} (${code.toUpperCase()})`;
      $('#q-discount').textContent = '-' + fmt(q.discount_cents);
    } else dRow.hidden = true;
    const msg = $('#co-promo-msg');
    if (!code) { msg.textContent = ''; }
    else if (q.promo_state === 'applied') { msg.textContent = t('promo_applied'); msg.style.color = '#2e7d32'; }
    else if (q.promo_state === 'invalid') { msg.textContent = t('promo_invalid'); msg.style.color = '#c62828'; }
    else if (q.promo_state === 'used') { msg.textContent = t('promo_used'); msg.style.color = '#c62828'; }
    else if (q.promo_state === 'below_min') { msg.textContent = t('promo_below_min'); msg.style.color = '#c62828'; }
    else msg.textContent = '';
  };
  $('#co-method').addEventListener('change', quote);
  $('#co-state').addEventListener('input', quote);
  $('#co-promo-apply').addEventListener('click', quote);
  quote();
  $('#co-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const r = await api('/api/checkout', {
        method: 'POST',
        body: JSON.stringify({ winId, email: me.email, phone: $('#co-phone').value, method: $('#co-method').value, state: $('#co-state').value, address: $('#co-address').value, code: $('#co-promo').value.trim() }),
      });
      if (r.checkout_url) { // Stripe Checkout: hand the browser over to Stripe
        $('#co-ok').textContent = t('pay_redirecting');
        e.target.querySelector('button[type=submit]').disabled = true;
        location.href = r.checkout_url;
        return;
      }
      $('#co-ok').textContent = `${t('order_ok')} (#${r.order_id} · ${fmt(r.total_cents)})`;
      e.target.querySelector('button[type=submit]').disabled = true;
    } catch (err) {
      $('#co-err').textContent = (err.data && err.data.error === 'payment_unavailable') ? t('pay_unavailable') : ((err.data && err.data.error) || 'Error');
    }
  });
}

function pageRules() {
  const en = lang === 'en';
  app.innerHTML = `<h1>${t('rules_h')}</h1><div class="panel" style="max-width:820px;line-height:1.65">
    ${en ? `
    <h3>One Seller: Kanstar</h3><p>This is Kanstar's own warehouse auction. Only Kanstar sells here — visitors cannot list items. Every lot is warehouse stock sold as pictured.</p>
    <h3>How bidding works</h3><p>Each main-zone lot runs on its own 24-hour countdown from the time it is listed. Flash-zone lots run 5-minute rounds; a bid in the last 30 seconds extends that round by 30 seconds, and a new round starts automatically when one closes. To bid, leave your name and email so we can notify you if you are outbid, if a lot is ending soon, and if you win. Your contact details are never shown publicly.</p>
    <h3>Pickup & shipping</h3><p>Winners may pick up FREE at our warehouse: 1065 S Vail Ave, Montebello, CA 90640 — at any winning price. Or choose shipping at checkout: shipping is FREE when the winning bid is $30 or more; below $30 a $5 shipping fee applies. Local delivery is next day; nationwide delivery takes 3–7 days. A phone number is collected at checkout so we can reach you about pickup or delivery.</p>
    <h3>Sales tax</h3><p>California orders are subject to sales tax. If your order is picked up at the warehouse or shipped to a California address, 9.5% sales tax is added to the item price (shipping is not taxed). Orders shipped outside California are not taxed.</p>
    <h3>Questions</h3><p>Use “Ask about this lot” on any lot page or the Contact link in the footer. You will get a receipt code — keep it to read our reply under My Messages.</p>`
    : `
    <h3>Un solo vendedor: Kanstar</h3><p>Esta es la subasta del almacén de Kanstar. Solo Kanstar vende aquí: los visitantes no pueden publicar lotes. Cada lote es inventario del almacén y se vende tal como se muestra en las fotos.</p>
    <h3>Cómo funciona la subasta</h3><p>Cada lote de la zona principal corre con su propia cuenta regresiva de 24 horas desde que se publica. Los lotes de la zona flash corren rondas de 5 minutos; una oferta en los últimos 30 segundos extiende la ronda 30 segundos, y al cerrar una ronda empieza otra automáticamente. Para ofertar, deja tu nombre y correo para poder avisarte si te superan, si un lote está por terminar y si ganas. Tus datos nunca se muestran en público.</p>
    <h3>Recogida y envío</h3><p>Los ganadores pueden recoger GRATIS en nuestro almacén: 1065 S Vail Ave, Montebello, CA 90640, con cualquier precio ganador. O elige envío al pagar: el envío es GRATIS cuando la oferta ganadora es de $30 o más; por debajo de $30 se aplica un cargo de $5. Entrega local al día siguiente; resto del país en 3–7 días. Al pagar se pide un teléfono para contactarte sobre la recogida o el envío.</p>
    <h3>Impuesto sobre las ventas</h3><p>Los pedidos de California están sujetos a impuesto sobre las ventas. Si recoges en el almacén o el envío va a una dirección de California, se agrega 9.5% de impuesto al precio del artículo (el envío no paga impuesto). Los envíos fuera de California no pagan impuesto.</p>
    <h3>Preguntas</h3><p>Usa «Preguntar por este lote» en cualquier lote o el enlace de contacto en el pie de página. Recibirás un código de recibo: guárdalo para leer nuestra respuesta en Mis mensajes.</p>`}
  </div>`;
  track('page');
}

function pageContact() {
  app.innerHTML = `<h1>${t('contact_h')}</h1><p class="note">${t('contact_p')}</p><div style="max-width:520px">${askFormHtml(null)}</div>`;
  bindAskForm(null);
  track('page');
}

function pageMyMessages() {
  app.innerHTML = `<h1>${t('mymsg_h')}</h1><p class="note">${t('mymsg_p')}</p>
    <form id="mm-form" style="max-width:420px"><label>${t('code')}</label>
    <input id="mm-code" required placeholder="A1B2C3D4E5F6" style="text-transform:uppercase">
    <p class="error" id="mm-err"></p><button class="btn" type="submit">${t('check')}</button></form>
    <div id="mm-out" style="margin-top:18px;max-width:640px"></div>`;
  track('page');
  $('#mm-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      const r = await api('/api/messages/by-code/' + encodeURIComponent($('#mm-code').value.trim().toUpperCase()));
      const m = r.message;
      $('#mm-out').innerHTML = `<div class="msg">
        ${m.lot_title ? `<div><strong>${esc(m.lot_title)}</strong></div>` : ''}
        <p>${esc(m.body)}</p>
        ${m.seller_reply ? `<div class="reply"><strong>${t('seller_reply')}:</strong><br>${esc(m.seller_reply)}</div>` : `<p class="note">${t('no_reply')}</p>`}
      </div>`;
    } catch (err) { $('#mm-err').textContent = err.data.error || 'Error'; }
  });
}

/* --------------------------- seller backend -------------------------- */
const sellerPass = () => localStorage.getItem('kda_seller') || '';
const sellerHeaders = () => ({ 'x-seller-passcode': sellerPass() });

async function pageSeller() {
  if (!sellerPass()) {
    app.innerHTML = `<h1>${t('seller_h')}</h1>
      <form id="gate" style="max-width:360px"><label>${t('passcode')}</label>
      <input id="gate-pw" type="password" autocomplete="current-password">
      <p class="error" id="gate-err"></p><button class="btn" type="submit">${t('unlock')}</button></form>`;
    $('#gate').addEventListener('submit', async (e) => {
      e.preventDefault();
      try {
        await api('/api/seller/auth', { method: 'POST', body: JSON.stringify({ passcode: $('#gate-pw').value }) });
        localStorage.setItem('kda_seller', $('#gate-pw').value); // remembered on this device only
        pageSeller();
      } catch { $('#gate-err').textContent = t('wrong_pass'); }
    });
    return;
  }
  let unread = 0;
  try { unread = (await api('/api/seller/unread', { headers: sellerHeaders() })).unread; } catch { localStorage.removeItem('kda_seller'); return pageSeller(); }
  app.innerHTML = `<h1>${t('seller_h')}</h1>
    <div class="tabs">
      <button data-tab="list" class="on">${t('tab_list')}</button>
      <button data-tab="manage">${t('tab_manage')}</button>
      <button data-tab="inbox">${t('tab_inbox')}${unread ? `<span class="badge">${unread}</span>` : ''}</button>
      <button data-tab="orders">${t('tab_orders')}</button>
      <button data-tab="traffic">${t('tab_traffic')}</button>
      <button data-tab="bidstats">${t('tab_bids')}</button>
      <button id="lock-btn" style="margin-left:auto">${t('lock')}</button>
    </div><div id="seller-body"></div>`;
  $('#lock-btn').addEventListener('click', () => { localStorage.removeItem('kda_seller'); location.hash = '#/'; });
  $$('.tabs button[data-tab]').forEach((b) => b.addEventListener('click', () => {
    $$('.tabs button[data-tab]').forEach((x) => x.classList.toggle('on', x === b));
    sellerTab(b.dataset.tab);
  }));
  sellerTab('list');
}

function payChip(o) {
  const map = {
    paid: ['pay_paid', 'var(--ok)'],
    pending_payment: ['pay_pending', 'var(--gold)'],
    payment_expired: ['pay_expired', '#ff8b6b'],
    recorded: ['pay_recorded', 'var(--muted)'],
  };
  const [k, c] = map[o.payment_status] || map.recorded;
  return `<span class="chip" style="color:${c};border-color:${c};font-weight:700">${t(k)}</span>`;
}

async function sellerTab(tab) {
  const body = $('#seller-body');
  if (tab === 'list') {
    body.innerHTML = `<form id="list-form" style="max-width:560px">
      <label>${t('f_title')}</label><input id="l-title" required>
      <label>${t('f_sub')}</label><input id="l-sub">
      <div class="two-col"><div><label>${t('f_cat')}</label><input id="l-cat"></div>
      <div><label>${t('f_qty')}</label><input id="l-qty"></div></div>
      <div class="two-col"><div><label>${t('f_start')}</label><input id="l-start" type="number" step="0.01" min="1" required></div>
      <div><label>${t('f_retail')}</label><input id="l-retail" type="number" step="0.01" min="0"></div></div>
      <label>${t('f_zone')}</label><select id="l-zone"><option value="main">${t('f_main')}</option><option value="flash">${t('f_flash')}</option><option value="overseas">${t('f_overseas')}</option></select>
      <label>${t('f_desc')}</label><textarea id="l-desc" rows="3"></textarea>
      <label>${t('f_photos')}</label><input id="l-photos" type="file" accept="image/*" multiple>
      <p class="error" id="l-err"></p><p class="success" id="l-ok"></p>
      <button class="btn" type="submit">${t('list_it')}</button></form>`;
    $('#list-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const files = Array.from($('#l-photos').files).slice(0, 8);
      const images = await Promise.all(files.map((f) => new Promise((res) => {
        const rd = new FileReader(); rd.onload = () => res(rd.result); rd.onerror = () => res(null); rd.readAsDataURL(f);
      })));
      try {
        await api('/api/seller/lots', {
          method: 'POST', headers: sellerHeaders(),
          body: JSON.stringify({
            title: $('#l-title').value, subtitle: $('#l-sub').value, category: $('#l-cat').value,
            qty_note: $('#l-qty').value, start: Number($('#l-start').value),
            retail: $('#l-retail').value ? Number($('#l-retail').value) : null,
            zone: $('#l-zone').value, description: $('#l-desc').value, images: images.filter(Boolean),
          }),
        });
        $('#l-ok').textContent = t('listed_ok'); e.target.reset();
      } catch (err) { $('#l-err').textContent = err.data.error || 'Error'; }
    });
  }
  if (tab === 'inbox') {
    const data = await api('/api/seller/inbox', { headers: sellerHeaders() });
    body.innerHTML = (data.messages.length ? '' : `<div class="empty">${t('inbox_empty')}</div>`) +
      `<p><button class="btn small secondary" id="mark-read">${t('mark_read')}</button></p>` +
      data.messages.map((m) => `<div class="msg">
        <div><strong>${esc(m.name)}</strong> <span style="color:var(--muted)">${esc(m.email)} · ${new Date(m.created_at).toLocaleString()} ${m.is_read ? '' : '· 🔴'}</span></div>
        ${m.lot_title ? `<div class="note">${esc(m.lot_title)}</div>` : ''}
        <p>${esc(m.body)}</p>
        <div class="note">${t('your_code')}: ${esc(m.receipt_code)}</div>
        ${m.seller_reply ? `<div class="reply"><strong>${t('seller_reply')}:</strong><br>${esc(m.seller_reply)}</div>` : `
        <form class="reply-form" data-id="${m.id}"><label>${t('reply')}</label>
        <textarea rows="2" required></textarea><p style="margin-top:8px"><button class="btn small" type="submit">${t('reply_send')}</button></p></form>`}
      </div>`).join('');
    $('#mark-read').addEventListener('click', async () => { await api('/api/seller/inbox/read', { method: 'POST', headers: sellerHeaders(), body: '{}' }); pageSeller(); });
    $$('.reply-form', body).forEach((f) => f.addEventListener('submit', async (e) => {
      e.preventDefault();
      await api('/api/seller/inbox/reply', { method: 'POST', headers: sellerHeaders(), body: JSON.stringify({ id: Number(f.dataset.id), reply: f.querySelector('textarea').value }) });
      sellerTab('inbox');
    }));
  }
  if (tab === 'orders') {
    const data = await api('/api/seller/orders', { headers: sellerHeaders() });
    body.innerHTML = data.orders.length ? `<table><tr><th>#</th><th>Lot</th><th>Buyer</th><th>${t('delivery')}</th><th>${t('item')}</th><th>${t('shipping')}</th><th>${t('tax')}</th><th>${t('total')}</th><th>${t('pay')}</th></tr>
      ${data.orders.map((o) => `<tr><td>${o.id}</td><td>${esc(o.title)}</td><td>${esc(o.buyer_name)}<br><span class="note">${esc(o.buyer_email)}<br>${esc(o.phone)}</span></td>
      <td>${o.method === 'pickup' ? t('pickup') : `${t('ship')} → ${esc(o.dest_state)}<br><span class="note">${esc(o.address)}</span>`}</td>
      <td>${fmt(o.item_cents)}</td><td>${fmt(o.shipping_cents)}</td><td>${fmt(o.tax_cents)}</td><td><strong>${fmt(o.total_cents)}</strong></td><td>${payChip(o)}</td></tr>`).join('')}</table>`
      : `<div class="empty">${t('orders_empty')}</div>`;
  }
  if (tab === 'manage') {
    const data = await api('/api/seller/lots', { headers: sellerHeaders() });
    const lots = data.lots || [];
    const MG_PAGE = 30;
    // Status groups for the filter bar: an ended lot with bids in its final
    // round was won (a win row exists), so it counts as 'sold'; an ended lot
    // without bids is plain 'ended'. Removed lots only appear under 'all'.
    const mgGroup = (l) => l.status === 'active' ? 'active'
      : l.status === 'cancelled' ? 'cancelled'
      : l.status === 'removed' ? 'removed'
      : (l.status === 'ended' && l.has_bids) ? 'sold' : 'ended';
    const zoneCounts = { all: lots.length, main: 0, overseas: 0, flash: 0 };
    const statusCounts = { all: lots.length, active: 0, ended: 0, cancelled: 0, sold: 0 };
    for (const l of lots) {
      if (zoneCounts[l.zone] !== undefined) zoneCounts[l.zone]++;
      const g = mgGroup(l);
      if (statusCounts[g] !== undefined) statusCounts[g]++;
    }
    const mgFiltered = () => {
      const q = mgQuery.trim().toLowerCase();
      return lots.filter((l) => {
        if (mgZone !== 'all' && l.zone !== mgZone) return false;
        if (mgStatus !== 'all' && mgGroup(l) !== mgStatus) return false;
        if (q && !l.title.toLowerCase().includes(q) && String(l.id) !== q.replace(/^#/, '')) return false;
        return true;
      });
    };
    const mgRow = (l) => {
      const cover = l.images && l.images[0];
      const chip = l.status === 'removed'
        ? `<span class="chip" style="color:#ff8b6b;border-color:#ff8b6b;font-weight:700">${t('removed_tag')}</span>`
        : l.status === 'cancelled'
          ? `<span class="chip" style="color:#ff8b6b;border-color:#ff8b6b;font-weight:700">${t('cancelled_tag')}</span>`
          : l.status === 'ended'
          ? `<span class="chip" style="font-weight:700">${t('ended_tag')}</span>`
          : `<span class="chip" style="color:var(--ok);border-color:var(--ok);font-weight:700">${t('active_tag')}</span>`;
      return `<div class="panel" style="margin-bottom:12px">
        <div class="rank-row">
          ${cover ? `<img class="thumb" src="${esc(cover)}" alt="">` : '<span class="thumb"></span>'}
          <div class="grow">
            <div><strong>#${l.id}</strong> ${esc(l.title)}</div>
            <div class="note">${t('m_start')} ${fmt(l.start_cents)} · ${t('m_current')} ${fmt(l.current_cents)} · ${l.bid_count} ${t('m_bids')} · ${t('m_round')} ${l.round}${l.status === 'active' ? ` · ⏰ ${new Date(l.ends_at).toLocaleString()}` : ''}</div>
          </div>
          ${chip}
          ${l.status === 'active' ? `<button class="btn small secondary edit-lot" style="flex:none" data-id="${l.id}">${t('edit_lot')}</button>
          <button class="btn small secondary cancel-lot" style="flex:none;color:#ff8b6b;border-color:#ff8b6b" data-id="${l.id}">${t('cancel_lot')}</button>`
            : `<button class="btn small relist-lot" style="flex:none" data-id="${l.id}">↻ ${t('relist_lot')}</button>`}
        </div>
        <form class="edit-form" data-id="${l.id}" style="display:none;max-width:560px;margin-top:12px">
          <label>${t('f_title')}</label><input class="e-title" value="${esc(l.title)}" required>
          <label>${t('f_sub')}</label><input class="e-sub" value="${esc(l.subtitle || '')}">
          <div class="two-col"><div><label>${t('f_cat')}</label><input class="e-cat" value="${esc(l.category || '')}"></div>
          <div><label>${t('f_qty')}</label><input class="e-qty" value="${esc(l.qty_note || '')}"></div></div>
          <div class="two-col"><div><label>${t('f_start')}</label><input class="e-start" type="number" step="0.01" min="1" value="${(l.start_cents / 100).toFixed(2)}"></div>
          <div><label>${t('f_retail')}</label><input class="e-retail" type="number" step="0.01" min="0" value="${l.retail_cents ? (l.retail_cents / 100).toFixed(2) : ''}"></div></div>
          <label>${t('f_desc')}</label><textarea class="e-desc" rows="3">${esc(l.description || '')}</textarea>
          <p class="error e-err"></p>
          <p style="margin-top:8px"><button class="btn small" type="submit">${t('save_changes')}</button>
          <button class="btn small secondary e-cancel" type="button">${t('cancel')}</button></p>
        </form>
      </div>`;
    };
    const mgBindPanel = (panel) => {
      const eb = panel.querySelector('.edit-lot');
      if (eb) eb.addEventListener('click', () => {
        const form = panel.querySelector('.edit-form');
        form.style.display = form.style.display === 'none' ? '' : 'none';
      });
      const cb = panel.querySelector('.e-cancel');
      if (cb) cb.addEventListener('click', () => {
        panel.querySelector('.edit-form').style.display = 'none';
      });
      const f = panel.querySelector('.edit-form');
      if (f) f.addEventListener('submit', async (e) => {
        e.preventDefault();
        const err = f.querySelector('.e-err');
        err.textContent = '';
        const retailVal = f.querySelector('.e-retail').value;
        try {
          await api('/api/seller/lots/' + f.dataset.id, {
            method: 'PATCH', headers: sellerHeaders(),
            body: JSON.stringify({
              title: f.querySelector('.e-title').value, subtitle: f.querySelector('.e-sub').value,
              category: f.querySelector('.e-cat').value, qty_note: f.querySelector('.e-qty').value,
              start: Number(f.querySelector('.e-start').value),
              retail: retailVal === '' ? null : Number(retailVal),
              description: f.querySelector('.e-desc').value,
            }),
          });
          toast(t('saved_ok'));
          sellerTab('manage');
        } catch (e2) {
          const code = (e2.data && e2.data.error) || '';
          err.textContent = t('err_' + code) !== 'err_' + code ? t('err_' + code) : (code || 'Error');
        }
      });
      const xb = panel.querySelector('.cancel-lot');
      if (xb) xb.addEventListener('click', async () => {
        if (!confirm(t('cancel_confirm'))) return;
        xb.disabled = true;
        try {
          await api('/api/seller/lots/' + xb.dataset.id + '/cancel', { method: 'POST', headers: sellerHeaders() });
          toast(t('cancelled_ok'));
          sellerTab('manage');
        } catch (err) { xb.disabled = false; toast((err.data && err.data.error) || 'Error'); }
      });
      const rb = panel.querySelector('.relist-lot');
      if (rb) rb.addEventListener('click', async () => {
        if (!confirm(t('relist_confirm'))) return;
        rb.disabled = true;
        try {
          await api('/api/seller/lots/' + rb.dataset.id + '/relist', { method: 'POST', headers: sellerHeaders() });
          toast(t('relisted_ok'));
          sellerTab('manage');
        } catch (err) { rb.disabled = false; toast((err.data && err.data.error) || 'Error'); }
      });
    };
    body.innerHTML = `
      <div class="mg-filters">
        <div class="mg-row">${[['all', 'mg_all'], ['main', 'mg_local'], ['overseas', 'mg_overseas'], ['flash', 'mg_flash']].map(([z, k]) => `<button type="button" class="mg-btn ${mgZone === z ? 'on' : ''}" data-z="${z}">${t(k)}<span class="ztab-count">${zoneCounts[z]}</span></button>`).join('')}</div>
        <div class="mg-row">${[['all', 'mg_all'], ['active', 'mg_active'], ['ended', 'mg_ended'], ['cancelled', 'mg_cancelled'], ['sold', 'mg_sold']].map(([s, k]) => `<button type="button" class="mg-btn ${mgStatus === s ? 'on' : ''}" data-s="${s}">${t(k)}<span class="ztab-count">${statusCounts[s]}</span></button>`).join('')}</div>
        <div class="mg-searchwrap"><input id="mg-search" type="search" placeholder="${t('mg_search_ph')}" value="${esc(mgQuery)}"></div>
        <p class="note" id="mg-count" style="margin:8px 0 0"></p>
      </div>
      <div id="mg-list"></div>
      <div class="empty" id="mg-none" style="display:none">${t('mg_none')}</div>
      <p style="text-align:center;margin:14px 0 4px"><button class="btn secondary" id="mg-more" style="width:auto;display:none">${t('mg_more')}</button></p>`;
    const listEl = $('#mg-list', body);
    const moreBtn = $('#mg-more', body);
    const noneEl = $('#mg-none', body);
    const countEl = $('#mg-count', body);
    const mgRender = (reset) => {
      if (reset) listEl.innerHTML = '';
      const items = mgFiltered();
      const rendered = listEl.children.length;
      const next = items.slice(rendered, rendered + MG_PAGE);
      if (next.length) {
        listEl.insertAdjacentHTML('beforeend', next.map(mgRow).join(''));
        [...listEl.children].slice(rendered).forEach(mgBindPanel);
      }
      countEl.textContent = `${t('mg_showing')} ${listEl.children.length} / ${items.length}`;
      noneEl.style.display = items.length ? 'none' : '';
      moreBtn.style.display = listEl.children.length < items.length ? '' : 'none';
    };
    moreBtn.addEventListener('click', () => mgRender(false));
    $$('.mg-btn[data-z]', body).forEach((b) => b.addEventListener('click', () => {
      mgZone = b.dataset.z;
      $$('.mg-btn[data-z]', body).forEach((x) => x.classList.toggle('on', x === b));
      mgRender(true);
    }));
    $$('.mg-btn[data-s]', body).forEach((b) => b.addEventListener('click', () => {
      mgStatus = b.dataset.s;
      $$('.mg-btn[data-s]', body).forEach((x) => x.classList.toggle('on', x === b));
      mgRender(true);
    }));
    $('#mg-search', body).addEventListener('input', (e) => { mgQuery = e.target.value; mgRender(true); });
    mgRender(true);
  }
  if (tab === 'traffic') {
    const d = await api('/api/seller/traffic?range=' + trafficRange, { headers: sellerHeaders() });
    const s = d.stats;
    const maxH = Math.max(1, ...d.hourly.map((h) => h.views));
    const maxLot = Math.max(1, ...d.by_lot.map((l) => l.views));
    const maxState = Math.max(1, ...d.by_state.map((x) => x.visitors));
    body.innerHTML = `
      <div class="range-row">${[['today', 'r_today'], ['yesterday', 'r_yday'], ['3d', 'r_3d'], ['7d', 'r_7d'], ['30d', 'r_30d']].map(([k, lk]) => `<button class="btn small ${trafficRange === k ? '' : 'secondary'} range-btn" data-range="${k}">${t(lk)}</button>`).join('')}</div>
      <div class="stat-grid">
        <div class="stat"><div class="num">${s.visitors}</div><div class="lbl">${t('t_visitors')}</div></div>
        <div class="stat"><div class="num">${s.page_views}</div><div class="lbl">${t('t_pages')}</div></div>
        <div class="stat"><div class="num">${s.lot_views}</div><div class="lbl">${t('t_lots')}</div></div>
        <div class="stat"><div class="num">${s.bids}</div><div class="lbl">${t('t_bids')}</div></div>
      </div>
      <p class="note">${t('t_unique_note')}</p>
      <div class="panel"><h3 style="margin-top:0">${t('t_hours')}</h3>
        <div class="bars">${d.hourly.map((h) => `<div class="bar" style="height:${Math.max(2, (h.views / maxH) * 100)}%" data-tip="${h.hour}:00 · ${h.views} ${t('views')} · ${h.visitors} ${t('visitors')}"></div>`).join('')}</div>
        <div class="bar-hours">${d.hourly.map((h) => `<span>${h.hour % 3 === 0 ? h.hour : ''}</span>`).join('')}</div>
      </div>
      <div class="panel" style="margin-top:16px"><h3 style="margin-top:0">${t('t_by_lot')}</h3>
        ${d.by_lot.map((l, i) => `<div class="rank-row">
          ${l.cover ? `<img class="thumb" src="${esc(l.cover)}" alt="">` : '<span class="thumb"></span>'}
          <div class="grow"><div style="display:flex;justify-content:space-between;gap:10px"><span><strong>${i + 1}.</strong> ${esc(l.title)}</span>
          <span class="note">${l.views} ${t('views')} · <span style="color:var(--accent)">${l.bids} ${t('bids')}</span></span></div>
          <div class="track"><div class="fillb" style="width:${(l.views / maxLot) * 100}%"></div></div></div>
          ${l.status === 'removed'
            ? `<span class="chip" style="color:#ff8b6b;border-color:#ff8b6b;font-weight:700;flex:none">${t('removed_tag')}</span>`
            : `<button class="btn small secondary remove-lot" style="flex:none" data-id="${l.id}">${t('remove_lot')}</button>`}
          </div>`).join('') || `<p class="note">—</p>`}
      </div>
      <div class="panel" style="margin-top:16px"><h3 style="margin-top:0">${t('t_by_state')}</h3>
        ${d.by_state.map((x) => `<div class="hbar-row"><span class="name">${esc(x.state)}</span>
          <div class="track"><div class="fillb" style="width:${(x.visitors / maxState) * 100}%"></div></div>
          <span class="note">${x.visitors} ${t('visitors')}</span></div>`).join('') || `<p class="note">—</p>`}
      </div>`;
    $$('.range-btn', body).forEach((b) => b.addEventListener('click', () => {
      trafficRange = b.dataset.range;
      sellerTab('traffic');
    }));
    $$('.remove-lot', body).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(t('remove_confirm'))) return;
      b.disabled = true;
      try {
        await api('/api/seller/lots/' + b.dataset.id, { method: 'DELETE', headers: sellerHeaders() });
        toast(t('removed_ok'));
        sellerTab('traffic');
      } catch (err) { b.disabled = false; toast((err.data && err.data.error) || 'Error'); }
    }));
  }
  if (tab === 'bidstats') {
    const d = await api('/api/seller/bidstats?range=' + bidRange, { headers: sellerHeaders() });
    const s = d.stats;
    const maxH = Math.max(1, ...d.hourly.map((h) => h.bids));
    const maxLot = Math.max(1, ...d.by_lot.map((l) => l.bids));
    body.innerHTML = `
      <div class="range-row">${[['today', 'r_today'], ['yesterday', 'r_yday'], ['3d', 'r_3d'], ['7d', 'r_7d'], ['30d', 'r_30d']].map(([k, lk]) => `<button class="btn small ${bidRange === k ? '' : 'secondary'} range-btn" data-range="${k}">${t(lk)}</button>`).join('')}</div>
      <div class="stat-grid">
        <div class="stat"><div class="num">${s.total_bids}</div><div class="lbl">${t('b_total')}</div></div>
        <div class="stat"><div class="num">${s.unique_bidders}</div><div class="lbl">${t('b_bidders')}</div></div>
        <div class="stat"><div class="num">${s.lots_with_bids}</div><div class="lbl">${t('b_lots_bids')}</div></div>
        <div class="stat"><div class="num">${fmt(s.highest_bid_cents)}</div><div class="lbl">${t('b_highest')}</div></div>
      </div>
      <div class="stat-grid">
        <div class="stat"><div class="num">${fmt(s.live_bid_total_cents)}</div><div class="lbl">${t('b_live_total')}</div></div>
        <div class="stat"><div class="num">${s.live_lots_with_bids}</div><div class="lbl">${t('b_live_lots')}</div></div>
        <div class="stat"><div class="num">${s.wins_in_range}</div><div class="lbl">${t('b_wins')}</div></div>
        <div class="stat"><div class="num">${fmt(s.won_value_cents)}</div><div class="lbl">${t('b_won_value')}</div></div>
      </div>
      ${s.total_bids === 0 ? `<p class="note">${t('b_none')}</p>` : `
      <div class="panel"><h3 style="margin-top:0">${t('b_hours')}</h3>
        <div class="bars">${d.hourly.map((h) => `<div class="bar" style="height:${Math.max(2, (h.bids / maxH) * 100)}%" data-tip="${h.hour}:00 · ${h.bids} ${t('t_bids')}"></div>`).join('')}</div>
        <div class="bar-hours">${d.hourly.map((h) => `<span>${h.hour % 3 === 0 ? h.hour : ''}</span>`).join('')}</div>
      </div>
      <div class="panel" style="margin-top:16px"><h3 style="margin-top:0">${t('b_by_lot')}</h3>
        ${d.by_lot.map((l, i) => `<div class="rank-row">
          ${l.cover ? `<img class="thumb" src="${esc(l.cover)}" alt="">` : '<span class="thumb"></span>'}
          <div class="grow"><div style="display:flex;justify-content:space-between;gap:10px"><span><strong>${i + 1}.</strong> ${esc(l.title)}</span>
          <span class="note"><span style="color:var(--accent)">${l.bids} ${t('t_bids')}</span> · ${l.unique_bidders} ${t('b_bidders')} · ${t('b_high')} ${fmt(l.high_cents)}</span></div>
          <div class="track"><div class="fillb" style="width:${(l.bids / maxLot) * 100}%"></div></div>
          <div class="note">${t('b_last')}: ${new Date(l.last_bid_at).toLocaleString()}</div></div>
          ${l.status === 'active' ? `<button class="btn small secondary bs-cancel" style="flex:none;color:#ff8b6b;border-color:#ff8b6b" data-id="${l.id}">${t('cancel_lot')}</button>` : `${l.status === 'cancelled' ? `<span class="chip" style="flex:none;color:#ff8b6b;border-color:#ff8b6b;font-weight:700">${t('cancelled_tag')}</span>` : ''}<button class="btn small bs-relist" style="flex:none" data-id="${l.id}">↻ ${t('relist_lot')}</button>`}
          </div>`).join('') || `<p class="note">—</p>`}
      </div>
      <div class="panel" style="margin-top:16px"><h3 style="margin-top:0">${t('b_recent')}</h3>
        ${d.recent.map((r) => `<div class="rank-row">
          <div class="grow"><div style="display:flex;justify-content:space-between;gap:10px"><span>${esc(r.lot_title)}</span>
          <span style="color:var(--accent);font-weight:700">${fmt(r.amount_cents)}</span></div>
          <div class="note">${esc(r.bidder_name)} · ${t('b_round')} ${r.round} · ${new Date(r.created_at).toLocaleString()}</div></div>
          ${r.lot_status === 'active' ? `<button class="btn small secondary bs-cancel" style="flex:none;color:#ff8b6b;border-color:#ff8b6b" data-id="${r.lot_id}">${t('cancel_lot')}</button>` : `${r.lot_status === 'cancelled' ? `<span class="chip" style="flex:none;color:#ff8b6b;border-color:#ff8b6b;font-weight:700">${t('cancelled_tag')}</span>` : ''}<button class="btn small bs-relist" style="flex:none" data-id="${r.lot_id}">↻ ${t('relist_lot')}</button>`}
          </div>`).join('') || `<p class="note">—</p>`}
      </div>`}`;
    $$('.range-btn', body).forEach((b) => b.addEventListener('click', () => {
      bidRange = b.dataset.range;
      sellerTab('bidstats');
    }));
    $$('.bs-cancel', body).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(t('cancel_confirm'))) return;
      b.disabled = true;
      try {
        await api('/api/seller/lots/' + b.dataset.id + '/cancel', { method: 'POST', headers: sellerHeaders() });
        toast(t('cancelled_ok'));
        sellerTab('bidstats');
      } catch (err) { b.disabled = false; toast((err.data && err.data.error) || 'Error'); }
    }));
    $$('.bs-relist', body).forEach((b) => b.addEventListener('click', async () => {
      if (!confirm(t('relist_confirm'))) return;
      b.disabled = true;
      try {
        await api('/api/seller/lots/' + b.dataset.id + '/relist', { method: 'POST', headers: sellerHeaders() });
        toast(t('relisted_ok'));
        sellerTab('bidstats');
      } catch (err) { b.disabled = false; toast((err.data && err.data.error) || 'Error'); }
    }));
  }
}

/* --------------------- Stripe return (?paid / ?pay_cancelled) ------ */
async function handlePaymentReturn() {
  const q = new URLSearchParams(location.search);
  const paidId = q.get('paid');
  const cancelledId = q.get('pay_cancelled');
  if (!paidId && !cancelledId) return;
  const sessionId = q.get('session_id') || '';
  history.replaceState(null, '', location.pathname + location.hash); // keep the URL clean on reload
  const banner = document.createElement('div');
  banner.className = 'pay-banner neutral';
  document.body.insertBefore(banner, document.querySelector('main'));
  if (cancelledId) {
    banner.innerHTML = `<strong>${t('pay_cancelled_h')}</strong><br>${t('pay_cancelled_p')}`;
    return;
  }
  banner.textContent = t('loading');
  try {
    const s = await api(`/api/orders/status?order_id=${encodeURIComponent(paidId)}&session_id=${encodeURIComponent(sessionId)}`);
    if (s.paid) {
      banner.className = 'pay-banner ok';
      banner.innerHTML = `<strong>${t('pay_received_h')}</strong><br>${t('pay_received_p')} (#${s.order_id} · ${fmt(s.total_cents)})`;
    } else {
      banner.innerHTML = `<strong>${t('pay_pending_h')}</strong><br>${t('pay_pending_p')}`;
    }
  } catch {
    banner.innerHTML = `<strong>${t('pay_pending_h')}</strong><br>${t('pay_pending_p')}`;
  }
}

/* ------------------------- PWA install prompt ----------------------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => { navigator.serviceWorker.register('/sw.js').catch(() => {}); });
}
let deferredInstall = null;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredInstall = e;
  showInstallBanner();
});
window.addEventListener('appinstalled', () => {
  deferredInstall = null;
  const b = document.getElementById('install-banner');
  if (b) b.remove();
});
function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}
function showInstallBanner() {
  if (isStandalone()) return;
  try { if (sessionStorage.getItem('kda_install_seen')) return; } catch {}
  if (document.getElementById('install-banner')) return;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
  if (!isIOS && !deferredInstall) return; // no native prompt available (yet)
  try { sessionStorage.setItem('kda_install_seen', '1'); } catch {}
  const bar = document.createElement('div');
  bar.id = 'install-banner';
  bar.className = 'install-banner';
  bar.innerHTML = `<img class="install-icon" src="/icons/icon-192.png" alt="">
    <div class="install-txt"><strong>${t('install_title')}</strong><span>${isIOS ? t('install_ios') : t('install_sub')}</span></div>
    ${isIOS ? '' : `<button class="btn small" id="install-go" type="button">${t('install_app')}</button>`}
    <button class="install-x" id="install-x" type="button" aria-label="Close">×</button>`;
  document.body.appendChild(bar);
  $('#install-x', bar).addEventListener('click', () => bar.remove());
  const go = $('#install-go', bar);
  if (go) go.addEventListener('click', async () => {
    if (!deferredInstall) return;
    deferredInstall.prompt();
    try { await deferredInstall.userChoice; } catch {}
    deferredInstall = null;
    bar.remove();
  });
}
// iOS Safari never fires beforeinstallprompt — offer the hint once per session.
window.addEventListener('load', () => { setTimeout(showInstallBanner, 1500); });

/* ------------------------------- router ------------------------------ */
function setNav(key) { $$('.main-nav a').forEach((a) => a.classList.toggle('active', a.dataset.nav === key)); }
async function render() {
  const hash = location.hash || '#/';
  const parts = hash.replace(/^#\//, '').split('/');
  window.scrollTo(0, 0);
  syncHeaderH();
  updateBidsFab();
  // Zone deep links: #local / #overseas / #flash open the home page on that zone.
  if (ZONE_HASH[hash]) homeZone = ZONE_HASH[hash];
  else if (hash === '#/' || hash === '#') homeZone = 'local';
  const known = ['lot', 'my-bids', 'rules', 'contact', 'my-messages', 'checkout', 'seller'];
  const isHome = !!ZONE_HASH[hash] || hash === '#/' || hash === '#' || !known.includes(parts[0]);
  if (!isHome) hideZoneTabs();
  try {
    if (isHome) { setNav('home'); await pageHome(); }
    else if (parts[0] === 'lot') { setNav('home'); await pageLot(Number(parts[1])); }
    else if (parts[0] === 'my-bids') { setNav('mybids'); await pageMyBids(); }
    else if (parts[0] === 'rules') { setNav('rules'); pageRules(); }
    else if (parts[0] === 'contact') { setNav(''); pageContact(); }
    else if (parts[0] === 'my-messages') { setNav('mymsg'); pageMyMessages(); }
    else if (parts[0] === 'checkout') { setNav('mybids'); await pageCheckout(Number(parts[1])); }
    else if (parts[0] === 'seller') { setNav(''); await pageSeller(); }
  } catch (err) {
    app.innerHTML = `<div class="empty">Error: ${esc(err.message || 'failed to load')}</div>`;
  }
}
window.addEventListener('hashchange', render);
applyI18nStatic();
handlePaymentReturn();
render();
