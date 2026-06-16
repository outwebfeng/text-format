---
name: generate-image
description: "Generate an AI image (hero visual, feature illustration, empty-state graphic, blog cover, etc.) from a text prompt using Pollinations.ai. Free, no API key. Saves to public/imgs/generated/ and returns a Next.js-ready URL like /imgs/generated/<file>.png that can be dropped into <Image src=...> immediately. Use whenever a page or block needs a decorative visual and the user hasn't provided one."
argument-hint: "<image description — subject, style, mood; optionally: size, slug>"
user-invocable: true
---

# Generate Image — $ARGUMENTS

Generate one AI image and save it under `public/imgs/generated/`. The script returns both the on-disk path and the public URL (e.g. `/imgs/generated/hero-bg-1714512000000.png`) so it can be referenced from any component without further setup.

## When to use

- A landing block (hero, features, how-it-works, CTA) needs a visual and the user hasn't provided one.
- A dashboard page needs an empty-state illustration.
- A cloned site is being re-skinned (`/clone-website` Phase 6) and the original product screenshots no longer fit the new product.
- A blog or marketing page needs a cover image.
- A static page (`/new-static-page`) wants a header illustration.

For real product UI screenshots that must match an actual feature, ask the user to provide the asset instead — generated images are decorative / aspirational, not authoritative.

## Args (JSON, piped via stdin)

- `prompt` (string, **required**) — English description: subject, composition, lighting, mood. Be specific.
- `style` (string, optional) — appended to the prompt. Common values: `cinematic`, `photorealistic`, `anime`, `illustration`, `digital_art`, `3d_render`, `flat_design`, `isometric`.
- `width` (int, optional, default `1024`) — pixels.
- `height` (int, optional, default `1024`) — pixels.
- `slug` (string, optional) — short kebab-case label used in the filename (e.g. `hero-bg`, `feature-ai`, `empty-state`). Default `image`. Sanitized automatically.
- `seed` (int, optional) — fix this to reproduce the same image later.
- `output_dir` (string, optional) — default `public/imgs/generated`. Override only if the project uses a different `public/` layout.

## Returns

JSON on stdout:

```json
{
  "file": "public/imgs/generated/hero-bg-1714512000000.png",
  "url":  "/imgs/generated/hero-bg-1714512000000.png",
  "prompt": "<resolved prompt>",
  "size": "1280x720"
}
```

On failure: `{"error": "<reason>"}`. Surface the error and stop — do **not** retry in a loop.

Drop the `url` into JSX directly — `next/image` and plain `<img>` both work because the file is under `public/`:

```tsx
<Image
  src="/imgs/generated/hero-bg-1714512000000.png"
  alt="..."
  width={1280}
  height={720}
/>
```

## How to invoke

Pipe JSON args into the script via Bash. Use a single-quoted heredoc to avoid shell-escaping pitfalls:

```bash
node .claude/skills/generate-image/main.mjs <<'JSON'
{"prompt":"modern AI assistant interface, glowing neural network on dark gradient, no text","style":"digital_art","width":1280,"height":720,"slug":"hero-bg"}
JSON
```

Or one-liner:

```bash
echo '{"prompt":"isometric illustration of cloud servers, pastel palette","width":800,"height":600,"slug":"feature-cloud"}' | node .claude/skills/generate-image/main.mjs
```

Run from the project root so the `public/imgs/generated/` directory resolves correctly. Requires Node 18+ (for built-in `fetch`) — the same Node ShipAny already needs to run `pnpm dev`. No extra runtime, no `npm install`.

## Recommended sizes

| Use case | Size |
|---|---|
| Landing hero (background or side image) | 1280×720 or 1600×900 |
| Feature card illustration | 800×600 |
| How-it-works step illustration | 600×600 |
| Square avatar / icon-style | 512×512 |
| OG / social share card | 1200×630 |
| Blog cover | 1600×900 |
| Dashboard empty state | 600×400 |

## Prompt patterns that work

- **Hero:** `"<product subject>, <composition>, soft gradient background, modern SaaS aesthetic, clean professional, no text"`
- **Feature illustration:** `"<feature concept>, isometric illustration, pastel palette, white background, no text"`
- **Empty state:** `"friendly minimalist illustration of <thing>, flat design, single accent color, generous whitespace, no text"`
- **Tech / AI:** `"abstract neural network visualization, glowing nodes, dark navy background, cinematic lighting, no text"`

**Always include "no text"** — Pollinations frequently bakes garbled fake text into images otherwise.

## Notes

- One image per call. Don't loop unless the user explicitly asks for variations.
- Pollinations.ai is free but rate-limited; if a call errors, surface the message and stop.
- Files land under `public/imgs/generated/` and are served by Next.js automatically. They are NOT gitignored — commit the ones you keep.
- For deterministic regeneration (e.g. tweaking the prompt slightly while keeping composition), reuse the same `seed`.
- The script is plain Node (Node 18+ for built-in `fetch`), uses only Node stdlib — no `npm install`, no Python required.
