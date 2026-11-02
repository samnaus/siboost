# Siboost

Marketing and checkout site for Siboost, a New Zealand business that upgrades existing websites for AI-assisted discovery.

Tagline: **Websites built for the way people search now.**

Prices are in NZD and exclude GST. The public site offers one-off packages. Monthly subscriptions stay in the Stripe code and stay hidden until `SUBSCRIPTIONS_ENABLED=true`. AI sales agents are not offered; `/ai-sales-agents` redirects to `/packages`. The readiness check stores a request for a person to review. It does not produce a score.

## Run it locally

Requires Node.js 20.9 or newer.

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://127.0.0.1:4317](http://127.0.0.1:4317).

`npm install` generates the Prisma client. `npm run dev` and `npm run build` create the SQLite database and seed the five products if they are missing. The seed does not overwrite prices you have edited in admin.

The local `.env` created for this workspace uses:

- Admin email: `admin@siboost.test`
- Admin password: `siboost-dev-admin`

Change both before anyone else can reach the machine. Admin is at `/admin`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on port 4317 |
| `npm run build` | Prepare the database, then production build |
| `npm start` | Production server on port 4317 |
| `npm test` | GST, checkout, webhook and validation tests against a separate SQLite file |
| `npm run lint` | ESLint |
| `npm run db:prepare` | Select the Prisma provider, push the schema and seed products |

## What is live, what is a demonstration, what is not connected

| Area | Status |
| --- | --- |
| Public pages, forms, admin, sitemap, robots, schema.org | Working. Enquiries and readiness checks are stored in the database. |
| Prices, package features, homepage headline, FAQs, about copy | Editable in `/admin`. Other page copy lives in `lib/content/defaults.ts`. |
| Stripe Checkout, GST, webhooks, customer portal | Implemented. They stay off until test keys are set. The site then says **Payments are not yet configured.** |
| Monthly subscriptions | Implemented and hidden. Set `SUBSCRIPTIONS_ENABLED=true` to show SI Care, SI Agent and the bundle, and to accept them at checkout. |
| Live Stripe charges | Locked. A live secret key is ignored unless `ALLOW_LIVE_STRIPE=true`. |
| Transactional email | Resend or Postmark when configured. Otherwise the full message is printed in the server console and recorded as `logged`. |
| AI sales agents | Not offered on the public site. `/ai-sales-agents` redirects to `/packages`. |
| Website readiness check | A validated form. A person reviews it. There is no automated score. |
| llms.txt | A plain-language summary at `/llms.txt`. It does not replace crawlability, content, structured data or ordinary SEO. |
| Analytics | Not loaded unless `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` or `NEXT_PUBLIC_GA_MEASUREMENT_ID` is set. |

## Environment variables

Copy `.env.example` to `.env`. Never commit real secrets.

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | SQLite locally (`file:./dev.db`). Postgres on Vercel (`postgres://…` or `postgresql://…`). The provider is chosen automatically. |
| `NEXT_PUBLIC_SITE_URL` | Public origin, no trailing slash. Used for canonical URLs, the sitemap and Stripe return URLs. |
| `CONTACT_EMAIL` | Public contact address until it is changed in admin. |
| `ADMIN_EMAIL` | Admin sign-in email. |
| `ADMIN_PASSWORD` | Admin sign-in password. |
| `ADMIN_SESSION_SECRET` | Random string, at least 16 characters, used to sign the admin cookie. |
| `STRIPE_SECRET_KEY` | Stripe secret key. Use `sk_test_…` until go-live. Leave empty to keep payments unconfigured. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Publishable key. Hosted Checkout does not require it in the browser, but set it with the secret key. |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `/api/stripe/webhook`. |
| `STRIPE_GST_TAX_RATE_ID` | Optional. If empty, the app reuses or creates a 15% exclusive NZ GST tax rate named GST. |
| `STRIPE_PORTAL_CONFIGURATION_ID` | Optional Stripe Billing Portal configuration. One is created if this is empty. |
| `ALLOW_LIVE_STRIPE` | Must be `true` before an `sk_live_` key is accepted. Default is off. |
| `SUBSCRIPTIONS_ENABLED` | `true` shows SI Care, SI Agent and the combined bundle, and allows subscription checkout. Default is off. Redeploy after changing it. |
| `CHARGE_GST` | `true` by default. Set `false` only if the business must not add 15% GST. |
| `EMAIL_FROM` | From address, such as `Siboost <hello@siboost.co.nz>`. Required for real email. |
| `RESEND_API_KEY` | Resend API key. Used first if both email providers are set. |
| `POSTMARK_SERVER_TOKEN` | Postmark server token. |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Optional Plausible domain. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Optional GA4 measurement id, shaped like `G-XXXX`. |

Redeploy after changing env vars. Marketing pages are cached for up to an hour and refresh when content is saved in admin.

## Stripe test mode

1. Put `sk_test_…` in `STRIPE_SECRET_KEY`.
2. Start the webhook forwarder: `stripe listen --forward-to localhost:4317/api/stripe/webhook`.
3. Put the printed signing secret in `STRIPE_WEBHOOK_SECRET`.
4. Checkout shows a test-mode notice. Use card `4242 4242 4242 4242`, any future expiry and any CVC.
5. A successful return to `/checkout/success` records the order even if the webhook is slow. The webhook is still what keeps the record if the customer closes the tab early.
6. Subscription updates listened for: `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.async_payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.paid`, `invoice.payment_failed`.
7. `/billing` opens the Stripe customer portal for the email used at checkout.

`npm test` covers GST maths, the Checkout Session payload, duplicate webhook handling, and storing a purchase plus subscription. It does not call Stripe.

## Deploy to Vercel

SQLite will not persist on Vercel. Create a Postgres database (Neon, Supabase or Vercel Postgres) and set `DATABASE_URL` to that connection string for Production, Preview and Build.

The build runs `prisma db push` and seeds products when the catalogue is empty. The database must be reachable during the build.

Set the env vars above. Set `NEXT_PUBLIC_SITE_URL` to the production origin, including `https://`.

## Going live

Do these in order. Do not set `ALLOW_LIVE_STRIPE=true` until the test-mode checklist has passed.

1. **Stripe account.** Create or open the business Stripe account in New Zealand. Finish Stripe’s verification and add a NZD bank account for payouts.
2. **GST.** Confirm with an accountant that the business is GST-registered before charging GST. If it is not, set `CHARGE_GST=false` and do not add 15% at checkout. If it is, leave `CHARGE_GST=true`. The app adds a 15% exclusive tax rate named GST, or you can create that rate in Stripe and set `STRIPE_GST_TAX_RATE_ID`. Stripe Tax is optional and is not switched on by this app.
3. **Test mode.** Run the checklist in the Stripe section above: one-off package, package plus subscription, webhook delivery, confirmation email, billing portal, and cancellation at period end.
4. **Email.** Verify the sending domain with Resend or Postmark (SPF and DKIM). Set `EMAIL_FROM` and the provider key. Place a real order in test mode and confirm the customer receives it.
5. **Database.** Production `DATABASE_URL` must be Postgres. Take a backup routine before launch.
6. **Domain.** Point DNS at Vercel and set `NEXT_PUBLIC_SITE_URL` to the https origin.
7. **Admin.** Replace the local admin email, password and session secret with long unique values.
8. **Legal.** The privacy policy and terms are drafts for a New Zealand business, including the Privacy Act 2020. Have a lawyer review them before you rely on them. Company registration details are intentionally not invented.
9. **Live keys.** Swap in `sk_live_…` and `pk_live_…`, create a live webhook endpoint at `https://your-domain/api/stripe/webhook`, set the live webhook secret, then set `ALLOW_LIVE_STRIPE=true` and redeploy.
10. **One real $1 or the smallest real package in live mode**, with a card you control, and confirm the webhook, email, GST line and portal. Refund it if it was only a test.

## Project map

- `app/(site)` public pages
- `app/admin` protected dashboard
- `app/api/stripe/webhook` Stripe webhooks
- `lib/content/defaults.ts` starting copy
- `lib/catalog.ts` starting products and prices
- `prisma/schema.prisma` enquiries, readiness checks, customers, purchases, subscriptions

Privacy and terms pages are marked as drafts in the interface.
