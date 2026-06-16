# Vulnerability Review Checklist

Review the diff against each category below. Only flag findings reachable from the
changed code — don't audit the whole repo unless asked. For each finding, verify it is
actually exploitable (trace the input path) before reporting.

## Contents

1. [Injection](#1-injection)
2. [XSS](#2-xss)
3. [Prompt injection](#3-prompt-injection)
4. [Auth & access control](#4-auth--access-control)
5. [Business-logic flaws](#5-business-logic-flaws)
6. [Data exposure](#6-data-exposure)
7. [Other web vulnerabilities](#7-other-web-vulnerabilities)
8. [Severity guide](#8-severity-guide)

## 1. Injection

**SQL injection**
- Raw SQL built from user input: `sql.raw()`, template strings inside `db().execute()`,
  string-concatenated `where` fragments. Drizzle's query builder (`eq()`, `like()`, etc.)
  parameterizes automatically — flag only raw/interpolated SQL.
- `like(col, \`%${userInput}%\`)` — not injectable but `%`/`_` wildcards from users can
  cause unexpected matching/DoS on large tables; MEDIUM if input is unbounded.

**Command injection**
- User input reaching `child_process.exec/execSync/spawn` with `shell: true`,
  or interpolated into shell strings in scripts.

**Path traversal**
- User input in file paths: `fs.readFile(path.join(dir, userInput))`, dynamic
  `import()`/`require()` with user-controlled segments, storage keys built from
  user input without sanitizing `..` and absolute paths.

## 2. XSS

- `dangerouslySetInnerHTML` with content that can contain user/db input — check the
  sanitization chain: markdown renderers must have `html: false` (markdown-it) or a
  sanitizer; if HTML passthrough is enabled, stored XSS via db content is likely.
- User input echoed into `<script>` blocks, inline event handlers, `href`
  (`javascript:` URLs), `src`, or CSS.
- JSON embedded in HTML (`<script>window.__DATA__ = ${JSON.stringify(x)}</script>`)
  without escaping `<` (`</script>` breakout).
- SVG uploads served inline from the same origin.

## 3. Prompt injection

For any code that builds LLM prompts (`src/core/ai/`, AI task handlers):

- Untrusted content (user input, db content, fetched web pages, file uploads)
  concatenated into system prompts or tool instructions without delimiting/labeling.
- LLM output used to perform privileged actions (tool calls, db writes, shell) without
  validation — an injected instruction in the content becomes code execution.
- Skill/agent instruction files (`.claude/`, `*.mdx` content rendered to agents) that
  could carry embedded instructions from third-party sources.

## 4. Auth & access control

- New API routes: is there a session check? Compare with the pattern in AGENTS.md —
  `auth.api.getSession()` + `respErr('Unauthorized')`.
- Admin routes: session check alone is NOT enough — verify RBAC/permission check
  (`matchPermission`) is present.
- IDOR: queries filtered only by record id without `userId` scoping — can user A read
  or mutate user B's order/subscription/apikey/credits?
- Mass assignment: `...body` spread into db update/insert — can the caller set
  `status`, `userId`, `credits`, `role` fields they shouldn't control?
- Missing rate limiting on auth-sensitive or costly endpoints (login, signup,
  checkout, AI tasks) — `enforceMinIntervalRateLimit` exists in `@/lib/rate-limit`.

## 5. Business-logic flaws

- **Payments/credits**: amounts or prices taken from the client instead of server
  config; webhook handlers without signature verification; non-idempotent webhook
  processing (replay → double credit grant); race conditions on credit consumption
  (check-then-write without transaction).
- **State machines**: status transitions that skip validation (e.g. setting an order
  to `paid` via a generic update endpoint).
- **Numeric edge cases**: negative quantities/amounts accepted; integer parsing
  without bounds (`parseInt(page)` → negative offset).
- **Slug/id collisions**: user-supplied slugs overwriting existing records or shadowing
  reserved routes.

## 6. Data exposure

- API responses returning whole db rows (`select().from(table)`) where the row contains
  secrets/PII — password hashes, tokens, emails of other users, encrypted config values.
- Server-only env vars referenced in client components or passed via props into
  `"use client"` files. Only `NEXT_PUBLIC_*` may reach the client.
- Error handlers returning raw error/stack to the response body.
- Logging of credentials, tokens, or full request bodies.
- Admin-masked secrets: verify masked values aren't round-tripped back into storage.

## 7. Other web vulnerabilities

- **SSRF**: user-supplied URLs fetched server-side (webhooks, image proxies,
  link previews) without allowlist/protocol checks.
- **Open redirect**: `redirect(searchParams.get('next'))` without origin validation.
- **CSRF**: state-changing GET handlers; cookie-authed endpoints that skip
  better-auth's built-in protections.
- **ReDoS**: user input fed to regexes with nested quantifiers.
- **Zip/decompression bombs & unrestricted upload**: file uploads without size/type
  limits, or stored under user-controlled names.
- **Dependency risk**: new dependencies added in this diff — typosquatting, unpinned
  `latest`, postinstall scripts.

## 8. Severity guide

| Level | Meaning | Examples |
|---|---|---|
| HIGH | Exploitable now, or secret/credential exposure | SQLi, stored XSS, missing auth on mutation, leaked live key, IDOR on payments |
| MEDIUM | Exploitable under conditions, or defense-in-depth gap | missing rate limit, open redirect, verbose errors, wildcard LIKE DoS |
| LOW | Hygiene / hardening | missing ignore entries, OS junk files, missing security headers |

HIGH findings block the commit. MEDIUM: fix or get explicit user sign-off. LOW: note them.
