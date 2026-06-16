# ShipAny Next — Agent Instructions

This is a **headless SaaS engine** — pre-wired business logic (payments, credits, subscriptions, auth, RBAC) with minimal UI. Users build their product pages on top of it.

## Tech Stack

- **Framework:** TanStack Start (RC, Vite 8 + nitro, React 19, TypeScript strict). File-based routing under `src/routes/`. No React Server Components, no `"use client"` directives — all components are regular React; loaders and server functions handle server-side work.
- **UI:** shadcn/ui v4 (Base Nova style, Tailwind CSS 4, oklch colors)
- **Data fetching:** TanStack Query (react-query) v5 over a typed `@/lib/api-client` — no raw `fetch` in components.
- **Forms:** TanStack Form v1 + zod v4 validation, via the `TextField` helper in `@/components/form-field`.
- **Tables:** `@/components/data-table` (backed by `@tanstack/react-table`, manual pagination).
- **i18n:** Paraglide JS (`@inlang/paraglide-js` 2.x) — compiled message functions, flat dot-keyed JSON.
- **Auth:** better-auth with Drizzle adapter
- **Database:** Drizzle ORM — supports PostgreSQL, MySQL, SQLite, Turso, Cloudflare D1
- **All code is self-contained** — no external packages for business logic. Payment, email, storage, AI, auth, and utils are inlined in `src/core/` and `src/lib/`.

## Commands

- `pnpm dev` — Vite dev server (port 3000)
- `pnpm build` — Vite production build (always verify after changes)
- `pnpm start` — Run the production server (`node .output/server/index.mjs`)
- `pnpm db:setup` — Copy schema template based on `DATABASE_PROVIDER` (run once after clone)
- `pnpm db:push` — Push schema to database (development — direct sync, may lose data)
- `pnpm db:generate` — Generate SQL migration files (production — safe, reviewable)
- `pnpm db:migrate` — Run pending migrations
- `pnpm db:studio` — Drizzle Studio GUI
- `pnpm rbac:init` — Seed roles + permissions (optional `--admin-email=... --admin-password=...` creates an admin user)
- `pnpm rbac:assign` — Assign a role to an existing user
- `pnpm cf:build` — Build with the `cloudflare_module` nitro preset (for Workers)
- `pnpm cf:deploy` — Build + `wrangler deploy` (sources `.env.production` if present)

No lint or test tooling is configured — `pnpm build` is the verification gate.

### First-time setup

```bash
pnpm install              # install dependencies (postinstall auto-copies sqlite schema)
cp .env.example .env.development   # then set DATABASE_PROVIDER, DATABASE_URL, AUTH_SECRET, etc.
pnpm db:setup             # copy the matching schema template (if not sqlite)
pnpm db:push              # create tables
pnpm rbac:init --admin-email=admin@example.com --admin-password=...   # seed RBAC + admin user
pnpm dev                  # start dev server
```

**Env files:** copy `.env.example` → `.env.development` for local dev (gitignored). The `db:*`
loader (`scripts/with-env.ts`) and Vite (`loadEnvFiles()` called from `vite.config.ts`) both
resolve `.env.{NODE_ENV}` before `.env.local`/`.env`, so `.env.development` is the canonical local
file and server-side `process.env` is populated from it. `.env.example` is the committed template —
keep it in sync when adding a new env var to `src/config/index.ts`.

### Schema change workflow

**Development** (fast iteration, ok to lose data):
1. Edit `src/config/db/schema.ts`
2. `pnpm db:push`

**Production** (safe, reversible):
1. Edit `src/config/db/schema.ts`
2. `pnpm db:generate` — creates migration SQL in `/drizzle/`
3. Review the generated SQL — check for destructive operations (DROP COLUMN, etc.)
4. `pnpm db:migrate` — apply to database

**Rule:** Agent should use `db:push` during development. For production deployments, always use `db:generate` + `db:migrate` and ask the user to review the migration before applying.

## Architecture

```
src/
├── core/                        # Infrastructure — every project uses this
│   ├── db/                      # Multi-DB (PostgreSQL, MySQL, SQLite, D1)
│   ├── auth/                    # better-auth (server + client) + RBAC
│   ├── i18n/                    # navigation.tsx (locale-aware Link/router) + dynamic.ts (tDynamic)
│   ├── payment/                 # Payment providers (Stripe, PayPal, Creem)
│   ├── email/                   # Email providers (Resend)
│   ├── storage/                 # Storage providers (S3, R2)
│   └── ai/                     # AI providers (Replicate, Gemini, Fal, Kie)
│
├── modules/                     # Business logic — independently removable
│   ├── payment/service.ts       # Checkout, webhook, order + subscription + credit atomicity
│   ├── subscriptions/service.ts # Subscription lifecycle (CRUD, status transitions)
│   ├── credits/service.ts       # FIFO consumption, expiration, revocation, auto-grant
│   ├── apikeys/service.ts       # API key CRUD + validation
│   ├── rbac/service.ts          # Role/permission checks, wildcard matching
│   ├── config/service.ts        # DB key-value config with 1h cache
│   ├── ai-tasks/service.ts      # AI task tracking with credit deduction/revocation
│   ├── posts/service.ts         # CMS posts CRUD (status, category)
│   ├── taxonomy/service.ts      # CMS categories/taxonomies CRUD
│   ├── tickets/service.ts       # Support tickets + threaded messages
│   ├── invite-codes/service.ts  # Invite code generation, validation, usage tracking
│   └── storage/service.ts       # Image upload (S3/R2 via config, base64 fallback)
│
├── config/
│   ├── index.ts                 # All env vars (app, db, auth, stripe, resend, storage, ai, locale)
│   ├── db/schema.ts             # All table definitions (22 built-in + custom tables)
│   └── locale/index.ts          # localeNames map for the language-switcher UI (locales live in project.inlang)
│
├── messages/{en,zh}.json        # Translation source — flat dot-keyed (e.g. "landing.hero.headline")
├── project.inlang/settings.json # Inlang project config (locales, baseLocale, plugins)
├── paraglide/  (src/paraglide/) # Generated message fns + runtime — gitignored, rebuilt by the vite plugin
│
├── server.ts                    # Nitro entry — wraps the handler in paraglideMiddleware (locale via AsyncLocalStorage)
├── router.tsx                   # getRouter — creates the router instance + rewrite (deLocalizeUrl/localizeUrl)
├── routeTree.gen.ts             # Generated route tree (do not edit by hand)
├── routes/                      # File-based routes (pages + API) — locale-free paths; URL prefix handled by rewrite
│   ├── __root.tsx               # HTML shell: QueryClientProvider, fonts, ThemeProvider, Toaster, Analytics, hreflang, notFound
│   ├── index.tsx                # Homepage
│   ├── pricing.tsx              # e.g. createFileRoute('/pricing') — no locale segment
│   ├── (auth)/                  # Sign-in, sign-up (route group)
│   ├── (pages)/                 # MDX static pages: <slug>.tsx routes + -static-page.tsx factory
│   ├── blog/                    # Public blog pages (backed by the posts module)
│   ├── settings/                # User dashboard pages (route.tsx = layout + nav)
│   ├── admin/                   # Admin panel pages (route.tsx = layout + nav)
│   ├── api/                     # Server routes — REST endpoints
│   └── robots[.]txt.ts, sitemap[.]xml.ts   # SEO endpoints
│
├── content/pages/               # MDX content for static pages (<slug>.{en,zh}.mdx)
├── hooks/                       # Shared react-query hooks (use-public-config, use-user-permissions, use-mobile)
├── blocks/                      # Zero-config page sections: read i18n, wire data into components
│                                # e.g. hero, features, pricing-section, header, footer
├── components/                  # Reusable UI: all content via props, no i18n reads
│   │                            # e.g. site-header, site-footer, pricing, app-sidebar
│   ├── data-table.tsx           # Paginated table (TanStack Table, manual pagination, `loading` prop)
│   ├── form-field.tsx           # TextField — TanStack Form field wired to a labeled Input
│   ├── mdx-components.tsx        # MDX element styling (mdxComponents for MDXProvider)
│   └── ui/                      # shadcn/ui primitives (add via `npx shadcn add`)
├── styles/globals.css           # Theme tokens (oklch CSS variables)
└── lib/                         # Utilities (api-client, query-client, hash, resp, cookie, cache, rate-limit, time, env, cn)
```

Key entry files:
- `vite.config.ts` — plugins: mdx → tailwindcss → **paraglideVitePlugin** (outdir `./src/paraglide`, `strategy: ['url','cookie','baseLocale']`, `urlPatterns` for the `/zh` prefix) → tanstackStart → viteReact → nitro. Calls `loadEnvFiles()` so server-side `process.env` is populated from `.env.{NODE_ENV}`.
- `src/server.ts` — Nitro fetch entry; wraps the request in `paraglideMiddleware` so `getLocale()` resolves server-side.
- `src/router.tsx` — exports `getRouter`; its `rewrite` runs Paraglide `deLocalizeUrl`/`localizeUrl` so routes stay locale-free while URLs gain the `/zh` prefix.
- `src/routes/__root.tsx` — HTML shell (`QueryClientProvider` + `ReactQueryDevtools` in dev, fonts via `@fontsource` + a Google Fonts `<link>` for Noto Serif SC, `ThemeProvider`/`Toaster`/`GoogleOneTap`/`Analytics`, hreflang `<link>`s, `notFoundComponent`).
- `src/routeTree.gen.ts` — generated; never edit by hand.

## Module System

Every module in `src/modules/` is a **standalone service file** that:
- Imports only from `@/core/`, `@/config/`, `@/lib/`, or `drizzle-orm`
- Exports pure functions (no React, no route handlers)
- Can be deleted without breaking other modules

### How modules connect to routes

```
User Request → API Route (src/routes/api/*) → Module Service (src/modules/*) → Database
```

API routes are thin server-route wrappers — they check auth, parse params, call the service, return JSON.

### Module dependency rules

- Modules depend on `core/`, `config/`, `lib/`, and `drizzle-orm` — never on other modules' internals
- `config/service.ts` is the shared exception: any module may read admin-panel settings via `getAllConfigs` (today: `payment/`, `storage/`)
- Business-logic exceptions (the only ones allowed): `payment/service.ts` calls `credits/` and `subscriptions/` because payment success triggers credit granting and subscription creation; `ai-tasks/service.ts` calls `credits/` for consumption/revocation
- All other modules are fully independent.

## Key Patterns

### i18n (translations)

i18n is powered by **Paraglide JS** (`@inlang/paraglide-js`). Messages are compiled into tree-shakeable functions — there is no provider, no `useTranslations` hook, no `useLocale`.

**Message source:** flat dot-keyed JSON in `messages/en.json` and `messages/zh.json` (~675 keys). The key prefix is the old namespace, e.g. `"landing.hero.headline"`, `"common.nav.profile"`, `"admin.users.credits_granted"`. The Inlang project config lives at `project.inlang/settings.json`. The compiler output `src/paraglide/` is **gitignored** and regenerated by the vite plugin on each build/dev.

**Components (any component — they're all regular React):**
```tsx
import { m } from '@/paraglide/messages.js';

export function MyButton() {
  return <button>{m['landing.nav.get_started']()}</button>;
}
```

- With params: `m['common.table.total']({ count })`
- Explicit locale (e.g. in a loader): `m['landing.pricing.title']({}, { locale })`
- Runtime-built keys (tab labels, keyed lists): `tDynamic(key)` from `@/core/i18n/dynamic`. Prefer static `m['ns.key']()` whenever the key is known — dynamic access opts the bundle out of tree-shaking.

**Adding a translation:** add the key to **both** `messages/en.json` and `messages/zh.json`, then call `m['the.key']()`. No per-namespace folders, no `localeMessagesPaths` registration — `src/config/locale/index.ts` now only exports `localeNames` for the switcher UI.

**Locale runtime:** `import { getLocale, setLocale, localizeHref, localizeUrl, locales, baseLocale } from '@/paraglide/runtime.js'`. `getLocale()` works in components and in loaders (server-side via the `paraglideMiddleware` AsyncLocalStorage, client-side after hydration).

**Switching locale:** call `setLocale('zh')` — it writes the `PARAGLIDE_LOCALE` cookie and triggers a full reload. See `src/components/locale-selector.tsx` / `user-menu.tsx`.

**Locale-aware links:** Use `Link` from `@/core/i18n/navigation` instead of a raw anchor for pages. Internal hrefs stay **locale-free** (`href="/pricing"`); the router rewrite localizes the output URL (en = no prefix, zh = `/zh`). `useRouter`/`usePathname` come from the same module.

### Pages & route metadata

Pages are file routes living directly under `src/routes/**` — **there is no `{-$locale}` segment**. URL locale prefixes are handled entirely by the router `rewrite` (`src/router.tsx`) + `paraglideVitePlugin` `urlPatterns` (`vite.config.ts`) + `paraglideMiddleware` (`src/server.ts`). So `createFileRoute` paths have no locale segment:

```tsx
import { createFileRoute } from '@tanstack/react-router';
import { m } from '@/paraglide/messages.js';

function PricingPage() {
  return <h1>{m['landing.pricing.title']()}</h1>;
}

export const Route = createFileRoute('/pricing')({
  component: PricingPage,
});
```

Layouts are `route.tsx` files in a folder that render `<Outlet />`. Route groups `(auth)`, `(pages)` work like Next. Colocated non-route files use a `-` prefix (e.g. `-settings-form.tsx`).

Metadata replaces `generateMetadata` — declare it on the route's `head`. When a title/description needs the active locale, resolve it in the `loader` with `getLocale()` and pass it to the message function (see `src/routes/pricing.tsx` and `(pages)/-static-page.tsx`):
```tsx
export const Route = createFileRoute('/pricing')({
  loader: () => {
    const locale = getLocale();
    return { title: m['landing.pricing.title']({}, { locale }) };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [{ title: loaderData.title }] : [],
  }),
  component: PricingPage,
});
```

`notFound()` and `redirect()` are imported from `@tanstack/react-router`.

### Client data fetching (TanStack Query + api-client)

Components never call `fetch` directly — they use **TanStack Query** over the typed `@/lib/api-client`. `QueryClientProvider` is mounted in `src/routes/__root.tsx` (`src/lib/query-client.ts`: a fresh client per SSR request, a browser singleton).

`@/lib/api-client` unwraps the `respData`/`respErr` envelope (`{ code, message, data }`) and throws `ApiError` on `code !== 0`:
- `apiGet`/`apiPost`/`apiPut`/`apiPatch`/`apiDelete`
- `pageQuery(base, { page, pageSize, search })` — builds the list query string
- `PageResult<T>` = `{ items: T[]; total: number }`

**List query** (paginated, keeps previous page while fetching):
```tsx
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { apiGet, pageQuery, type PageResult } from '@/lib/api-client';

const listQuery = useQuery({
  queryKey: ['admin-users', page, debouncedSearch],
  queryFn: () =>
    apiGet<PageResult<User>>(
      pageQuery('/api/admin/users', { page, pageSize: 10, search: debouncedSearch })
    ),
  placeholderData: keepPreviousData,
});
// listQuery.data?.items, listQuery.data?.total, listQuery.isFetching
```

**Mutation** (invalidate + toast on success):
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiPost } from '@/lib/api-client';
import { toast } from 'sonner';

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: (vars: { userId: string; credits: number }) =>
    apiPost('/api/admin/users/credits', vars),
  onSuccess: () => {
    toast.success(m['admin.users.credits_granted']());
    queryClient.invalidateQueries({ queryKey: ['admin-users'] });
  },
  onError: (e: Error) => toast.error(e.message),
});
```

Shared hooks live in `src/hooks/` — `usePublicConfig()` (`use-public-config.ts`) and `useUserPermissions()` (`use-user-permissions.ts`). Pass `listQuery.isFetching` to `<DataTable loading={...} />`.

### Forms (TanStack Form + zod)

Forms use **TanStack Form** with zod validation and the `TextField` helper from `@/components/form-field`:
```tsx
import { useForm } from '@tanstack/react-form';
import { z } from 'zod';
import { TextField } from '@/components/form-field';

const schema = z.object({ email: z.string().email(), password: z.string().min(1) });

const form = useForm({
  defaultValues: { email: '', password: '' },
  validators: { onSubmit: schema },
  onSubmit: async ({ value }) => { /* ... */ },
});

<form onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}>
  <form.Field name="email">
    {(field) => <TextField field={field} label={m['common.sign.email_title']()} type="email" />}
  </form.Field>
  <form.Subscribe selector={(s) => s.isSubmitting}>
    {(isSubmitting) => <Button type="submit" disabled={isSubmitting}>Submit</Button>}
  </form.Subscribe>
</form>
```
See `src/routes/(auth)/sign-in.tsx` and the admin dialog forms for reference.

### Route loaders & server functions

Server-side work happens in route `loader`s or `createServerFn` — not in components. Components never import server-only modules (`@/modules/*`, `@/core/db`); they fetch from API routes or call server functions.

```tsx
import { getAuth } from '@/core/auth';

// inside a route loader, beforeLoad, or a createServerFn handler
const auth = getAuth();
const session = await auth.api.getSession({ headers: request.headers });
```

Auth on the client uses `useSession` from `@/core/auth/client`.

### API routes (server routes)

Files live under `src/routes/api/**` and serve the same `/api/**` URLs as before:

```ts
import { createFileRoute } from '@tanstack/react-router';
import { respData, respErr } from '@/lib/resp';
import { getAuth } from '@/core/auth';

async function GET({ request }: { request: Request }) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return respErr('Unauthorized');
  // call module service...
  return respData(result);
}

export const Route = createFileRoute('/api/<feature>')({
  server: { handlers: { GET } },
});
```

Dynamic params: `$provider.ts` → `params.provider`. Catch-all: `$.ts`. better-auth mounts at `src/routes/api/auth/$.ts` via `auth.handler(request)`. `respData`/`respErr`/`respPage` are unchanged, from `@/lib/resp`.

### Database queries

```ts
import { db } from '@/core/db';
import { someTable } from '@/config/db/schema';
import { eq } from 'drizzle-orm';

const rows = await db().select().from(someTable).where(eq(someTable.userId, id));
```

### shadcn/ui v4 (Base Nova)

- **No `asChild` prop.** Use `className={cn(buttonVariants())}` on Link instead.
- Add components: `npx shadcn add button card dialog` (`components.json` has `rsc: false`)
- Theme colors in `src/styles/globals.css` as CSS variables (oklch)

### Blocks vs Components

- **`src/blocks/`** — zero-config page sections. Read i18n (`m['...']()` from `@/paraglide/messages.js`), build the content config, and pass it to a component. Drop into pages as `<Hero />`, `<Pricing />`, `<Header />`, `<Footer />` with no props.
- **`src/components/`** — reusable UI. All content arrives via props; no i18n reads inside. Covers shadcn primitives (`components/ui/`), marketing shells (`SiteHeader`, `SiteFooter`), authenticated-app shells (`AppSidebar`, `AppLayout`), and pure primitives like `PricingTable`.
- **Rule:** a file reads translations → block. A file takes all content via props → component.
- **Pattern:** pages consume only blocks. Blocks read i18n and configure components. Components render — they don't know the app's content.
- **Naming:** `site-*` = public marketing chrome (`SiteHeader`, `SiteFooter`). `app-*` = authenticated-app chrome (`AppSidebar`, `AppLayout`). These are separate surfaces — don't merge them.

### Template Philosophy: Blocks Are Disposable, Components Are Durable

This repo ships with a default landing page (`blocks/header`, `hero`, `features`, `pricing`, `footer`) so a fresh clone has something to render. **That content is demo material — it's expected to be rewritten for any real project.**

When starting a new project:
1. **Keep** `src/components/*` and `src/components/ui/*` — they're the durable primitives (`PricingTable`, `SiteHeader`, `SiteFooter`, `AppSidebar`, shadcn UI). These are the chassis.
2. **Rewrite** `src/blocks/*` — delete the demo blocks, write new ones that wire the user's real content and i18n into the primitives. Or compose fresh sections directly.
3. **Rewrite** `src/routes/index.tsx` — it's ~17 lines of pure composition. Recompose from the new blocks.
4. **Rewrite** the `landing.*` keys in `messages/en.json` and `messages/zh.json` — the translations that feed the blocks.

The `/quick-start` and `/clone-website` skills automate this workflow.

The split is not cosmetic — it's **what survives a rebrand**. Primitives survive; block content doesn't.

## Adding a New Feature

1. **Need new DB tables?** Add to `src/config/db/schema.ts` (under the "Custom tables" section), run `pnpm db:push`
2. **Create module service:** `src/modules/<feature>/service.ts` — pure business logic (unchanged)
3. **Create API server route:** `src/routes/api/<feature>.ts` — `createFileRoute(...)` with `server.handlers`, calling the service (unchanged)
4. **Create page:** `src/routes/settings/<feature>.tsx` (or `admin/<feature>.tsx`) — `useQuery` + `@/lib/api-client` to fetch from the API
5. **Add translations:** add `settings.<feature>.*` (or `admin.<feature>.*`) keys to **both** `messages/en.json` and `messages/zh.json`
6. **Add nav entry:** Update the nav array in the layout `src/routes/settings/route.tsx` (or `admin/route.tsx`)
7. **Need a static page?** Add an MDX file at `src/content/pages/<slug>.{en,zh}.mdx` plus a thin route file `src/routes/(pages)/<slug>.tsx` using `staticPageRouteOptions('<slug>')` from `(pages)/-static-page.tsx`

Or use skills: `/new-module`, `/new-page`, `/new-static-page`

## Agent Skills

Project skills live in `.claude/skills/` (canonical) with cross-agent symlinks
at `.agents/skills`, `.codex/skills`, and `.cursor/skills` — all four resolve to
the same files (SKILL.md open standard, agentskills.io). If your agent runtime
doesn't auto-discover skills, read `.claude/skills/<name>/SKILL.md` and follow
it when the task matches:

| Skill | When to use |
|-------|-------------|
| `quick-start` | Build a complete SaaS project from a brief/reference URL |
| `clone-website` | Clone/rebuild an existing website pixel-perfect |
| `new-module` | New backend service + API following the module pattern |
| `new-page` | New dashboard page with API wiring + nav entry |
| `new-static-page` | Static MDX page (legal, about, etc.) |
| `generate-image` | AI-generate a decorative image for a page/block |
| `security-scan` | **Before every git commit** — secrets, vulns, ignore gaps |
| `sync-upstream` | Pull latest template updates; local changes win on conflict |
| `deploy-cloudflare` | Deploy to Cloudflare Workers (D1 or Postgres+Hyperdrive + secrets + schema, idempotent) |

**Database backends on Cloudflare Workers** (chosen by `wrangler.jsonc` `vars.DATABASE_PROVIDER`):
- **D1** (`d1`, default) — zero external infra; binding `DB` in `d1_databases`
- **Postgres via Hyperdrive** (`postgresql`) — binding `HYPERDRIVE` in `hyperdrive`; `src/core/db/postgres.ts` reads `connectionString` from the Workers env stashed on `globalThis.__CF_ENV__` by `src/server.ts`. `vite.config.ts` reads `vars.DATABASE_PROVIDER` at build time and keeps the matching driver in the Worker bundle (the others are stubbed). Schema/RBAC/admin scripts talk to the real Postgres directly (`DATABASE_URL`), never through Hyperdrive. Setup: `npx wrangler hyperdrive create <name> --connection-string="postgres://..."`, then fill the binding in `wrangler.jsonc` (template comments show the exact shape).

## Inlined Modules (src/core/ and src/lib/)

All functionality is self-contained — no external packages needed.

| Location | Key Exports |
|----------|-------------|
| `@/core/payment` | `PaymentManager`, `StripeProvider`, `PayPalProvider`, `CreemProvider` |
| `@/core/email` | `EmailManager`, `ResendProvider` |
| `@/core/storage` | `StorageManager`, `S3Provider`, `R2Provider` |
| `@/core/ai` | `AIManager`, `ReplicateProvider`, `GeminiProvider`, `FalProvider`, `KieProvider` |
| `@/core/auth/rbac` | `matchPermission`, `matchAnyPermission`, `ROLES` |
| `@/core/db` | `db()` singleton, `createDb` (multi-dialect) |
| `@/lib/hash` | `getUuid`, `getSnowId`, `getUniSeq`, `getNonceStr`, `md5` |
| `@/lib/resp` | `respData`, `respOk`, `respErr` |
| `@/lib/cookie` | `getCookie`, `setCookie`, `getCookieFromCtx` |
| `@/lib/rate-limit` | `enforceMinIntervalRateLimit` |
| `@/lib/cache` | `cacheGet`, `cacheSet`, `cacheRemove` |
| `@/lib/time` | `getTimestamp`, `getIsoTimestr` |
| `@/lib/api-client` | `apiGet`, `apiPost`, `apiPut`, `apiPatch`, `apiDelete`, `pageQuery`, `PageResult`, `ApiError` |
| `@/lib/query-client` | `getQueryClient`, `makeQueryClient` |
| `@/paraglide/messages.js` | `m` — compiled message functions (`m['ns.key']()`) |
| `@/paraglide/runtime.js` | `getLocale`, `setLocale`, `localizeHref`, `localizeUrl`, `locales`, `baseLocale` |
| `@/core/i18n/navigation` | `Link`, `useRouter`, `usePathname` (locale-aware) |
| `@/core/i18n/dynamic` | `tDynamic` (runtime-built message keys) |

## Database Schema (22 tables)

**`schema.ts` is gitignored** — it's the user's working copy generated from a template.

Three dialect templates are committed to git:
- `src/config/db/schema.sqlite.ts` — SQLite (default)
- `src/config/db/schema.postgres.ts` — PostgreSQL
- `src/config/db/schema.mysql.ts` — MySQL

**Setup:** Copy the matching template into `schema.ts` (`pnpm db:setup` does this), set `DATABASE_PROVIDER` in `.env.development`, run `pnpm db:push`. `drizzle.config.ts` reads the dialect automatically.

Each template exports **strong types** for all tables (`User`, `NewUser`, `Order`, `NewOrder`, etc.) via `$inferSelect` / `$inferInsert`. Use these in service functions instead of `any`.

**Auth:** user, session, account, verification
**Business:** order, subscription, credit, apikey
**RBAC:** role, permission, rolePermission, userRole
**Content:** post, taxonomy, config
**AI:** aiTask, chat, chatMessage
**Support:** ticket, ticketMessage
**Growth:** inviteCode, userInvite

## Environment Variables

Public, client-visible vars use the `VITE_` prefix (read via `import.meta.env` on the client). Secrets stay on `process.env` (server-only). `src/config/index.ts` exposes both isomorphically via `envConfigs`.

```env
# Required (public — VITE_ prefix, client-visible)
VITE_APP_URL=http://localhost:3000
VITE_APP_NAME=My App
DATABASE_PROVIDER=sqlite
DATABASE_URL=file:data/local.db
AUTH_SECRET=generate-with-openssl-rand-base64-32

# App (optional, public)
VITE_APP_DESCRIPTION=
VITE_APP_LOGO=
VITE_DEFAULT_LOCALE=en

# Recommended: encrypt admin-settings secrets (AES-256-GCM) in the config table.
# Unset = plaintext storage. Once set, keep it stable — rotating or removing it
# orphans already-encrypted values (they fall back to env values).
CONFIG_ENCRYPTION_KEY=
```

**Provider credentials live in the admin panel, not env.** Payments (Stripe/
Creem/PayPal/Alipay/WeChat), OAuth (Google/GitHub/One-Tap), email (Resend),
storage (R2), AI (Replicate/Gemini/Fal), and analytics are configured at
`/admin/settings` and stored in the `config` table (encrypted when
`CONFIG_ENCRYPTION_KEY` is set). Resolution is `{ ...envConfigs, ...dbConfigs }`
— same-named env vars still work as fallbacks, but database values win.
Keep `.env.example` minimal; don't add provider keys to it.

## Critical Rules

1. **Don't import between modules** (except the documented payment→credits/subscriptions dependency)
2. **Don't import server-only modules (`@/modules/*`, `@/core/db`) from components** — use API routes, route loaders, or `createServerFn` instead
3. **Don't edit `components/ui/*` manually** — use `npx shadcn add`
4. **Don't hardcode app name** — use `envConfigs.app_name` from `@/config`
5. **Use `@/lib/api-client` + TanStack Query for client data fetching** — no raw `fetch` in components
6. **Translations live in `messages/{en,zh}.json`** with flat dot keys; access via `m['ns.key']()` (add the key to both locale files)
7. **Always verify `pnpm build` passes** after making changes
8. **Return `respData`/`respErr`** from API routes
9. **Run the `security-scan` skill before every `git commit`** — it checks for leaked secrets, injection/XSS/logic vulnerabilities in the diff, and `.gitignore`/`.dockerignore` gaps. HIGH findings block the commit.
