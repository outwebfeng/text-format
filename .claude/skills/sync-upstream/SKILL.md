---
name: sync-upstream
description: Port the latest ShipAny Next template changes from the upstream repo (git@github.com:shipany-ai/shipany-next, main branch) into this TanStack Start repo, adapting framework-coupled code (next-intl→paraglide, app router→file routes) along the way. Use when the user asks to "update from upstream", "sync the template", "拉取上游更新", "更新模板", or wants the newest ShipAny features in shipany-tanstack.
---

# Sync Upstream (shipany-tanstack ← shipany-next)

Port the latest features from `shipany-ai/shipany-next` (the Next.js edition,
`main` branch) into this TanStack Start repo. **This is a port-based sync, not a
git merge** — the framework layer was replaced wholesale (Next.js → TanStack
Start, next-intl → paraglide), so upstream commits are re-applied selectively
and adapted. This repo has zero merge commits by design; keep it that way.

Topology note: shipany-next is the hub. shipany-vinext syncs from it too, but
its Vite/CF layer (the `vinext` CLI) is Next-specific — nothing in vinext is a
source for this repo. Workers fixes that first land in vinext get re-implemented
in shipany-next, then arrive here through this skill.

## Layer map (decides what to do with each upstream change)

| Upstream path | Action |
|---|---|
| `src/modules/`, `src/lib/`, `src/core/{payment,email,storage,ai,auth(server logic)}` | **Port near-verbatim** — shared business layer, same paths here |
| `src/config/` (schema templates, locale message JSON) | **Port**; locale JSON keys feed paraglide instead of next-intl — keep key parity |
| `src/core/db/` | **Port logic, keep local wiring** — `driver-stub.ts`, `cloudflare:workers` imports, and vite.config driver-stub list are this repo's adaptations |
| `src/blocks/`, `src/components/` | **Port + adapt imports** (see adaptation table) |
| `src/app/**` (pages, layouts, API routes) | **Re-implement** in `src/routes/` — no 1:1 file mapping |
| `src/core/i18n/` | **Skip** — this repo's paraglide implementation keeps the same import surface (`@/core/i18n/navigation`); only port new exported helpers by re-implementing |
| `next.config.ts`, middleware, Next-only deps | **Skip** |
| `AGENTS.md`, `README.md`, skills | **Skip**; port new sections manually if relevant |

## Adaptation table (Next.js → this repo)

- `next-intl` `getTranslations`/`useTranslations` → paraglide messages (`@/paraglide/messages`)
- `next/link`, `@/core/i18n/navigation` Link → this repo's `@/core/i18n/navigation` (same path, TanStack Router underneath — usually no edit needed)
- `next/headers`, server components → route loaders / server functions
- `src/app/api/<x>/route.ts` → `src/routes/api/<x>.ts` (keep `respData`/`respErr`)
- `next/image` → `<img>` (no Image component here)
- Node-only APIs in request paths → Workers-compatible alternative (cf:build must pass)

## Workflow

### 1. Preflight

```bash
git status --porcelain       # must be empty — ask the user to commit/stash first
git remote get-url upstream 2>/dev/null \
  || git remote add upstream git@github.com:shipany-ai/shipany-next.git
git fetch upstream main
```

If the SSH fetch fails, switch to HTTPS (`https://github.com/shipany-ai/shipany-next.git`) and retry.

### 2. Find the porting baseline

Port commits record the upstream SHA they covered in an `Upstream-sync:` trailer:

```bash
git log --grep '^Upstream-sync:' -1 --format=%B | grep '^Upstream-sync:'
```

- Found → baseline is that SHA.
- Not found (older port commits predate this convention) → bootstrap baseline:
  upstream `8dbc80d` (everything up to and including the Workers auth/db
  per-request fix was ported as of 2026-06-06).

### 3. Review what's incoming

```bash
git log --oneline --reverse <baseline>..upstream/main
```

- Empty → already up to date; report and stop.
- Otherwise show the user the commit list and classify each against the layer
  map before touching anything.

### 4. Port commit-by-commit (in upstream order)

For each incoming commit:

```bash
git show <sha> --stat                  # what it touches
git show <sha> -- <shared paths>       # the actual diff
```

- **Shared-layer files** (modules/lib/core business): try
  `git cherry-pick -n <sha>` then unstage/discard the skipped paths; or apply
  the diff manually if the cherry-pick drags in framework files.
- **Adapt-layer files** (blocks/components): apply, then walk the adaptation
  table over the new code.
- **Re-implement-layer** (`src/app/**`): read the upstream change, write the
  equivalent in `src/routes/`.
- **Schema templates changed?** `schema.ts` is the gitignored working copy — do
  NOT run `db:setup` over it. Port new columns/tables into `schema.ts` manually,
  then `pnpm db:push` (dev) or generate a migration.
- **New env vars?** Check upstream's `.env.example` diff; mirror into this
  repo's `.env.example` and tell the user what to add to `.env.development`
  and (server-side) `wrangler.jsonc`.

Group the ported changes into one or a few commits, message style:
`feat: port upstream shipany-next features (<summary>)`, ending with the trailer:

```
Upstream-sync: <newest upstream sha covered>
```

### 5. Verify

```bash
pnpm install                 # if deps changed
pnpm build                   # Node/Nitro build must pass
pnpm cf:build                # Workers bundle must build too
```

Quick smoke via `pnpm dev`: homepage + one DB-backed API route.

### 6. Report

- Incoming commits (count + notable features) and how each was classified
- Adaptations made (per the adaptation table)
- Anything deliberately skipped and why
- Schema/env follow-ups the user must do
- Build status (both builds)

Do NOT push — let the user review first.

## Rules

1. **Never `git merge upstream/main`** — the framework layers diverged; a merge
   would replay months of Next.js-only history as conflicts.
2. **The layer map decides** what is ported, adapted, re-implemented, or skipped.
3. **Record the `Upstream-sync:` trailer** on every port commit — it is the
   baseline for the next run.
4. **Never touch `schema.ts` automatically** — it's the user's working copy.
5. **Never push commits back to upstream** — shared fixes (including Workers
   fixes discovered here or in shipany-vinext) are re-implemented in
   shipany-next first.
6. **Both `pnpm build` and `pnpm cf:build` must pass** before declaring done.
