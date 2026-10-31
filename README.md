# Kanstar Daily Auction — deploy bundle

Single-seller auction site for Kanstar (kanstarus.com). Zero npm dependencies
(Node's built-in http + node:sqlite). Requires Node >= 22.

## Files in this bundle
- `server.js` — the whole server (API, auction lifecycle, checkout + CA tax,
  seller backend, traffic stats). On first boot it extracts
  `assets-bundle.zip` into `public/` and seeds the 11 real lots with fresh
  24-hour countdowns.
- `assets-bundle.zip` — the public/ web tree (pages + all lot photos).
- `package.json` — `npm start` runs `node server.js`, listens on `$PORT`.
- `Dockerfile` — optional container build.

## Render settings (if deploying on Render)
- Runtime: Node (or Docker), Build command: *(none needed)*, Start: `npm start`
- Attach a **persistent disk** and set env `DATA_DIR` to the disk mount path,
  otherwise the SQLite database resets on every restart/redeploy.
- Optional env: `TAX_RATE_CA` (default 0.095).

## Card payments (Stripe Checkout — wired, env-gated)
- With no Stripe env vars set, checkout records orders only (as before).
- Set these env vars on the host to take card payments (keys from the
  owner's Stripe account, never in this repo): `STRIPE_SECRET_KEY`,
  `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, and `SITE_URL`
  (default `https://kanstarus.com`). Checkout then creates a Stripe
  Checkout Session and redirects the winner to Stripe; orders move
  `pending_payment` → `paid` via webhook/reconciliation.
- Register the webhook in Stripe (Developers → Webhooks):
  URL `https://kanstarus.com/api/stripe/webhook`, events
  `checkout.session.completed` and `checkout.session.expired`; put the
  signing secret in `STRIPE_WEBHOOK_SECRET`.
- Email notifications are recorded as "sent" log rows only; wire a mail
  provider (Resend/SES) inside `logNotification()` when ready.

## Seller backend
Footer "Seller login" on the site. Passcode is stored in server.js as a
scrypt hash only (no plaintext anywhere in this bundle).
