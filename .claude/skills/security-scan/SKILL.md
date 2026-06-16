---
name: security-scan
description: Pre-commit security audit of pending changes — secrets about to be leaked, injection vulnerabilities (SQL/XSS/command/prompt injection), auth and business-logic flaws, and .gitignore/.dockerignore coverage gaps. Run BEFORE EVERY git commit in this repo, and whenever the user asks for a security check of changes ("扫一下安全问题", "check this is safe to commit", "security scan").
---

# Security Scan

Audit pending changes before they are committed. Two layers: a deterministic script
(secrets, forbidden files, ignore coverage) and a manual diff review (vulnerabilities,
logic flaws). Both must pass before committing.

## Workflow

### 1. Run the deterministic scanner

```bash
# before staging (scans staged + unstaged + untracked vs HEAD):
python3 .claude/skills/security-scan/scripts/scan_staged.py --worktree

# after staging (scans exactly what will be committed):
python3 .claude/skills/security-scan/scripts/scan_staged.py
```

Exit 1 = HIGH findings (block). It checks: secret patterns in added lines, forbidden
staged files (.env, keys, db dumps), `.gitignore` coverage via `git check-ignore`,
already-tracked sensitive files, `.dockerignore` when a Dockerfile exists, oversized files.

A finding in an `.example`/`.template` file with a real-looking value is still a leak —
verify placeholders are obviously fake (`your-key-here`, not a real-format key).

### 2. Review the diff for vulnerabilities

Get the pending diff (`git diff HEAD` plus untracked files, or `git diff --cached` if
already staged). Read [references/checklist.md](references/checklist.md) and review every
changed file against it. Categories: injection (SQL/command/path), XSS, prompt injection,
auth & access control, business-logic flaws (payments/credits/state), data exposure,
SSRF/redirect/CSRF/upload issues.

Scope: only what this diff adds or touches. Trace each suspect input to its source before
flagging — report exploitable paths, not theoretical style issues.

### 3. Report and gate

Output a result table:

```
| 级别 | 位置 | 问题 | 修复建议 |
```

Then apply the gate:

- **HIGH** → do NOT commit. Fix the issues (rotate any leaked secret — removing it from
  the diff is not enough if it was ever committed or pushed), re-run the scan, confirm clean.
- **MEDIUM** → fix when cheap; otherwise list them and get explicit user sign-off before
  committing.
- **LOW / clean** → state "扫描通过" with a one-line summary of what was scanned, then
  proceed with the commit.

If a secret was already pushed in an earlier commit, say so explicitly and tell the user
it must be rotated — history rewriting alone does not un-leak it.

## Notes

- New `.env` vars in this repo: ensure the variable is added to `.env.example` with a
  placeholder, never with a real value.
- New ignore needs discovered during review (build artifacts, local data, editor junk):
  add to `.gitignore`/`.dockerignore` as part of the same commit.
- This scan complements `/code-review` (correctness/quality) — don't duplicate its
  findings; stay on security.
