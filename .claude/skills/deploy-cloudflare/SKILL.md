---
name: deploy-cloudflare
description: "Deploy this project to Cloudflare Workers (nitro cloudflare_module preset + wrangler). Auto-handles D1 setup, secrets, schema push, and redeploy. Use when the user says 'deploy to cloudflare', 'ship to workers', 'push to cf', '部署到 cloudflare', or asks how to publish to Workers."
argument-hint: "[--admin-email=X --admin-password=Y | --admin=X | --domain=X | --rotate-secrets | --force-rbac]"
user-invocable: true
---

# Deploy to Cloudflare Workers — $ARGUMENTS

You are driving a Cloudflare Workers deployment of this TanStack Start project. The build pipeline is `NITRO_PRESET=cloudflare_module vite build` (nitro merges the root `wrangler.jsonc` into the generated `.output/server/wrangler.json`, plus a `.wrangler/deploy/config.json` redirect), then `wrangler deploy`. Both are wrapped in `pnpm run cf:deploy`.

## Database backend: D1 (default) or Postgres via Hyperdrive

Two supported backends on Workers, chosen by `wrangler.jsonc` `vars.DATABASE_PROVIDER`:

| | **D1** (`d1`) | **Postgres + Hyperdrive** (`postgresql`) |
|---|---|---|
| When | Default. Zero external infra. | User already has a Postgres (Neon/Supabase/RDS/self-hosted) or needs PG features |
| Binding | `d1_databases` → `DB` | `hyperdrive` → `HYPERDRIVE` (`src/core/db/postgres.ts` reads `connectionString` from the stashed Workers env at runtime) |
| Schema push | `wrangler d1 migrations apply --remote` | `pnpm db:migrate` directly against the real PG (NOT through Hyperdrive) |
| RBAC seed / admin | local-sqlite dump dance (Phase 4.5 / 9) | `pnpm rbac:init` directly against PG — no dance needed |
| Bundle | postgres driver stubbed out | postgres driver kept (vite.config.ts reads `vars.DATABASE_PROVIDER`) |

**Backend selection:** if `wrangler.jsonc` already has a populated `hyperdrive` or `d1_databases` binding, keep that backend (incremental run). On first-time setup, default to D1 unless the user mentioned Postgres/Hyperdrive/Neon/Supabase or `$ARGUMENTS` contains `--db=postgres` — then use the **Phase 3-PG** variant below.

If the chosen backend is Postgres: Phase 2's D1 checks, Phase 4 (D1 migrations), Phase 4.5 (local-sqlite RBAC dance), and Phase 9's D1 SQL steps are REPLACED by their direct-PG equivalents in Phase 3-PG — drizzle and `init-rbac.ts`/`assign-role.ts` talk to PG natively with `DATABASE_PROVIDER=postgresql DATABASE_URL=<direct PG url>`.

## Philosophy: minimal interruptions, fully idempotent

The skill is designed to be run **any number of times**. A repeat invocation auto-detects what's already done and only redoes what's needed (e.g. a fresh build + deploy with the latest code). User interaction is capped at:

1. **Cloudflare authorization** — skipped if `wrangler whoami` already shows authenticated.
2. **Final deploy confirmation** — always asked; deploy is irreversible.
3. **(Optional) Admin credentials** — only asked on first deploy when no `super_admin` exists yet. User picks one of: `email password` (agent creates the account directly so user can log in immediately), `email` (promote an existing user — requires prior sign-up via web), or `skip` (assign later with `/deploy-cloudflare --admin-email=X --admin-password=Y` or `--admin=X`).

Every other step (D1 create, schema migrations, RBAC seed, secrets, URL fixup) is automatic AND idempotent. So **"再发布一下" / "ship again"** = run `/deploy-cloudflare` again.

### Idempotency cheat sheet

| Phase | Skip when | Re-run action |
|---|---|---|
| 0.2 Login | `wrangler whoami` is authed | No-op |
| 3 First-time setup | D1 (name from `wrangler.jsonc` `database_name`) exists AND `database_id` is a real UUID AND Worker deployed before | Skip the entire Phase 3 block |
| 4 Schema migrations | local `drizzle/meta/_journal.json` entry count == remote applied count | Skip apply (wrangler is idempotent, skip is for speed) |
| 4.5 RBAC seed | `SELECT COUNT(*) FROM role` ≥ 1 on remote D1 | Skip local-sqlite dance entirely |
| 5 Secrets | `wrangler secret list` already contains the name | Skip per-secret upload (`--rotate-secrets` forces) |
| 5.5 Production URL | `.env.production` `VITE_APP_URL` AND `wrangler.jsonc` `vars.VITE_APP_URL` are both consistent with routes (workers.dev + no routes, OR custom domain matching a routes pattern) | Skip the prompt (`--domain=X` overrides) |
| 6 Deploy | (always runs) | Fresh `pnpm run cf:deploy` with the latest code/env |
| 7 URL fix | Both `.env.production` AND `wrangler.jsonc` vars already match the deployed URL | Skip redeploy |
| 9 Admin | `SELECT COUNT(*) FROM user_role ur JOIN role r ON r.id=ur.role_id WHERE r.name='super_admin'` ≥ 1 | Don't prompt (explicit `--admin*` flags still run) |

Narrate auto-picked resource names BEFORE acting so the user can interject with "rename to X".

## Hard rules (do not violate)

1. **Never auto-run the final deploy.** The production push is irreversible — always confirm. The Phase 7 redeploy to fix a baked URL is part of the same confirmed deploy event and needs no re-confirmation.
2. **Never echo secret values.** Generate with `openssl`; pipe values from env files directly into `wrangler secret put` (`grep ... | cut -d= -f2- | wrangler ...`). Never `cat` an env file into the conversation.
3. **Always run the deploy through `pnpm run cf:deploy`.** It sources `.env.production` into the shell BEFORE the build. This matters because `src/lib/env.ts` `loadEnvFiles()` resolves `.env.local > .env.{NODE_ENV} > .env` and never overwrites existing `process.env` — shell-sourced prod values win over any localhost URL lingering in `.env.local`/`.env.development`, so the right `VITE_APP_URL` gets baked into the bundle (better-auth `trustedOrigins`, payment callbacks, canonicals).
4. **Admin password handling (Phase 9.A):** the user types the password into chat once; pass it to `init-rbac.ts --admin-password=...` and never echo it back — not in narration, commits, or env files. It's stored hashed (better-auth/crypto). Remind them to rotate it after first login.
5. **Don't hand-edit `.output/server/wrangler.json`** — it's generated. All config belongs in the root `wrangler.jsonc`, which nitro merges at build time.

## Phase 0: Preflight

### 0.1 Tool & config check (parallel)

```bash
node -v
pnpm -v
npx wrangler --version
test -f wrangler.jsonc || cp wrangler.example.jsonc wrangler.jsonc   # materialize working copy (gitignored)
grep -q '"cf:deploy"' package.json && echo deploy script OK
git status --short
```

`wrangler.example.jsonc` is the committed template; `wrangler.jsonc` is the gitignored working copy holding the real D1 `database_id` and production URL (same pattern as `schema.ts`). If the example or the `cf:deploy` script is missing, this clone predates the Cloudflare wiring — pull the latest template (`/sync-upstream`).

### 0.2 Wrangler login (Interruption #1)

**Skip if:** `npx wrangler whoami` already shows authenticated — capture account name + ID and move on.

```bash
npx wrangler whoami
```

If not authenticated, suggest the user run it themselves so the OAuth callback lands in their session:

> 在输入框输入 `! npx wrangler login` 走浏览器授权,完成后告诉我。

(Or run `npx wrangler login` with a 300000 ms timeout if the user prefers — the CLI exits once they click Authorize.) On success, re-run `whoami` and capture the account ID.

### 0.3 Local build sanity check

```bash
pnpm build
```

If it fails, fix the build error before touching deployment. Narrate "build OK" and move on.

## Phase 1: Compatibility scan (informational, no prompts)

```bash
grep -n "globalThis" src/core/db/d1.ts | head -3      # D1 binding wired (not the old throw-stub)?
grep -n "cloudflare" src/server.ts | head -3          # server entry stashes the Workers env?
grep -n "migrations_dir" wrangler.jsonc               # wrangler can apply drizzle/ migrations?
```

All three ship with the template. If `d1.ts` still contains only `throw new Error('D1 database not supported...')`, wire it: read the binding from `globalThis.__CF_ENV__ ?? globalThis.__env__` (the server entry `src/server.ts` stashes `env` from a runtime-only dynamic import of `cloudflare:workers` — specifier kept non-literal so bundlers leave it alone; no static import, no vite alias/stub needed).

Note for the report: the no-storage image-upload fallback writes to local disk and won't work on Workers — production should configure R2 in admin → Settings → Storage.

## Phase 2: First-time vs incremental detection

Run all checks in parallel; every later phase reads these results.

**Postgres backend** (`wrangler.jsonc` has a `hyperdrive` binding): skip the D1 commands below (`d1 list` / `d1 migrations list` / `d1 execute`) — instead check the Hyperdrive id is real (`npx wrangler hyperdrive list`), and probe RBAC/admin via `pnpm rbac:init` later (it's a no-op when seeded).

```bash
WORKER=$(node -e "const fs=require('fs');const s=fs.readFileSync('wrangler.jsonc','utf8').replace(/\/\/.*$/gm,'');console.log(JSON.parse(s).name)")
DB_NAME=$(node -e "const fs=require('fs');const s=fs.readFileSync('wrangler.jsonc','utf8').replace(/\/\/.*$/gm,'');console.log(JSON.parse(s).d1_databases[0].database_name)")

npx wrangler d1 list 2>&1 | grep -w "$DB_NAME"                                   # D1 created?
grep -q 'REPLACE_WITH_OUTPUT_OF_WRANGLER_D1_CREATE' wrangler.jsonc && echo "database_id: placeholder"  # real UUID?
npx wrangler deployments list --name "$WORKER" 2>&1 | head -5                    # ever deployed?

LOCAL_MIGRATIONS=$(node -e "console.log(require('./drizzle/meta/_journal.json').entries.length)" 2>/dev/null || echo 0)
REMOTE_MIGRATIONS=$(npx wrangler d1 migrations list "$DB_NAME" --remote 2>&1 | grep -cE '[0-9]{4}_' || echo 0)

ROLE_COUNT=$(npx wrangler d1 execute "$DB_NAME" --remote --command="SELECT COUNT(*) AS c FROM role" --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s)[0].results[0].c)}catch{console.log(0)}})")

SECRETS_SET=$(npx wrangler secret list 2>&1 || echo "")

ADMIN_COUNT=$(npx wrangler d1 execute "$DB_NAME" --remote --command="SELECT COUNT(*) AS c FROM user_role ur JOIN role r ON r.id=ur.role_id WHERE r.name='super_admin'" --json 2>/dev/null | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{try{console.log(JSON.parse(s)[0].results[0].c)}catch{console.log(0)}})")

test -f .env.production && grep "^VITE_APP_URL=" .env.production | cut -d= -f2-
```

Narrate the detection table (one line each: D1 / wrangler.jsonc / prior deploy / migrations N÷M / RBAC / secrets names / admin / run mode), then branch:

- **First-time** if ANY core resource missing (no D1, placeholder `database_id`, or no prior deployment) → Phase 3.
- **Incremental** otherwise → Phase 4 (to pick up any new migrations); later phases auto-skip.

## Phase 3: First-time setup — announce, pause once, then auto-execute

**Skip entirely if:** Phase 2 found D1 + real database_id + prior deployment. Narrate and jump to Phase 4.

### 3.1 Show the plan and pause for a single OK

> First-time Cloudflare setup. I'll do all of this in one shot — interject only if you want different names.
>
> **Resources to create:** Worker `<name from wrangler.jsonc>`, D1 `<database_name>`
> **Then:** push schema → seed RBAC → set secrets (AUTH_SECRET, CONFIG_ENCRYPTION_KEY, never shown) → ask for production URL → deploy (with confirmation) → fix baked URL if needed → optional admin setup.
>
> Reply `ok` or `rename worker=X db=Y`.

### 3.2 Create D1 database (auto)

```bash
npx wrangler d1 create "$DB_NAME"
```

Capture the `database_id` UUID from stdout. Narrate: "D1 created: `<name>` (id: `<id>`)".

### 3.3 Populate `wrangler.jsonc` (auto)

Edit the working copy `wrangler.jsonc` (materialized from `wrangler.example.jsonc` in Phase 0.1): replace `REPLACE_WITH_OUTPUT_OF_WRANGLER_D1_CREATE` with the real UUID (and apply any renames). Confirm `vars.DATABASE_PROVIDER` is `"d1"` and `migrations_dir` is `"drizzle"`. Never commit `wrangler.jsonc` — it's gitignored on purpose.

## Phase 3-PG: First-time setup — Postgres + Hyperdrive variant

Use INSTEAD of Phase 3 when the backend decision (see "Database backend" above) is Postgres. Also REPLACES Phases 4 and 4.5 — schema and RBAC go directly to PG. Phase 9's admin steps run via `pnpm rbac:init` / `rbac:assign` against PG (no D1 SQL, no local-sqlite dance).

### 1. Get the connection string

Ask the user for their Postgres connection string if it's not already in `.env.development`/`.env.local` (`DATABASE_URL=postgres://...`). Requirements: publicly reachable from Cloudflare (or via Hyperdrive-supported access methods), TLS recommended. Treat the URL as a secret — never echo it back (it embeds the password).

### 2. Create the Hyperdrive config (auto)

```bash
# pipe, don't paste into argv history where avoidable; name defaults to the worker name
npx wrangler hyperdrive create <worker-name> --connection-string="$DATABASE_URL"
```

Capture the `id` from stdout. Narrate: "Hyperdrive created: `<name>` (id: `<id>`)". If it errors with "could not connect", the PG isn't reachable from Cloudflare — surface the error and stop (common causes: IP allowlist, no TLS, non-5432 port blocked).

### 3. Materialize `wrangler.jsonc` (auto)

```bash
test -f wrangler.jsonc || cp wrangler.example.jsonc wrangler.jsonc
```

Edit `wrangler.jsonc`:
- `name` ← chosen worker name
- `vars.DATABASE_PROVIDER` ← `"postgresql"` (this also tells vite.config.ts to keep the postgres driver in the Worker bundle)
- REMOVE the `d1_databases` block
- ADD: `"hyperdrive": [{ "binding": "HYPERDRIVE", "id": "<id from step 2>" }]`

Do NOT put `DATABASE_URL` in `vars` (vars are public). The runtime reads the connection string from the Hyperdrive binding; `DATABASE_URL` is only needed as a **secret** fallback if the user insists on running without Hyperdrive (discouraged): `grep "^DATABASE_URL=" .env.development | cut -d= -f2- | npx wrangler secret put DATABASE_URL`.

### 4. Schema + RBAC directly against PG (auto, replaces Phases 4 & 4.5)

`src/config/db/schema.ts` must be the postgres dialect. If the working copy is still sqlite/mysql (check the imports at the top), run `DATABASE_PROVIDER=postgresql pnpm db:setup` — but WARN first if `schema.ts` has custom tables beyond the template (they'd be overwritten; port them over after the copy).

```bash
# Schema: drizzle talks to the real PG directly (NOT through Hyperdrive)
DATABASE_PROVIDER=postgresql DATABASE_URL="$PG_URL" pnpm db:generate
DATABASE_PROVIDER=postgresql DATABASE_URL="$PG_URL" pnpm db:migrate

# RBAC seed (idempotent — init-rbac has its own existence checks)
DATABASE_PROVIDER=postgresql DATABASE_URL="$PG_URL" pnpm rbac:init
```

If `drizzle/` already holds migrations for another dialect (journal from a previous sqlite/d1 setup), move it aside (`mv drizzle drizzle.d1.bak`) and generate fresh.

Incremental runs: just re-run both — drizzle skips applied migrations, `rbac:init` is a no-op when seeded.

### 5. Admin (replaces Phase 9's D1 SQL)

```bash
# create-account mode
DATABASE_PROVIDER=postgresql DATABASE_URL="$PG_URL" pnpm rbac:init --admin-email="$EMAIL" --admin-password="$PASS"
# promote-existing mode
DATABASE_PROVIDER=postgresql DATABASE_URL="$PG_URL" pnpm rbac:assign "$EMAIL" super_admin
```

Then continue with Phase 5 (secrets), 5.5 (URL), 6 (deploy) unchanged.

## Phase 4: Schema push to D1 (auto, incremental)

**Skip entirely if the backend is Postgres** — Phase 3-PG step 4 already handled schema.

**Skip if:** `LOCAL_MIGRATIONS == REMOTE_MIGRATIONS` (and > 0). Narrate "Schema up to date (N migrations), skipping".

```bash
pnpm db:generate     # no-op if schema unchanged; TTY prompts → ask user to run it in their terminal
echo y | npx wrangler d1 migrations apply "$DB_NAME" --remote
```

Narrate: "Applied N migrations to D1 (X SQL commands)."

## Phase 4.5: Seed default RBAC roles + permissions (auto, no prompt)

**Skip entirely if the backend is Postgres** — Phase 3-PG step 4 already seeded RBAC.

**Skip if:** `ROLE_COUNT > 0`. Narrate "RBAC already seeded (N roles), skipping". Force with `--force-rbac`.

`scripts/init-rbac.ts` writes via libsql/postgres/mysql clients — it can't reach remote D1. Workaround: run it against a wrangler-managed **local** D1 (plain SQLite under `.wrangler/state/`), dump the seeded rows, apply remotely:

```bash
npx wrangler d1 migrations apply "$DB_NAME" --local
LOCAL_D1=$(find .wrangler/state -name "*.sqlite" -path "*d1*" | head -1)
DATABASE_PROVIDER=sqlite DATABASE_URL="file:$LOCAL_D1" pnpm rbac:init

sqlite3 "$LOCAL_D1" ".dump role permission role_permission" \
  | grep "^INSERT INTO" \
  | sed 's/^INSERT INTO/INSERT OR IGNORE INTO/' > /tmp/rbac-seed.sql
npx wrangler d1 execute "$DB_NAME" --remote --file=/tmp/rbac-seed.sql
```

Narrate: "Seeded RBAC: N roles, M permissions." Requires the `sqlite3` CLI (default on macOS; `apt-get install sqlite3` on Debian/Ubuntu).

## Phase 5: Secrets (auto, never expose values)

**Per-secret skip:** if `wrangler secret list` already has the name. `--rotate-secrets` forces re-upload.

### 5.1 AUTH_SECRET

If `.env.development`/`.env.local` has a real value (not containing `dev-secret`/`change-in-production`/`placeholder`), pipe it; otherwise generate:

```bash
openssl rand -base64 32 | npx wrangler secret put AUTH_SECRET
# or: grep "^AUTH_SECRET=" .env.development | cut -d= -f2- | npx wrangler secret put AUTH_SECRET
```

### 5.2 CONFIG_ENCRYPTION_KEY (recommended)

Admin-settings secrets are stored in the D1 `config` table — encrypt them at rest. Same pattern: pipe from env file if present, else `openssl rand -base64 32 | npx wrangler secret put CONFIG_ENCRYPTION_KEY`. **Once set, keep it stable** — rotating orphans already-encrypted values.

### 5.3 Other secrets

Provider credentials (Stripe/Resend/R2/AI/OAuth) normally live in admin → Settings (the `config` table), NOT in env. Only pipe a secret here if the user explicitly wants an env-level fallback (names matching `*_SECRET`, `*_TOKEN`, `*_PASSWORD`, `*_API_KEY` in their env file). Narrate names only.

## Phase 5.5: Production URL (one prompt unless already set or `--domain=` passed)

**Skip if:** `.env.production` `VITE_APP_URL` AND `wrangler.jsonc` `vars.VITE_APP_URL` are both consistent with routes (workers.dev URL + no `routes`, or custom domain matching a `routes[].pattern`). `--domain=X` uses X directly; `--domain=default`/`--domain=workers.dev` forces the default URL.

Otherwise prompt:

> 生产 URL 用哪个?
> 1. **默认 workers.dev**(`https://<worker>.<your-subdomain>.workers.dev`,首次部署后才知道确切子域,我会先用占位符再修正)
> 2. **自有域名**(粘贴,如 `app.example.com` — 该域名或其父 zone 必须已在你的 Cloudflare 账号里)

### On default

Create/update `.env.production`(gitignored): `VITE_APP_URL=https://<worker>.workers.dev`(占位)、`VITE_APP_NAME=<from dev env>`. **Also** set the same under `wrangler.jsonc` `vars` — at runtime (nodejs_compat) Workers vars land in `process.env`, which `src/config/index.ts` falls back to when the baked `import.meta.env` value is absent; without it better-auth `trustedOrigins` breaks (403 Invalid origin). Do NOT add `routes`.

### On custom domain

Same two files but with the exact URL, plus:

```jsonc
"routes": [{ "pattern": "app.example.com", "custom_domain": true }]
```

Warn: the zone must already exist in the account, else deploy fails with "not a zone in your account".

## Phase 6: Deploy — Interruption #2 (the only confirmation)

> Ready to deploy `<worker>`:
> - Account: `<name>` (`<id>`)
> - D1: `<db>` (N migrations) · RBAC ✓ · Secrets: `<names>`
> - This creates a live URL and replaces any previous deployment. Proceed? (yes/no)

On `yes`:

```bash
pnpm run cf:deploy
```

(`cf:deploy` = source `.env.production` → `NITRO_PRESET=cloudflare_module vite build` → `wrangler deploy`. Wrangler picks up the generated config via the `.wrangler/deploy/config.json` redirect.)

Capture the deployed URL from wrangler's output (`https://<worker>.<subdomain>.workers.dev`).

## Phase 7: Fix baked URL and redeploy (auto, no confirmation)

**Skip if:** `.env.production` AND `wrangler.jsonc` vars both already match the deployed URL (custom-domain users hit this immediately; incremental re-runs too).

If they differ: update both files with the real URL, re-run `pnpm run cf:deploy` (same deploy event, no re-confirmation), narrate "Baked the real URL and redeployed."

## Phase 8: Verify (auto, smoke test)

```bash
URL="<deployed url>"
curl -sS --noproxy '*' -o /dev/null -w "/    HTTP=%{http_code} TIME=%{time_total}s\n" "$URL/"
curl -sS --noproxy '*' -o /dev/null -w "/api  HTTP=%{http_code}\n" "$URL/api/config/public"
```

Both 200 → report success with the live URL. Any 500 → one-shot `npx wrangler tail` to capture the first error (print the command for the user too, don't keep it running).

## Phase 9: First super_admin (optional — Interruption #3)

**Postgres backend:** use Phase 3-PG step 5 instead (direct `pnpm rbac:init` / `rbac:assign` against PG) — the D1 SQL below doesn't apply.

**Skip prompt if:** `ADMIN_COUNT > 0` and no `--admin*` flag.

Flag modes: `--admin-email=X --admin-password=Y` → 9.A create; `--admin=X` → 9.B promote. Otherwise prompt the three options (create with password ⚠️ visible in chat once / promote existing — sign up at `<URL>/sign-up` first / skip).

### 9.A Create account directly

```bash
LOCAL_D1=$(find .wrangler/state -name "*.sqlite" -path "*d1*" | head -1)
DATABASE_PROVIDER=sqlite DATABASE_URL="file:$LOCAL_D1" \
  pnpm rbac:init --admin-email="$EMAIL" --admin-password="$PASS" 2>&1 | tail -5

# user first, then account (FK order; .dump alone is alphabetical), skip user_role
{
  sqlite3 "$LOCAL_D1" ".dump user" | grep -E "^INSERT INTO user "
  sqlite3 "$LOCAL_D1" ".dump account" | grep -E "^INSERT INTO account "
} | sed 's/^INSERT INTO/INSERT OR IGNORE INTO/' > /tmp/admin-seed.sql
npx wrangler d1 execute "$DB_NAME" --remote --file=/tmp/admin-seed.sql

# user_role via JOIN — local role.id UUIDs don't match remote's
npx wrangler d1 execute "$DB_NAME" --remote --command="
INSERT OR IGNORE INTO user_role (id, user_id, role_id)
SELECT lower(hex(randomblob(16))), u.id, r.id
FROM user u, role r WHERE u.email = '$EMAIL' AND r.name = 'super_admin'"

# verify
npx wrangler d1 execute "$DB_NAME" --remote --json --command="
SELECT u.email, r.name FROM user u
JOIN user_role ur ON ur.user_id = u.id JOIN role r ON r.id = ur.role_id
WHERE u.email = '$EMAIL' AND r.name = 'super_admin'"
```

1 row → `✓ Admin <email> created. Sign in at <URL>/sign-in.` (never echo the password). 0 rows → surface init-rbac output (password too short, or user existed with another password).

### 9.B Promote existing user

Just the `INSERT OR IGNORE ... SELECT` + verify from above. 0 rows → user hasn't signed up yet; ask them to sign up at `<URL>/sign-up` first or switch to 9.A.

## Force flags

| Flag | Effect |
|---|---|
| (none) | Idempotent re-run; only the deploy confirmation fires |
| `--admin-email=X --admin-password=Y` | Phase 9.A create-account mode |
| `--admin=email@x.com` | Phase 9.B promote-existing mode |
| `--domain=app.example.com` | Switch to custom domain (routes + env + redeploy); `--domain=default` reverts to workers.dev |
| `--rotate-secrets` | Re-upload all secrets |
| `--force-rbac` | Re-run Phase 4.5 even if `role` is non-empty |

## Troubleshooting cheatsheet

| Symptom | Likely cause | Fix |
|---|---|---|
| `D1 binding "DB" not found` at runtime | `wrangler.jsonc` `d1_databases` placeholder id, or server entry didn't stash the env | Phase 3.3; check `src/server.ts` `ensureCloudflareEnv` |
| 500 on every page | AUTH_SECRET unset/placeholder, or `vars.DATABASE_PROVIDER` ≠ `d1` | Phase 5.1 / 3.3 |
| Sign-in 403 `Invalid origin` from a browser (curl works) | localhost URL baked into the bundle — `.env.local`/`.env.development` beat `.env.production` because `loadEnvFiles` doesn't overwrite existing keys and prefers `.env.local` | Deploy via `pnpm run cf:deploy` (sources `.env.production` first), ensure `wrangler.jsonc` `vars.VITE_APP_URL` is set; verify with `grep -o 'https://[^"]*' .output/server/_ssr/*.mjs \| head` |
| `wrangler d1 migrations apply` finds no migrations | `migrations_dir` missing from the `d1_databases` entry | Set `"migrations_dir": "drizzle"` |
| Bundle > limit (3 MiB free / 10 MiB paid, gzip) | Heavy server deps | Paid plan, or dynamic-import heavy modules |
| Image upload fails on Workers | No-storage local-disk fallback needs a filesystem | Configure R2 in admin → Settings → Storage |
| drizzle-kit "Interactive prompts require a TTY" | Column-conflict resolution needed | User runs `pnpm db:generate` in their terminal once |
| `sqlite3: command not found` (Phase 4.5/9.A) | CLI missing | `brew install sqlite` / `apt-get install sqlite3` |
| Deploy fails `not a zone in your account` | Custom domain isn't a Cloudflare zone | Add the zone, or `--domain=default` |
| 522/1014 right after custom-domain deploy | DNS record still propagating | Wait ~30 s, retry |
| `/admin` 403 after Phase 9 | Stale session claims | Sign out and back in |
| Runtime throws "This DB driver was stubbed out of the Cloudflare Workers build" | `wrangler.jsonc` `vars.DATABASE_PROVIDER` was changed AFTER the last build (vite.config.ts bakes the driver choice at build time) | Rebuild + redeploy (`pnpm run cf:deploy`) so the bundle matches the provider |
| Postgres mode: every query fails with connection errors but `wrangler hyperdrive create` succeeded | `hyperdrive` binding missing from `wrangler.jsonc`, or binding name ≠ `HYPERDRIVE` | `src/core/db/postgres.ts` expects binding name exactly `HYPERDRIVE`; fix wrangler.jsonc and redeploy |
| Postgres mode: intermittent `Cannot perform I/O on behalf of a different request` | A postgres client got cached across requests (e.g. someone re-added a module-level cache for TCP drivers) | `src/core/db/index.ts` deliberately skips the singleton cache for postgres/mysql on Workers — restore that behavior |
| `wrangler hyperdrive create` fails with connection error | Postgres unreachable from Cloudflare: IP allowlist, no TLS, or blocked port | Allow Cloudflare egress / enable TLS on the DB; for Neon/Supabase use the direct (non-pooler) connection string |

## What this skill never does

- Run the final deploy without an explicit `yes` (Phase 7's redeploy belongs to the confirmed event)
- Echo secret values (generate with openssl, pipe from env files, print names only)
- Write secrets into `wrangler.jsonc` `vars` (vars are public)
- Hand-edit generated files (`.output/**`, `.wrangler/**`)
- Make the user copy-paste routine wrangler/openssl/db commands — those are agent-executed
