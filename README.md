# Nexatel

Multi-vertical company website for **Nexatel** — IT services, fiber optics & structured cabling, telecom infrastructure, electrical/solar and IT hardware supply, with offices in **Kuwait** and **Kerala, India**.

Built with Next.js 16 (App Router) + Tailwind CSS v4. Lightweight, SEO-friendly, no database — content is stored as JSON in `/data` and editable through a simple password-protected admin.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Configure environment
cp .env.example .env.local
# then edit .env.local — set ADMIN_PASSWORD and ADMIN_SESSION_SECRET

# 3. Run
npm run dev          # http://localhost:3000
```

Build a production bundle:

```bash
npm run build
npm run start
```

---

## Environment variables

| Variable | Required | Notes |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Public origin used for canonical links, OG tags and the sitemap. |
| `ADMIN_PASSWORD` | yes | Password for `/admin/login`. Min 6 characters. |
| `ADMIN_SESSION_SECRET` | yes | Random string used to sign the admin session cookie. Min 32 chars. Generate with `openssl rand -hex 32`. |
| `RESEND_API_KEY` | no | Enables outbound email for contact + quote submissions. Without it, submissions are still saved and visible in the admin, but no email is sent. |
| `EMAIL_FROM` | no | Verified sender address for outgoing emails (e.g. `Nexatel <hello@nexatel.org>`). |

`.env.example` is the template. `.env.local` is git-ignored.

---

## Pages

| Path | Purpose |
|---|---|
| `/` | Home |
| `/about` | Company, values, offices |
| `/services` | All service verticals |
| `/services/[slug]` | Service detail |
| `/products` | Product catalogue |
| `/products/[slug]` | Product detail |
| `/projects` | Selected work |
| `/contact` | Contact form (POSTs to `/api/contact`) |
| `/get-quote` | Quote request form (POSTs to `/api/quote`) |
| `/privacy`, `/terms` | Legal placeholders |
| `/admin/login` | Admin sign-in |
| `/admin/dashboard` | Stats, recent submissions, email status |
| `/admin/products` | List / add / edit / delete products |
| `/admin/submissions` | Read-only view of all contact + quote submissions |
| `/admin/settings` | Edit notification email and CC list |

---

## Content & the JSON CMS

All content lives in `/data/*.json`:

```
data/
  company.json       # name, tagline, offices, stats, verticals
  services.json      # service verticals (5 items by default)
  products.json      # product catalogue — managed through /admin
  projects.json      # selected projects / case studies
```

**Editing**

- `company.json`, `services.json`, `projects.json` — edit directly in your editor and commit.
- `products.json` — managed through the admin UI at `/admin/products`. Locally the API writes the file directly. On Vercel (read-only filesystem) the API returns a 503 with guidance — see *Admin on Vercel* below.

After admin writes, affected pages are revalidated automatically.

### Submissions

`/contact` and `/get-quote` both POST to API routes that:

1. Validate input + apply per-IP rate limiting and a honeypot.
2. Try to send an email through **Resend** (only if `RESEND_API_KEY` is set; otherwise the payload is logged to stdout and visible via `vercel logs`).
3. Append the submission to `data/submissions.json` (when the filesystem is writable — local dev or any non-Vercel host).

The admin **Submissions** page renders the file as a read-only list with a per-row detail drawer. The recipient address is editable in **Settings** and lives in `data/settings.json`.

---

## Admin

`/admin/login` → enter the password from `ADMIN_PASSWORD`.

The admin uses an HMAC-signed, HTTP-only, `SameSite=strict` session cookie that expires after 8 hours. Login attempts are rate-limited (8 attempts per 5 minutes per IP).

### Admin on Vercel (read-only filesystem)

Vercel serverless functions cannot write to the project filesystem at runtime. The admin detects this and returns a clear message. **Recommended workflow**:

1. Run the admin locally (`npm run dev`).
2. Make changes — they write to `data/products.json`.
3. Commit and push — Vercel redeploys.

If you later want live edits in production, swap `saveProducts()` in `src/lib/data.ts` to write to **Vercel Blob** or a Marketplace database (Upstash Redis, Neon, etc.). The data layer is intentionally narrow to make this swap easy.

---

## Security guardrails baked in

- HMAC-signed admin session cookie, HTTP-only, `SameSite=strict`, `Secure` in production.
- Login throttling and contact-form throttling (per-IP, in-memory).
- Strict input validation (length caps, slug format, URL scheme) for all admin writes.
- Honeypot field on the public contact form.
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- `/admin` and `/api/admin` excluded from `robots.txt` and marked `noindex`.
- `poweredByHeader: false`.

---

## SEO

- Per-page `<title>`, description, canonical, Open Graph and Twitter card.
- JSON-LD `Organization` schema in the root layout.
- Auto-generated `sitemap.xml` and `robots.txt` (Next.js `app/sitemap.ts`, `app/robots.ts`).
- Static rendering for service and product detail pages, with on-demand revalidation when products change.
- Next.js `<Image>` with AVIF/WebP and lazy loading.

---

## Deploy to Vercel

> The project includes `vercel.ts` (typed TypeScript Vercel config).

1. Install the Vercel CLI (one-time): `npm i -g vercel`
2. From the project root:
   ```bash
   vercel              # link & deploy a preview
   vercel --prod       # promote to production
   ```
3. Set env vars in the Vercel dashboard (or `vercel env add`):
   - `NEXT_PUBLIC_SITE_URL`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`

Pull production env back to local with `vercel env pull .env.local`.

---

## Project structure

```
data/                    JSON content (company, services, products, projects)
public/                  static assets (logo.svg, og-default.svg)
src/
  app/                   App Router pages, sitemap, robots, API routes
    admin/               password-protected admin
    api/admin/           admin auth + products CRUD
    api/contact/         contact form endpoint
  components/            Header, Footer, Hero, ServiceCard, ProductCard, Forms
  lib/
    auth.ts              HMAC-signed admin session
    data.ts              JSON read/write
    rateLimit.ts         in-memory rate limiter
    seo.ts               metadata + JSON-LD helpers
    types.ts             shared types
    validate.ts          input validation
  middleware.ts          guards /admin and /api/admin
next.config.ts           Next.js config (security headers, image hosts)
vercel.ts                Vercel project config
```

---

## License

Private / proprietary — © Nexatel Group. Not licensed for redistribution.
