# Agent onboarding

> **Read [PROJECT_CONTEXT.md](./PROJECT_CONTEXT.md) end-to-end before making changes.**
> It captures the project's architecture, hard-won decisions, environment setup, and known footguns. It's the single source of truth for understanding this codebase.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Quick orientation

- **Stack:** Next.js 16 App Router · React 19 · Tailwind v4 (CSS-first) · TypeScript · Vercel.
- **Project type:** marketing site for a multi-vertical engineering group (Nexatel — Kuwait + Kerala) with a JSON-file CMS, password-protected admin, contact + quote forms, and Resend email integration.
- **Config:** `vercel.ts` (typed config), not `vercel.json`. Proxy file is `src/proxy.ts` (renamed from `middleware.ts` in Next 16).
- **Data:** all content in `data/*.json`. Filesystem is writable in dev, read-only on Vercel — see [PROJECT_CONTEXT.md §6](./PROJECT_CONTEXT.md#6-data-layer-the-json-cms).

## Top three footguns

1. **Never interpolate Tailwind class names.** `className={\`lg:col-span-${x}\`}` won't work — Tailwind's class scanner sees only literal strings. Use `${x ? "lg:col-span-3" : "lg:col-span-5"}` instead.
2. **Global CSS rules must be in `@layer base`** — otherwise they override Tailwind utilities. (See `globals.css` `a { color: inherit }`.)
3. **`vercel.ts` headers use path-to-regexp**, not raw regex. No `(?:…)` non-capturing groups, or the build fails.

Full footgun list: [PROJECT_CONTEXT.md §16](./PROJECT_CONTEXT.md#16-footguns-and-lessons-learned-read-this).
