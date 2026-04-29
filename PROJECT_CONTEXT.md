# Nexatel — Project Context for Future Sessions

> Read this file end-to-end before making changes. It captures everything an LLM (or new contributor) needs to understand the architecture, hard-won decisions, and footguns of this codebase. Last meaningful update: **2026-04-29**.
>
> ⚠️ **This is Next.js 16 + Tailwind v4 + React 19**, with several breaking changes from training-data defaults. Do not assume Next.js 13/14 conventions. When in doubt, read `node_modules/next/dist/docs/` and trust this document over training data.

---

## Table of contents

1. [Elevator pitch](#1-elevator-pitch)
2. [Tech stack snapshot](#2-tech-stack-snapshot)
3. [What this codebase is — and isn't](#3-what-this-codebase-is--and-isnt)
4. [Repository layout](#4-repository-layout)
5. [Routes catalogue](#5-routes-catalogue)
6. [Data layer (the JSON CMS)](#6-data-layer-the-json-cms)
7. [Authentication and the admin proxy](#7-authentication-and-the-admin-proxy)
8. [Email pipeline (Resend + graceful fallback)](#8-email-pipeline-resend--graceful-fallback)
9. [Form submissions (contact + quote)](#9-form-submissions-contact--quote)
10. [Admin shell pattern](#10-admin-shell-pattern)
11. [Hero component pattern](#11-hero-component-pattern)
12. [SEO + metadata + structured data](#12-seo--metadata--structured-data)
13. [Styling system](#13-styling-system)
14. [Environment variables](#14-environment-variables)
15. [Deployment (Vercel)](#15-deployment-vercel)
16. [Footguns and lessons learned (read this!)](#16-footguns-and-lessons-learned-read-this)
17. [Where to extend the system](#17-where-to-extend-the-system)
18. [Local development workflow](#18-local-development-workflow)
19. [Conventions](#19-conventions)
20. [Pending / wishlist](#20-pending--wishlist)

---

## 1. Elevator pitch

**Nexatel** is a multi-vertical engineering and technology group's marketing website with a built-in lightweight CMS. Five service verticals: **IT services · fiber optics & structured cabling · telecom infrastructure · electrical/solar · IT hardware supply**, with offices in **Kuwait City (HQ)** and **Kochi, Kerala**.

Goals baked into the architecture:

- **Lightweight** — no database, no CMS server, no build-time CMS sync. Content lives as JSON files in `/data`.
- **SEO-friendly** — per-page Open Graph, Twitter cards, Schema.org JSON-LD graph (Organization, WebSite, Service, Product, BreadcrumbList, LocalBusiness), sitemap.xml, robots.txt, manifest.webmanifest.
- **Self-hosted admin** — password-protected `/admin` for managing the product catalogue, viewing submissions read-only, and editing notification settings.
- **Email-out via Resend** — contact + quote submissions email to a configurable address (default `rafiq@nexatel.org`), and persist locally as JSON.
- **Vercel-first** — deploys via the Vercel CLI; uses `vercel.ts` (the modern typed config) not `vercel.json`.

---

## 2. Tech stack snapshot

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js **16.2.4** App Router | Breaking changes vs 13/14; uses async `params`/`searchParams`, route-group conventions, the new `proxy.ts` (formerly `middleware.ts`). |
| React | **19.2.4** | RSC + Server Actions enabled. |
| Bundler | **Turbopack** | The default in Next 16. `next dev`/`next build` use it automatically. |
| Styling | **Tailwind CSS v4** + `@tailwindcss/postcss` | CSS-first config via `@theme inline` block in `globals.css`. No `tailwind.config.ts`. |
| TypeScript | 5.x, strict | `noEmit` typecheck via `npx tsc --noEmit`. |
| Email | **Resend** SDK (lazy-imported) | Optional — graceful fallback if `RESEND_API_KEY` is missing. |
| Auth | Custom HMAC-signed cookie | No NextAuth. See [§7](#7-authentication-and-the-admin-proxy). |
| Storage | **JSON files** in `/data` (write at dev, read-only at prod) | Designed for easy swap to Vercel Blob / Marketplace DB later. |
| Hosting | **Vercel** | Fluid Compute (default). `vercel.ts` is the project config. |
| Node | 24 LTS (Vercel default in 2026) | Local should match. |

Other dependencies pinned in `package.json`:

- `@vercel/config` — typed Vercel project config.
- `resend` — Resend SDK (only loaded if API key is set).

There is **no ESLint** (`--no-eslint` was passed at scaffold). Add it back if needed, but no linter rules are enforced.

---

## 3. What this codebase is — and isn't

✅ Is:
- A **single, statically-rendered marketing site** with on-demand server-side rendering for `/admin` and `/api/*`.
- A **JSON-CMS** for the product catalogue, designed for ~50–500 products.
- A **read-only admin view** of incoming submissions (contact + quote).
- An opinionated **layered hero pattern** with optional background image, status pill, scan line, and corner brackets.

❌ Is not:
- A multi-tenant SaaS.
- A real CRM (no submission editing, deleting, or labelling).
- A blog (no post editor; pages are file-based).
- An e-commerce site (no cart, no payments).
- Internationalised (just `en-US` for now).

If asked to do CRM-y things or e-commerce, **stop and discuss** — the data layer is intentionally thin and the JSON file approach hits its limits quickly.

---

## 4. Repository layout

```
nexatel/
├── AGENTS.md                       # short pointer to this doc + Next.js 16 warning
├── CLAUDE.md                       # @-includes AGENTS.md
├── PROJECT_CONTEXT.md              # ← this file
├── README.md                       # public-facing setup + deploy guide
├── data/                           # the JSON CMS — mutable in dev, read-only on Vercel
│   ├── company.json                # name, tagline, offices (HQ Kuwait + Kochi), stats, verticals, social
│   ├── services.json               # 5 service verticals with slug, summary, highlights, image
│   ├── products.json               # product catalogue (managed via /admin)
│   ├── projects.json               # selected work / case studies
│   ├── settings.json               # editable: notificationEmail, ccEmails, autoReplyEnabled
│   └── submissions.json            # appended on contact/quote POST (cap 500)
├── public/
│   ├── logo.svg                    # navy + amber wordmark
│   └── og-default.svg              # 1200×630 social card fallback
├── src/
│   ├── app/
│   │   ├── layout.tsx              # root: html/body, fonts, JSON-LD graph (Organization+WebSite), Header, ConditionalFooter
│   │   ├── page.tsx                # home: hero + stats + services + about strip + featured products + projects + CTA
│   │   ├── globals.css             # Tailwind v4 import + custom CSS vars + utility classes (.btn-*, .card, .hero-*, etc.)
│   │   ├── icon.svg                # served at /icon.svg, picked up automatically as favicon
│   │   ├── apple-icon.svg          # served at /apple-icon.svg, picked up as apple-touch-icon
│   │   ├── manifest.ts             # → /manifest.webmanifest
│   │   ├── sitemap.ts              # → /sitemap.xml (static + service + product entries)
│   │   ├── robots.ts               # → /robots.txt (excludes /admin and /api/admin)
│   │   ├── not-found.tsx           # 404
│   │   ├── about/page.tsx
│   │   ├── services/
│   │   │   ├── page.tsx            # services index
│   │   │   └── [slug]/page.tsx     # service detail (Service + BreadcrumbList JSON-LD)
│   │   ├── products/
│   │   │   ├── page.tsx            # products index (revalidate=60)
│   │   │   └── [slug]/page.tsx     # product detail (Product + BreadcrumbList JSON-LD; force-static + revalidate=60)
│   │   ├── projects/page.tsx
│   │   ├── contact/page.tsx        # uses ContactForm; emits LocalBusiness JSON-LD per office
│   │   ├── get-quote/page.tsx      # uses GetQuoteForm; reads ?service=… for prefill
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── admin/
│   │   │   ├── layout.tsx          # passthrough (AdminShell handles chrome)
│   │   │   ├── page.tsx            # redirect → /admin/dashboard
│   │   │   ├── login/page.tsx      # client-side form posting to /api/admin/login
│   │   │   ├── dashboard/page.tsx  # stat cards + recent submissions + email status
│   │   │   ├── products/
│   │   │   │   ├── page.tsx        # list + Add CTA
│   │   │   │   ├── new/page.tsx    # create form
│   │   │   │   └── [id]/page.tsx   # edit form (uses ProductForm in mode=edit)
│   │   │   ├── submissions/
│   │   │   │   ├── page.tsx        # filter pills + search; passes to client component
│   │   │   │   └── SubmissionsClient.tsx  # split-pane on lg+; row click → side drawer
│   │   │   └── settings/
│   │   │       ├── page.tsx        # email + provider + storage panels
│   │   │       └── SettingsForm.tsx
│   │   └── api/
│   │       ├── contact/route.ts    # public; validates, emails, saves
│   │       ├── quote/route.ts      # public; validates, emails, saves
│   │       └── admin/
│   │           ├── login/route.ts  # POST {password} → sets HMAC cookie
│   │           ├── logout/route.ts # POST → clears cookie
│   │           ├── products/route.ts          # GET, POST
│   │           ├── products/[id]/route.ts     # GET, PUT, DELETE
│   │           ├── settings/route.ts          # GET, PUT
│   │           └── submissions/route.ts       # GET (read-only)
│   ├── components/
│   │   ├── Header.tsx              # client; sticky; hides itself on /admin/*
│   │   ├── Footer.tsx              # server; multi-column with offices
│   │   ├── ConditionalFooter.tsx   # client wrapper that hides Footer on /admin/*
│   │   ├── Logo.tsx                # SVG wordmark; light/dark variants
│   │   ├── Icon.tsx                # tiny SVG icon set: cpu, fiber, tower, bolt, box, check, arrow, phone, mail, pin, shield, globe
│   │   ├── Hero.tsx                # the layered hero (see §11)
│   │   ├── ServiceCard.tsx         # used on home + /services
│   │   ├── ProductCard.tsx         # used on home + /products
│   │   ├── ContactForm.tsx         # client; submits to /api/contact
│   │   ├── GetQuoteForm.tsx        # client; submits to /api/quote
│   │   ├── ProductForm.tsx         # client; create/edit, deletes, validation map
│   │   ├── AdminShell.tsx          # client; sidebar nav + topbar slot
│   │   └── AdminBar.tsx            # legacy — no longer imported (kept for reference; safe to delete)
│   ├── lib/
│   │   ├── types.ts                # Company, Service, Product, Project, Settings, Submission(Kind)
│   │   ├── data.ts                 # readJson/writeJson + getCompany, getServices, getProducts, getProjects, getSettings, getSubmissions, appendSubmission, isFsWritable
│   │   ├── auth.ts                 # createSessionToken, verifySessionToken, checkAdminPassword, ADMIN_COOKIE_NAME, SESSION_TTL_SECONDS
│   │   ├── email.ts                # sendSubmissionEmail (lazy-imports resend)
│   │   ├── seo.ts                  # buildMetadata + organization/website/service/product/breadcrumbs/localBusiness JSON-LD helpers
│   │   ├── rateLimit.ts            # in-memory bucket; per-IP keys
│   │   └── validate.ts             # validateProductInput, slugify
│   └── proxy.ts                    # Next 16 proxy (was middleware.ts) — guards /admin and /api/admin
├── .env.example                    # template; .env.local is git-ignored
├── .gitignore                      # ignores .env*, allows .env.example
├── next.config.ts                  # security headers + Unsplash remote pattern + AVIF/WebP
├── postcss.config.mjs              # Tailwind v4 plugin
├── tsconfig.json                   # default Next.js scaffold; @/* alias to src/*
└── vercel.ts                       # @vercel/config typed config (NOT vercel.json)
```

---

## 5. Routes catalogue

### Public

| Path | File | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Home; full hero with status pill + bg image |
| `/about` | `app/about/page.tsx` | Compact hero |
| `/services` | `app/services/page.tsx` | Compact hero, grid of 5 cards |
| `/services/[slug]` | `app/services/[slug]/page.tsx` | SSG via `generateStaticParams`; emits Service + BreadcrumbList JSON-LD |
| `/products` | `app/products/page.tsx` | `revalidate = 60` |
| `/products/[slug]` | `app/products/[slug]/page.tsx` | `force-static` + `revalidate = 60`; Product + BreadcrumbList JSON-LD |
| `/projects` | `app/projects/page.tsx` | Static |
| `/contact` | `app/contact/page.tsx` | Emits LocalBusiness JSON-LD (one per office) |
| `/get-quote` | `app/get-quote/page.tsx` | Reads `?service=fiber-optics` etc. for prefill |
| `/privacy`, `/terms` | placeholder pages |
| `/sitemap.xml` | `app/sitemap.ts` |
| `/robots.txt` | `app/robots.ts` |
| `/manifest.webmanifest` | `app/manifest.ts` |
| `/icon.svg` | `app/icon.svg` (auto) |
| `/apple-icon.svg` | `app/apple-icon.svg` (auto) |

### Admin (proxy-guarded)

| Path | File | Notes |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Redirects to `/admin/dashboard` |
| `/admin/login` | `app/admin/login/page.tsx` | Public (allowed in proxy) |
| `/admin/dashboard` | `app/admin/dashboard/page.tsx` | Stat cards + recent submissions |
| `/admin/products` | `app/admin/products/page.tsx` | List |
| `/admin/products/new` | `app/admin/products/new/page.tsx` | Create |
| `/admin/products/[id]` | `app/admin/products/[id]/page.tsx` | Edit / delete |
| `/admin/submissions` | `app/admin/submissions/page.tsx` | Read-only; split-pane drawer on lg+ |
| `/admin/settings` | `app/admin/settings/page.tsx` | Editable notification email |

### API (all `runtime = "nodejs"`)

| Path | Methods | File |
|---|---|---|
| `/api/contact` | POST | `app/api/contact/route.ts` |
| `/api/quote` | POST | `app/api/quote/route.ts` |
| `/api/admin/login` | POST | rate-limited 8 / 5min |
| `/api/admin/logout` | POST |
| `/api/admin/products` | GET, POST |
| `/api/admin/products/[id]` | GET, PUT, DELETE |
| `/api/admin/settings` | GET, PUT |
| `/api/admin/submissions` | GET |

The admin API routes do **not** check auth themselves — auth is enforced upstream by `src/proxy.ts`.

---

## 6. Data layer (the JSON CMS)

All content lives in `/data/*.json`. The data layer is `src/lib/data.ts`, which exposes:

```ts
getCompany()        // Company
getServices()       // Service[]
getServiceBySlug(slug)
getProducts()       // Product[]
getProductBySlug(slug) / getProductById(id)
saveProducts(list)  // dev only — see isFsWritable()

getSettings()       // Settings, with sane default if file is missing
saveSettings(settings)

getSubmissions()    // Submission[]
appendSubmission(s) // returns { saved: boolean; reason?: string }; cap 500

getProjects()       // Project[]

isFsWritable()      // returns process.env.VERCEL !== "1"
```

### File semantics

- **`company.json`, `services.json`, `projects.json`** — edited by hand and committed. Pages re-read on each render (or on rebuild for static pages).
- **`products.json`** — edited via `/admin/products`. The API uses `saveProducts` which writes via `fs.promises.rename` (atomic). Falls through to a 503 with guidance on Vercel.
- **`settings.json`** — edited via `/admin/settings`. Same write semantics as products.
- **`submissions.json`** — appended to by `/api/contact` and `/api/quote`. Read-only display in admin. Cap 500 entries (`unshift` + `slice(0, 500)`).

### `isFsWritable()` and the Vercel reality

Vercel Functions run on a read-only filesystem at runtime. `isFsWritable()` returns `false` when `process.env.VERCEL === "1"`. On Vercel:

- **Submissions:** still saved to in-process JSON via `appendSubmission`, but the actual write call returns `{ saved: false, reason: "read-only-fs" }`. The submission *is* still emailed (if Resend is configured) and logged to stdout (visible in `vercel logs`). It just won't show up in the admin until the JSON file is committed.
- **Products / settings:** API returns 503 with a clear message saying to run locally and commit.

**The intended workflow on Vercel** is: edit JSON locally → commit → push → Vercel redeploys.

If you want true live persistence in production, swap `saveProducts` / `saveSettings` / `appendSubmission` to write to **Vercel Blob** or a Marketplace database (Upstash Redis, Neon Postgres). The data-layer signatures are intentionally narrow to make this a few-line change — see [§17](#17-where-to-extend-the-system).

### Type definitions (`src/lib/types.ts`)

```ts
Company { name, legalName, tagline, description, founded, yearsOfExperience,
          stats[], verticals[], offices[], social, supportEmail, supportPhone }

Service { slug, title, summary, icon, highlights[], details, image }

Product { id, slug, name, category, shortDescription, description, features[],
          image, datasheetUrl?, createdAt }

Project { id, title, client, category, summary, year, image }

Settings { notificationEmail, ccEmails[], emailSubjectPrefix,
           autoReplyEnabled, updatedAt }

Submission { id, kind: "contact" | "quote", createdAt, name, email,
             organisation?, phone?, topic?,
             // quote-specific:
             serviceArea?, scope?, budget?, timeline?, location?,
             message,
             emailDelivered, emailError?, ip? }
```

---

## 7. Authentication and the admin proxy

### Cookie-based session

`src/lib/auth.ts` implements an HMAC-signed session cookie:

- **Cookie name:** `nx_admin`
- **TTL:** 8 hours
- **Signed with:** `process.env.ADMIN_SESSION_SECRET` (≥32 chars; generate with `openssl rand -hex 32`)
- **Format:** `base64url(JSON({iat, exp, nonce})) + "." + hex(hmac-sha256)`
- **Flags:** `httpOnly`, `sameSite: "strict"`, `secure` in production
- `verifySessionToken()` does timing-safe comparison and returns `null` on any failure (including missing secret) — this is intentional so a misconfiguration just denies access rather than crashing.

`checkAdminPassword(input)` does a constant-time comparison against `ADMIN_PASSWORD`.

### The proxy file (`src/proxy.ts`)

> ⚠️ Next 16 renamed `middleware.ts` to `proxy.ts`. The proxy **always runs on Node.js** — do not export a `runtime` config (it's rejected at build time). This is why we can use `node:crypto` directly in `auth.ts`.

The proxy matches `/admin/:path*` and `/api/admin/:path*`. The login routes are explicitly allow-listed. Everything else requires a valid session cookie:

- API requests → 401 JSON
- Page requests → 307 redirect to `/admin/login?next=…`

`robots.txt` also blocks `/admin` and `/api/admin`.

### Login UX

`/admin/login` is a client component using `useSearchParams` (wrapped in `<Suspense>` per Next 16's hard requirement). Login API rate-limits 8 attempts per 5 minutes per IP.

---

## 8. Email pipeline (Resend + graceful fallback)

`src/lib/email.ts` exports a single function:

```ts
sendSubmissionEmail(submission: Submission, settings: Settings):
  Promise<{ ok, provider: "resend" | "console", error? }>
```

It **lazy-imports `resend`** so the package is only loaded when actually used. If `RESEND_API_KEY` is unset, it returns `{ ok: false, provider: "console" }` after `console.log`-ing the full payload — visible in `vercel logs`.

Email content:
- Branded HTML template (navy header, amber accents, table layout for fields, blockquote for message)
- Plain-text fallback
- `from`: `process.env.EMAIL_FROM` or `Nexatel <onboarding@resend.dev>` (the resend.dev sender requires no domain verification but only delivers to your account email)
- `to`: `settings.notificationEmail`
- `cc`: `settings.ccEmails`
- `replyTo`: the submitter's email — so admin replies go straight to them
- `subject`: `${settings.emailSubjectPrefix} ${"Quote request" | "Contact"} — ${name}`

To enable real delivery:

1. Sign up at https://resend.com
2. Verify a domain (e.g. `nexatel.org`)
3. Set `RESEND_API_KEY` and `EMAIL_FROM="Nexatel <hello@nexatel.org>"`

---

## 9. Form submissions (contact + quote)

Both POST endpoints follow the same shape:

```
1. Per-IP rate limit (5 / 10min) using src/lib/rateLimit.ts (in-memory)
2. Honeypot field (company_website) — silent accept on hit
3. Strict validation: trim, length cap, email regex, slug/serviceArea allow-list
4. Build a Submission { id: "c-…" | "q-…" via randomUUID(), kind, ... }
5. await sendSubmissionEmail(...) — sets emailDelivered + emailError on the submission
6. await appendSubmission(...) — persists locally if FS writable
7. Return { ok: true }
```

`/api/quote` requires `serviceArea` from a fixed allow-list:
`it-services | fiber-optics | telecom | electrical-solar | it-hardware | other`

The same `?service=` value is used by `/get-quote` to prefill the dropdown when linked from a service detail page or the product detail "Request quotation" button.

---

## 10. Admin shell pattern

`src/components/AdminShell.tsx` is the **only** admin chrome. The site `Header` and `Footer` self-hide on `/admin/*` paths (Header via `usePathname`, Footer via the `ConditionalFooter` client wrapper) so admin pages never double-stack navigation.

The shell renders:

- **Sticky left sidebar** (lg+): Logo + Admin badge, then 4 nav items — Dashboard / Products / Submissions / Settings — with active state styled via `bg-[var(--primary)] text-white`. View Site link + Sign Out at the bottom.
- **Mobile drawer**: opens from the burger button on the topbar.
- **Topbar**: title + optional subtitle + actions slot (e.g. "Add product" button on the products page).

### Submissions split-pane

`SubmissionsClient.tsx` implements an email-client-style split-pane:

- Container: `grid lg:grid-cols-5 lg:h-[calc(100vh-11rem)]`
- Left card: `lg:col-span-3` (when row open) or `lg:col-span-5`. Internal `overflow-auto` on the table.
- Right card: `lg:col-span-2`, `lg:overflow-y-auto`, populated when a row is selected.

This guarantees both columns are exactly viewport-tall on desktop, with their own internal scroll. On mobile the layout reverts to natural page flow.

---

## 11. Hero component pattern

`src/components/Hero.tsx` is the most stylised piece of the site. It composes **six layers** in order:

```
[ Layer 0 ]  hero-gradient — solid + radial glows; placeholder while bg loads
[ Layer 1 ]  optional <Image> background (priority, fill, sizes="100vw", quality=75)
[ Layer 2 ]  directional dark gradient (heavier on the left where copy lives)
[ Layer 2b ] subtle bottom fade (24px) so the next section doesn't fight the image
[ Layer 3 ]  grid-pattern at 40% opacity
[ Layer 4 ]  hero-scan animated line (CSS @keyframes, respects prefers-reduced-motion)
[ Layer 5 ]  4× hero-bracket corner accents
[ Content ]  optional status pill (●Online·KW·IN), optional eyebrow, h1, p, CTAs
[ Layer 6 ]  bottom hairline gradient
```

### Props

```ts
{
  title, subtitle,                 // required
  eyebrow?, primaryCta?, secondaryCta?,
  backgroundImage?,                // optional Unsplash URL with explicit ?w=2400&q=75
  showStatus?: boolean = true,     // pill on/off
  size?: "default" | "compact",    // py-24/32 vs py-16/20
}
```

### Conventions

- **Home** uses `showStatus: true`, **no `eyebrow`** (the pill conveys "Online · KW · IN", which is geo-redundant with an eyebrow). Background image: `photo-1486325212027-8081e485255e`.
- **Inner pages** use `size: "compact"`, `showStatus: false`, with their own `eyebrow` (e.g. "Services", "About Nexatel", "Contact").

### History — important for choosing future bg images

I previously used `photo-1451187580459-43490279c0fa` (earth at night) with `mix-blend-luminosity` + `opacity: 0.6` — and it rendered effectively invisible because the photo is mostly black. The current Hero uses **opacity 1** and **no blend mode** with a directional dark overlay. Pick photos with clear visual interest; verify they show through.

### Verified-working Unsplash IDs in use

- `photo-1486325212027-8081e485255e` (home, get-quote)
- `photo-1517336714731-489689fd1ca8` (about)
- `photo-1518770660439-4636190af475` (services index)
- `photo-1558494949-ef010cbdcc31` (products)
- `photo-1545987796-200677ee1011` (projects)
- `photo-1497366216548-37526070297c` (contact)
- `photo-1509391366360-2e959784a276` (solar service)

---

## 12. SEO + metadata + structured data

### `buildMetadata()`

Single source of truth in `src/lib/seo.ts`. Every page calls it (or returns from `generateMetadata`). It produces:

- `<title>`, description, keywords, authors, creator, publisher, application-name, referrer
- `metadataBase`, canonical, hreflang
- Open Graph: title, description, url, site_name="Nexatel", locale="en_US", type ("website" or "article"), images with explicit width/height/alt
- Twitter: card="summary_large_image", site/creator (currently `@nexatel` — placeholder), images
- Robots + googlebot (`max-image-preview: large`, `max-snippet: -1`)
- `format-detection`

### Structured data (JSON-LD)

The root layout emits a `@graph` containing `Organization` + `WebSite`. Detail pages stack additional blocks:

| Page | Types added |
|---|---|
| `/services/[slug]` | `Service` (provider=Nexatel, areaServed=Kuwait+India), `BreadcrumbList` |
| `/products/[slug]` | `Product` (sku, brand, category, image, offer), `BreadcrumbList` |
| `/contact` | `LocalBusiness` × 2 (one per office), with telephone, email, full address |

Helpers in `src/lib/seo.ts`:

```ts
organizationJsonLd(company)
websiteJsonLd(company)
breadcrumbsJsonLd([{ name, path }, …])
serviceJsonLd(service, company)
productJsonLd(product, company)
localBusinessJsonLd(company)   // returns array, one per office
```

### Per-page OG images

Each section uses its hero photo (Unsplash with explicit `?w=1200&h=630&fit=crop&q=70&auto=format` query params) as the OG image, so social shares match what visitors see.

The fallback `/og-default.svg` is used by the home page and any page that doesn't override.

> ⚠️ **SVG OG images** work for Twitter/LinkedIn/Slack/iMessage but **Facebook prefers PNG/JPG**. If Facebook share previews matter, render `/og-default.svg` to PNG and update `DEFAULT_OG.url` in `src/lib/seo.ts`.

### Sitemap & robots

- `sitemap.ts` enumerates static paths + service slugs + product slugs
- `robots.ts` allows `/`, disallows `/admin`, `/api/admin`, references the sitemap

---

## 13. Styling system

### Tailwind v4

Tailwind v4 is **CSS-first**: no `tailwind.config.ts`. The theme is defined inside `globals.css` via:

```css
@import "tailwindcss";

:root {
  --primary: #0a2540;
  --accent: #f59e0b;
  /* … */
}

@theme inline {
  --color-primary: var(--primary);
  --color-accent: var(--accent);
  /* … */
}
```

This makes utilities like `bg-primary`, `text-accent`, etc. available. Arbitrary values like `bg-[var(--primary)]` also work.

### Custom utility classes (in `globals.css`)

- `.container-wide` — max-w-1200, responsive padding
- `.btn-primary`, `.btn-accent`, `.btn-outline`
- `.card` — bordered + hover-lift
- `.eyebrow` — small uppercase amber label
- `.section-title`, `.lead`, `.subtle-divider`
- `.hero-gradient` — navy + radial glows
- `.grid-pattern` — subtle 48px grid
- `.hero-scan` — animated horizontal line keyframe
- `.hero-bracket--{tl,tr,bl,br}` — 22×22 corner accents
- `.input`, `.textarea`, `.select`, `.label`, `.field-error`

### Critical rule: globals must be in `@layer base`

The site has a "links inherit color" rule:

```css
@layer base {
  a { color: inherit; }
}
```

**This must stay inside `@layer base`** — without the layer, source order makes it override Tailwind utilities, which broke the admin sidebar in an earlier version (active link rendered navy text on navy background, invisible). See [§16](#16-footguns-and-lessons-learned-read-this).

### Colour palette

| Token | Hex | Use |
|---|---|---|
| `--primary` | `#0a2540` | Brand navy, headings, primary buttons |
| `--primary-strong` | `#061a2e` | Footer bg, button hover |
| `--accent` | `#f59e0b` | Amber accent, eyebrows, CTAs |
| `--accent-strong` | `#d97706` | Accent hover/active |
| `--surface` | `#f8fafc` | Section bg |
| `--border` | `#e2e8f0` | Card borders |
| `--muted` | `#475569` | Secondary text |

---

## 14. Environment variables

| Variable | Required | Default if missing | Purpose |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | `https://nexatel.example.com` (broken share previews) | Canonical, OG, sitemap |
| `ADMIN_PASSWORD` | yes | throws on login | `/admin/login` password (≥6 chars) |
| `ADMIN_SESSION_SECRET` | yes | throws | HMAC key for session cookie (≥32 chars; gen with `openssl rand -hex 32`) |
| `RESEND_API_KEY` | no | submissions logged + saved, no email | Resend API key |
| `EMAIL_FROM` | no | `Nexatel <onboarding@resend.dev>` | Verified sender |

`.env.local` is git-ignored. `.env.example` documents the variables.

A complete JSON manifest with sample values, generation commands, and a Vercel CLI bulk-set script is documented in earlier session notes — also reproduced in `README.md` deployment section.

---

## 15. Deployment (Vercel)

### Project config — `vercel.ts` (NOT vercel.json)

This project uses the typed `vercel.ts` config from `@vercel/config`. Currently minimal:

```ts
import { type VercelConfig } from "@vercel/config/v1";

export const config: VercelConfig = {
  framework: "nextjs",
  buildCommand: "next build",
  installCommand: "npm install",
};
export default config;
```

> ⚠️ **Do not add a `headers` rule with raw regex.** Vercel uses **path-to-regexp**, which doesn't support `(?:…)` non-capturing groups. An earlier version had `routes.cacheControl("/(.*)\\.(?:svg|jpg|…)", …)` and Vercel rejected it at config-compile time:
> ```
> Error: Header at index 0 has invalid `source` pattern …
> ```
> The fix was simply to delete the rule — Vercel auto-caches `/public/*`, `/_next/image`, and `/_next/static/*` aggressively by default. If you do need a header rule, use path-to-regexp syntax: `/:path*.{svg,jpg,jpeg,png,webp,avif,ico}`.

### Deploying

```bash
# one-time
npm i -g vercel
vercel link

# preview
vercel

# production
vercel --prod

# pull env back to local
vercel env pull .env.local
```

### Function runtime

All API routes export `runtime = "nodejs"` so they run on Fluid Compute (the default in 2026; replaces Edge Functions). The proxy file always runs on Node — a `runtime` export is rejected at build.

---

## 16. Footguns and lessons learned (read this!)

These are **all real bugs we hit**. Future sessions should pre-empt them.

### 1. Dynamic Tailwind class names don't get generated

**Symptom:** `lg:col-span-5` element collapses to ~150 px.

**Cause:** I wrote `className={\`lg:col-span-${open ? "3" : "5"} card …\`}`. Tailwind's class scanner only sees **literal** class names in source. The interpolated string is invisible to it, so neither `lg:col-span-3` nor `lg:col-span-5` rules were generated.

**Fix:** always use a literal conditional:

```tsx
// ❌ wrong
className={`lg:col-span-${open ? "3" : "5"}`}

// ✅ right
className={`${open ? "lg:col-span-3" : "lg:col-span-5"}`}
```

This applies to ANY dynamic Tailwind class. Also avoid array joins, template-built width/height classes, etc.

### 2. Global `a { color: inherit }` overrides text-* utilities

**Symptom:** admin sidebar active link rendered navy on navy → invisible text.

**Cause:** the global rule sat outside any `@layer`, so source order made it override `text-white` on the active link.

**Fix:** wrap base/reset rules in `@layer base`:

```css
@layer base {
  a { color: inherit; }
}
```

This is the proper Tailwind v4 pattern. Anything outside a layer wins against utilities.

### 3. mix-blend-mode + dark photo + dark overlay = invisible image

**Symptom:** the user sees no background image at all in the hero.

**Cause:** `opacity: 0.6` + `mix-blend-mode: luminosity` + a dark navy gradient + a mostly-black photo (earth-at-night) = nothing visible.

**Fix:** opacity 1, no blend mode, **directional** gradient overlay (heavier on the side where the copy sits), and a photo with actual visual interest.

### 4. Vercel `vercel.ts` headers regex syntax

See [§15](#15-deployment-vercel) — Vercel uses path-to-regexp, not raw regex. No `(?:…)` non-capturing groups. The build fails before bundling.

### 5. Read-only filesystem on Vercel

`fs.writeFile` from a Vercel Function silently does nothing useful (or 503s). Always check `isFsWritable()` before writing. The current data layer returns clear error messages when called on Vercel.

If you migrate to Vercel Blob: the data-layer function signatures don't need to change, just the implementations of `saveProducts`, `saveSettings`, `appendSubmission`.

### 6. Next 16 renamed `middleware.ts` → `proxy.ts`

The file is now `src/proxy.ts`. The exported function can be named `proxy` or `middleware` (Next handles both). **The proxy always runs on Node.js** — exporting a `runtime` config in proxy is a build error.

### 7. `params` and `searchParams` are Promises in Next 16

```tsx
// page.tsx
export default async function Page({
  params,
}: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; // ← await
}

// route.ts
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```

Forgetting the `await` produces unhelpful runtime errors.

### 8. `useSearchParams` requires Suspense

In Next 16, any client component using `useSearchParams` must be wrapped in `<Suspense>`, or the page won't statically generate. The login page does this correctly; copy that pattern if you add more pages with search-param reads.

### 9. Header/Footer doubling in admin

The site `Header` is a client component that `return null`s when `pathname.startsWith("/admin")`. The `Footer` is a server component, so we wrap its render in `ConditionalFooter` (a client component) that does the same path check.

If you ever change the admin URL prefix (e.g. add `/dashboard` as a top-level route), update both checks.

### 10. AdminShell heights assume no top header

After hiding the site Header on admin routes, the AdminShell sidebar is `sticky top-0` and uses `min-h-screen` (not `min-h-[calc(100vh-4rem)]`). Don't put the AdminShell back inside something that adds vertical chrome.

### 11. Unsplash photo IDs can 404

I used `photo-1581090700227-1e8e29d4c3b1` which silently 404'd. Always verify a fresh Unsplash URL renders before committing. Prefer the verified IDs listed in [§11](#11-hero-component-pattern).

---

## 17. Where to extend the system

### Add a new product manually

Edit `data/products.json`. Or use `/admin/products/new` locally — the new file gets written, commit it, push.

### Add a new service vertical

Edit `data/services.json`. Add an entry with: `slug, title, summary, icon, highlights, details, image`. Also pick an icon from the `Icon.tsx` enum (`cpu | fiber | tower | bolt | box`) and update `ServiceCard.tsx`'s `ICON_MAP` if the icon name is new.

### Add a new top-level page

1. Create `src/app/<slug>/page.tsx`.
2. Export `metadata` (or `generateMetadata`) using `buildMetadata({ … })`.
3. Add the path to `app/sitemap.ts`.
4. If you want it in the header, edit `Header.tsx`'s `NAV` array.

### Wire submissions to a real database

`src/lib/data.ts` — replace the bodies of `saveProducts`, `saveSettings`, `appendSubmission`, `getSubmissions`. Suggested options:

- **Vercel Blob** — simplest; treat the JSON file as a blob. `put()` for each save, fetch on read. Use the `tag` API for grouping.
- **Upstash Redis** (Marketplace) — list (`LPUSH`) for submissions, hash for settings/products. Sub-millisecond reads.
- **Neon Postgres** (Marketplace) — proper relational schema; gives you filterable submissions, indexes, archival.

Function signatures don't need to change. The components, API routes, and proxy don't care.

### Wire emails to send actually

1. Create a Resend account.
2. Verify a domain (e.g. `nexatel.org`).
3. Set `RESEND_API_KEY` and `EMAIL_FROM` in Vercel env.
4. Redeploy.

To add a confirmation auto-reply, expand `sendSubmissionEmail`: when `settings.autoReplyEnabled`, send a second email to the submitter with a thank-you template.

### Add a new admin section

1. Create `src/app/admin/<section>/page.tsx`. Wrap content in `<AdminShell title="…" />`.
2. Add to the `NAV` array in `AdminShell.tsx` with an icon.
3. Add API routes under `src/app/api/admin/<section>/` if needed — they're auto-protected by the proxy.

### Internationalisation

Currently `en-US` only. To add Arabic / Malayalam:

1. Move pages into `(en)/` route group.
2. Create `(ar)/` mirror with `dir="rtl"` on the layout's `<html>`.
3. Add a locale switcher in `Header.tsx`.
4. Update `sitemap.ts` to emit `<xhtml:link>` per language.
5. Update `buildMetadata` to set `alternates.languages` properly.

Heavy lift; defer until requested.

---

## 18. Local development workflow

```bash
npm install
cp .env.example .env.local
# edit .env.local — set ADMIN_PASSWORD and ADMIN_SESSION_SECRET (openssl rand -hex 32)
npm run dev          # http://localhost:3000
```

`npm run build` does a full prod build. Use it before opening a PR — Turbopack catches type errors and unused imports the dev server doesn't surface immediately.

`npx tsc --noEmit` is the fastest way to typecheck without running the bundler.

The default dev creds in `.env.local` (committed `.env.example` shows them):
- `ADMIN_PASSWORD=nexatel-dev-2026`
- `ADMIN_SESSION_SECRET=` *(set to any 32+ char dev string)*

Do not deploy these to production — rotate before going live.

### Preview testing pattern

This project uses the Claude Preview MCP for visual / responsive verification. The server is started via `mcp__Claude_Preview__preview_start` (config in `.claude/launch.json`), which runs `npm run dev`.

Key tools:

- `preview_eval` — run JS in the page; great for asserting computed styles, OG tags, JSON-LD types
- `preview_resize` — toggle mobile/tablet/desktop
- `preview_logs` — inspect dev-server output

When verifying a styling change, **don't trust screenshots for fine details**: query the computed style with `preview_eval` (e.g. `getComputedStyle(el).color`).

---

## 19. Conventions

### File naming

- `PascalCase.tsx` for components
- `kebab-case.ts` for non-component lib files (`auth.ts`, `seo.ts`, `rate-limit.ts` — wait, ours is `rateLimit.ts`; we use camelCase for libs actually). Match what's there.
- API route files are always `route.ts`; pages are always `page.tsx`; layouts are `layout.tsx`.

### Imports

- Use the `@/` alias (configured in `tsconfig.json`) for everything under `src/`. No relative `../..`.
- Lazy-import heavy modules (resend) inside the function that uses them.

### Server vs client

- Default to server components. Add `"use client"` only when you need state, effects, or `useRouter`/`usePathname`.
- Forms are client components; their parent pages are server components passing data in via props.

### Validation

- All admin POST/PUT bodies go through `validateProductInput` / inline checks in route handlers.
- Length caps, slug regex, URL scheme, allow-listed enums. Don't trust client input.

### Error handling

- API routes return `{ ok: boolean, error?: string, issues?: [{field, message}] }`.
- Client forms display `error` directly, and map `issues[]` to per-field messages.
- Don't throw in server components; use `notFound()` from `next/navigation` for 404s.

### Adding a new dependency

- Prefer no dep over a small one over a large one. The codebase deliberately avoids: zod (use manual validation), shadcn (use Tailwind directly), date-fns (use Intl), lodash, etc.
- Always check bundle impact for client deps.

---

## 20. Pending / wishlist

Not currently broken, but worth doing eventually:

- [ ] **PNG version of `/og-default.svg`** for Facebook share previews.
- [ ] **Real Twitter handle** — replace `@nexatel` placeholder in `src/lib/seo.ts:13`.
- [ ] **Real phone numbers** in `data/company.json` (currently `+965 0000 0000`, `+91 484 000 0000`). These appear in `LocalBusiness.telephone` JSON-LD.
- [ ] **Persistent submissions in production** — wire `appendSubmission` to Vercel Blob or Upstash. Currently submissions only persist on dev.
- [ ] **Submission status** (read / replied / archived). Schema-level; needs writable storage.
- [ ] **Auto-reply email** to form submitters when `settings.autoReplyEnabled`. Hook in `sendSubmissionEmail`.
- [ ] **Brand-real imagery** — replace Unsplash photos with custom photography once available.
- [ ] **Arabic locale** for the Kuwait market.
- [ ] **Sitemap priority weights** based on page popularity once analytics are in.
- [ ] **Cookie banner** for the privacy policy (no tracking is set, but disclosure may still be required).
- [ ] **Drop the unused `AdminBar.tsx`** — it was superseded by `AdminShell.tsx` but not removed.

---

## Appendix A — common questions

**Q: How do I run the admin locally?**
A: `npm run dev`, go to http://localhost:3000/admin/login, log in with `ADMIN_PASSWORD` from `.env.local`.

**Q: How do I add a new product on production?**
A: You can't directly — Vercel filesystem is read-only. Add it locally via `/admin/products/new`, commit `data/products.json`, push.

**Q: A button on the site does nothing on Vercel.**
A: Check `vercel logs` for the request. Most likely it's a write-to-FS hitting the read-only check.

**Q: My new page isn't in the sitemap.**
A: Add it to `app/sitemap.ts`. It's hand-curated.

**Q: The hero image isn't loading.**
A: Two possibilities — Unsplash ID is dead (try a different one), or you forgot to add the hostname to `next.config.ts`'s `images.remotePatterns`.

**Q: Can I add a blog?**
A: There's no blog scaffolding. You'd add `src/app/blog/[slug]/page.tsx` with content from `data/posts.json`, an index at `/blog`, MDX or markdown rendering. Significant work — discuss scope first.

**Q: Why no NextAuth / Clerk / Supabase Auth?**
A: For a single admin password, the HMAC cookie approach is ~80 lines of code and 0 dependencies. NextAuth would be 10× the code with no benefit until you add OAuth providers.

---

## Appendix B — chronological build log (high-level)

For context on why some choices look the way they do:

1. **Initial scaffold** — `create-next-app` with TS, Tailwind, src dir, no ESLint, no git.
2. **Public site v1** — Hero, Header, Footer, services/products/projects/contact pages with Unsplash imagery, OG schema, sitemap.
3. **Admin v1** — JSON-CMS for products, HMAC session, login/list/edit/new product pages.
4. **Hero polish** — added status pill, scan line, corner brackets, refined typography. Initially used `mix-blend-luminosity` — discovered it kills image visibility. Reworked to opacity 1 + directional overlay.
5. **Submissions + settings** — added contact form persistence, quote form, settings.json, admin Submissions and Settings pages, Resend integration with graceful fallback.
6. **Admin chrome cleanup** — discovered the site Header + Footer were doubling up on admin pages. Added `usePathname` checks to hide them on `/admin/*`. Fixed AdminShell sticky/min-height calcs that assumed a 64-px header.
7. **Tailwind class generation bug** — submissions table collapsed because of `lg:col-span-${dynamic}`. Fixed with literal conditional.
8. **`a { color: inherit }` cascade bug** — admin sidebar active link invisible. Fixed by wrapping in `@layer base`.
9. **Vercel deploy failure** — `vercel.ts` had a regex with `(?:…)` non-capturing group. Vercel uses path-to-regexp. Removed the rule.
10. **SEO completion** — manifest.ts, apple-icon, per-page OG images with explicit dimensions, full structured-data graph (Organization + WebSite + Service + Product + BreadcrumbList + LocalBusiness).
11. **Submissions split-pane** — fixed-height grid on lg+, internal scroll on both columns, mobile reverts to natural flow.
12. **Hero topmatter** — removed redundant eyebrow on home (status pill already conveys "KW · IN"). Added explicit gap logic.

---

End of context. When in doubt, **check this file first**, then Next.js docs in `node_modules/next/dist/docs/`, then training data — in that order.
