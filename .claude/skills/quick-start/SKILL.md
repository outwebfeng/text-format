---
name: quick-start
description: "Build a complete SaaS project from a brief, reference URL, or content source. Handles everything: project config, pixel-perfect landing page (cloned from reference or generated), content extraction, dashboard pages, module wiring. Use when the user says they want to build something, gives a reference URL, provides a GitHub repo, or describes a product idea. Triggers on: 'new project', 'build a site for...', 'make it look like...', 'clone this...', 'I want to build...', any URL + product description combo."
argument-hint: "<what to build — product brief, reference URL, content source URL, or all three>"
user-invocable: true
---

# Quick Start — $ARGUMENTS

You are building a complete SaaS project. Parse the user's input to determine which mode to run:

## Input Parsing

From "$ARGUMENTS", extract:

- **App name** — the product name (required; ask if not provided)
- **App description** — what the product does
- **Reference URL** — a website whose visual design/layout to replicate (optional)
- **Content source** — where to get text/images: a URL, a GitHub repo, or the user's description (optional; falls back to user's description)
- **Domain** — production URL if known (default: `http://localhost:3000`)
- **Features** — what the user wants to build (helps decide modules + dashboard pages)

## Mode Selection

Based on what the user provided, automatically select the right mode:

### Mode A: Reference Site + Content Source
**Triggers:** User provided a reference URL (and optionally a separate content source)
**Example:** "做一个 AI 写作工具叫 WriteAI，参考 jasper.ai 的网站风格，内容参考 https://github.com/xxx/yyy 的 README"
**Action:** Full pipeline — extract reference site's design, extract content from source, generate pixel-perfect landing page with swapped content, wire up modules.

### Mode B: Reference Site Only
**Triggers:** User provided a reference URL but no separate content source
**Example:** "参考 linear.app 做一个项目管理工具"
**Action:** Extract reference site's design AND content structure, rewrite content based on user's product description, generate pixel-perfect landing page.

### Mode C: Description Only
**Triggers:** No reference URL, just a product description
**Example:** "做一个 AI 壁纸生成器，叫 WallpaperAI，用户输入提示词生成壁纸，按月订阅"
**Action:** Generate a polished landing page from scratch using modern SaaS design patterns, wire up modules.

---

## Phase 0: Project Config (all modes)

### 0.1 Ask the user what they need

Before doing anything, ask the user these questions (skip any already answered in "$ARGUMENTS"):

1. **App name and description** — "What's the product called? One sentence describing what it does."
2. **Database** — "Do you need a database? If yes, which one?"
   - **SQLite** (default) — zero setup, good for prototyping and small apps. Data stored in a local file.
   - **PostgreSQL** — production-grade, recommended for most SaaS apps.
   - **MySQL** — if the user already has a MySQL instance or preference.
   - **None** — skip database setup entirely (static site, no auth/payment features).
3. **Domain** — "Do you have a domain? Or just localhost for now?"

If the user doesn't specify, default to **SQLite** and move on — don't block on this.

### 0.2 Configure environment

If `.env.development` doesn't exist yet, copy the template first: `cp .env.example .env.development`. Then set the values in `.env.development` (the canonical local-dev env file — loaded by both `vite dev` and the `db:*` scripts, ahead of `.env.local`/`.env`). Public, client-visible vars use the `VITE_` prefix:
```env
VITE_APP_URL=<domain or http://localhost:3000>
VITE_APP_NAME=<App Name>
VITE_APP_DESCRIPTION=<description>
DATABASE_PROVIDER=<sqlite|postgres|mysql>
DATABASE_URL=<connection string>
```

Default `DATABASE_URL` values:
- SQLite: `file:data/local.db`
- PostgreSQL: `postgresql://user:pass@localhost:5432/dbname`
- MySQL: `mysql://user:pass@localhost:3306/dbname`

### 0.3 Initialize database schema

Run `pnpm db:setup` — this copies the matching dialect template into `schema.ts` based on `DATABASE_PROVIDER`:

```bash
pnpm db:setup    # reads DATABASE_PROVIDER from .env.development, copies the right template
```

Or manually:
```bash
cp src/config/db/schema.sqlite.ts src/config/db/schema.ts    # SQLite
cp src/config/db/schema.postgres.ts src/config/db/schema.ts  # PostgreSQL
cp src/config/db/schema.mysql.ts src/config/db/schema.ts     # MySQL
```

`schema.ts` is gitignored — it's the user's working copy. The three template files are committed to git as the base schema.

### 0.4 Push schema and initialize

```bash
pnpm db:push                                  # create tables
pnpm rbac:init --admin-email=<email> --admin-password=<password>  # create roles + admin user
```

Ask the user for their admin email and password. If they don't provide one, just run `pnpm rbac:init` without the flags and tell them to create a user via sign-up page, then promote manually.

### 0.5 Update translations

Translations are flat, dot-keyed JSON in `messages/en.json` and `messages/zh.json` (one file per locale). Update **both**:
- Set `common.metadata.title` and `common.metadata.description` to the app name and description.

Decide which modules to keep based on user's features. Default: keep all. Only remove if the user explicitly doesn't need something.

---

## Phase 1 & 2: Landing Page Build (Mode A & B — delegate to /clone-website)

**When the user provides a reference URL (Mode A or B), do NOT attempt to extract CSS or assets yourself.**

Instead, after Phase 0 (project config) is complete, invoke the `/clone-website` skill with the reference URL:

```
/clone-website <reference-url>
```

The `clone-website` skill handles the entire pixel-perfect cloning pipeline:
- Browser automation for CSS extraction, screenshots, and interaction discovery
- Asset downloading (images, videos, SVGs, fonts)
- Component specification files
- Parallel builder agent dispatch
- Visual QA diff

**For Mode A** (reference + separate content source): After `clone-website` finishes, replace the cloned text content with content from the user's content source (GitHub README, another URL, or their description). Keep the exact visual structure and styling.

**For Mode B** (reference only): After `clone-website` finishes, rewrite the cloned text content to match the user's product description. Keep the exact visual structure and styling.

**Visual replacement:** When the cloned site's product screenshots no longer match the new product (different domain, different UI), use the `/generate-image` skill to produce on-brand replacements. Match each replacement's dimensions to the original (`width`/`height`) so the layout doesn't shift, and reuse a consistent `style` across all generated images so the page feels cohesive. Skip this for purely decorative imagery (gradients, abstract shapes) — those usually transfer fine.

Then continue to Phase 3 (Dashboard Pages) and beyond.

---

## Phase 2: Foundation Build (Mode C only)

### Mode C:

1. Keep the default font (Inter) or pick a modern alternative if the product brief suggests a style
2. Pick a color scheme that fits the product:
   - Developer tools → dark with accent (blue/green/purple)
   - Consumer SaaS → clean white with vibrant accent
   - Creative tools → bold, colorful
   - Enterprise → conservative, trust-building
3. Update `src/styles/globals.css` color tokens accordingly
4. Verify: `pnpm build`

---

## Phase 3: Page Construction

### 3.1 Landing Page (`src/routes/index.tsx`)

**Mode A & B:** Already handled by `/clone-website` in Phase 1. Skip to 3.2.

**Mode C — Generated from scratch:**

The repo ships with a default landing page composed of demo blocks in `src/blocks/` (`header`, `hero`, `features`, `pricing`, `footer`). **Rewrite those blocks with the user's content; keep the primitives in `src/components/`.**

Workflow:

1. **Reuse the primitives** — don't reinvent these:
   - `components/site-header.tsx` → `SiteHeader` (takes `navLinks`)
   - `components/site-footer.tsx` → `SiteFooter` (takes `tagline`, `columns`, `socials`)
   - `components/pricing-table.tsx` → `PricingTable` (takes `groups`)
   - `components/ui/*` — shadcn primitives (Button, Card, Accordion, etc.)

2. **Rewrite the blocks** — each block reads i18n (`m['landing....']()` from `@/paraglide/messages.js`) and passes content to a primitive. Keep this file-per-section pattern:
   - `blocks/header.tsx` — wraps `SiteHeader`
   - `blocks/hero.tsx` — large heading, subtext, 1-2 CTAs, optional hero image
   - `blocks/features.tsx` — 3-6 feature cards (user's brief)
   - `blocks/how-it-works.tsx` — add if applicable (3-step flow)
   - `blocks/pricing.tsx` — wraps `PricingTable` with tier config
   - `blocks/faq.tsx` — add if applicable (use shadcn Accordion)
   - `blocks/cta.tsx` — final CTA section
   - `blocks/footer.tsx` — wraps `SiteFooter`. **Keep `SiteFooter` from `components/site-footer.tsx`** — it already mounts the `BuiltWithShipAny` badge (links to `https://shipany.ai/?utm_source=<app_hostname>` (hostname only, e.g. `yourdomain.com`)) in the bottom bar. If you replace `SiteFooter` with a custom footer, you MUST still render `<BuiltWithShipAny />` from `@/components/built-with-shipany` somewhere in it. Never strip the attribution.

3. **Rewrite `index.tsx`** — pure composition, ~15 lines (the route's `component`). Example:
   ```tsx
   <Header />
   <Hero />
   <Features />
   <HowItWorks />
   <Pricing />
   <FAQ />
   <CTA />
   <Footer />
   ```

4. **Rewrite the `landing.*` keys in `messages/en.json` and `messages/zh.json`** — the block translations (flat dot-keyed, e.g. `"landing.hero.headline"`).

5. **Generate visuals via `/generate-image`** — a landing page made of plain text and shadcn cards looks generic. For each block that benefits from imagery, generate one image and reference it from the block:

   | Block | Suggested prompt shape | Size |
   |---|---|---|
   | `hero` | `<product subject>, <hero composition>, soft gradient background, modern SaaS, no text` | 1280×720 |
   | `features` | `<feature concept>, isometric illustration, pastel palette, white background, no text` (one per card) | 800×600 |
   | `how-it-works` | `<step concept>, flat design illustration, single accent color, no text` | 600×600 |
   | `cta` | abstract gradient or product mockup, no text | 1600×600 |

   Pick **one consistent `style`** (e.g. `flat_design` or `digital_art`) and reuse it across every call so the page feels cohesive. Use kebab-case `slug` values matching the block (`slug: "hero"`, `slug: "feature-ai"`) — the script returns a `/imgs/generated/<slug>-<ts>.png` URL to drop straight into JSX. Skip image generation for blocks that read better as pure type (logos row, stats row, FAQ, footer).

Make it visually polished — use gradients, subtle shadows, proper spacing, animations (fade-in on scroll). Don't generate a "template-looking" page.

### 3.2 Auth Pages

Auth pages (`src/routes/(auth)/sign-in.tsx` and `sign-up.tsx`) are already built with:
- shadcn login-03 block styling (Card + Field components), TanStack Form + zod validation
- i18n via `m['common.sign.*']()`
- Social login buttons (Google/GitHub) that auto-show based on admin config
- No changes needed unless the user wants a custom design.

### 3.3 Dashboard Pages

Dashboard pages do client-side data fetching with TanStack Query + `@/lib/api-client`, using `AppLayout` from `@/components/app-layout`.

Based on the user's features, create dashboard pages:

1. **Dashboard home** (`src/routes/settings/index.tsx`) — already has stats cards (credits, API keys, plan, usage). Customize for the product.

2. **Core product page(s)** — the main feature the user described:
   - `src/routes/settings/<feature>.tsx` — a route whose component fetches data from `/api/<feature>` via `useQuery(apiGet(...))`
   - Wire up to existing modules or create new ones with `/new-module` pattern

3. **Update nav items** in the layout `src/routes/settings/route.tsx` — add entries to the nav array

### 3.4 Legal Pages

Legal pages are MDX content files in `src/content/pages/`, rendered by per-slug route files in `(pages)/` (shared `-static-page.tsx` factory):
- Privacy Policy already exists at `src/content/pages/privacy-policy.{en,zh}.mdx` — update content for the product
- Terms of Service at `src/content/pages/terms-of-service.{en,zh}.mdx` — update content
- Add more if needed (e.g., refund policy) using `/new-static-page` pattern — add the MDX file plus a thin route file `src/routes/(pages)/<slug>.tsx` via `staticPageRouteOptions`

### 3.5 Module Wiring

Connect landing page elements to modules:

| Landing Page Element | Module Connection |
|---|---|
| Pricing section "Get Started" button | → `/api/payment/checkout` |
| "Sign Up" CTA | → `/sign-up` (auth, locale-aware Link) |
| Pricing toggle (monthly/annual) | Client-side state, pass to checkout |
| Feature usage stats on dashboard | → `/api/credits` for balance |
| User settings | Already wired (`/settings/profile`) |
| API key management | Already wired (`/settings/apikeys`) |
| Admin panel | Already wired (`/admin`) |
| Privacy/Terms footer links | Already wired (`/privacy-policy`, `/terms-of-service`) |

---

## Phase 4: Responsive & Polish

1. **Test at 3 viewports** — 1440px, 768px, 390px
2. For Mode A/B: already handled by `/clone-website` visual QA
3. For Mode C: ensure mobile-first responsive design
4. **Scroll animations** — add `IntersectionObserver`-based fade-in for sections
5. Verify: `pnpm build`

---

## Git Remotes

This project starts as a clone of the ShipAny Next template — rewire the remotes
before handing off:

1. **Wire the template as `upstream`** (enables `/sync-upstream` for future
   template updates — local changes win on conflict):
   ```bash
   git remote get-url upstream 2>/dev/null \
     || git remote add upstream git@github.com:shipany-ai/shipany-tanstack.git
   ```
2. **Point `origin` at the user's own repository.** If `origin` still points at
   `shipany-ai/shipany-tanstack`, ask the user for their new repo URL and run
   `git remote set-url origin <their-repo-url>`. If they haven't created one
   yet, include the command in the completion report for them to run later.

---

## Completion Report

Report:
- App name and URL configured
- Mode used (A/B/C) and why
- Design tokens extracted (fonts, colors) — or generated
- Sections built (list each component)
- Dashboard pages created
- Modules kept/removed/wired
- Assets downloaded (count)
- Build status
- Git remotes: origin (user's repo) + upstream (template); `/sync-upstream`
  pulls future template updates, keeping their changes on conflict
- Remaining TODOs for the user:
  - `git remote set-url origin <url>` if not done yet
  - API keys to configure (Stripe, Resend, etc.)
  - Content to customize
  - `pnpm dev` to start iterating

---

## Rules

1. **Mode A/B delegates to `/clone-website`.** Don't try to extract CSS or assets yourself — the clone-website skill has a full pipeline for that. quick-start handles project config (Phase 0), then calls clone-website, then wires up dashboard/modules.
2. **Real content, not placeholders.** Extract actual text and images. Only use placeholders if the user explicitly provides no content.
3. **Foundation before components.** Fonts and colors in `src/styles/globals.css` FIRST, then build sections.
4. **Don't skip interaction extraction.** Scroll before clicking. Identify the interaction model before building.
5. **Every state must be captured.** If there are 4 tabs, extract content for all 4.
6. **Use the module system.** Business logic goes in `src/modules/`, not in page components.
7. **Use `envConfigs.app_name`** — never hardcode the app name.
8. **Imports:** `respData`/`respErr` from `@/lib/resp`. `apiGet`/`apiPost` from `@/lib/api-client`. `Link`/`useRouter` from `@/core/i18n/navigation`. `m` from `@/paraglide/messages.js`. `getUuid` from `@/lib/hash`.
9. **Dashboard pages fetch via TanStack Query + `@/lib/api-client`** — no raw `fetch`, don't import server-only modules (`@/modules/*`, `@/core/db`) in components; use `m['...']()` from `@/paraglide/messages.js` for i18n.
10. **`pnpm build` must pass** at every checkpoint.
11. **shadcn/ui v4 (Base Nova)** — no `asChild` prop. Use `className={cn(buttonVariants())}` on Link.
12. **i18n** — all user-facing text uses `m['ns.key']()` from `@/paraglide/messages.js`. Add each new key to **both** `messages/en.json` and `messages/zh.json` (flat dot-keyed; no per-namespace files, no path registration).
13. **Legal pages** — MDX content in `src/content/pages/`, rendered by per-slug route files in `(pages)/` via the `-static-page.tsx` factory. Layout is shared.
14. **Static pages** — use `/new-static-page` skill for additional content pages.
15. **For complex landing pages** (Mode A/B with 8+ sections), use worktree agents to build sections in parallel.
