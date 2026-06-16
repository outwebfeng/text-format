# Text-Format

Text-Format is a multilingual online text processing site rebuilt on the current TanStack Start framework. It preserves the original tool URLs, SEO metadata, multilingual content, monitoring script, AdSense setup, robots, sitemap, and ads.txt behavior from the legacy `text-format_ori` project.

## Pages

- `/` — Text Format Cleaner
- `/deleteformat` — Delete Format
- `/formathtmlonline` — Format HTML Online
- `/removeduplicates` — Remove Duplicates
- `/fontremover` — Font Remover
- `/privacy-policy`
- `/terms-of-service`

English URLs are unprefixed. Chinese, Korean, Japanese, German, and Arabic URLs use `/zh`, `/ko`, `/ja`, `/de`, and `/ar` prefixes.

## Commands

```bash
pnpm install
cp .env.example .env.development
pnpm dev
pnpm build
pnpm start
```

Cloudflare Workers:

```bash
cp wrangler.example.jsonc wrangler.jsonc
pnpm cf:build
pnpm cf:deploy
```

## Environment

```env
VITE_APP_URL=https://text-format.com
VITE_APP_NAME=Text-Format
VITE_APP_DESCRIPTION=Text-format is text format cleaner online tool,text cleaner,format text online,text format remover,strip HTML,remove characters,replace online.
VITE_APP_LOGO=/logo.png
VITE_DEFAULT_LOCALE=en
VITE_GOOGLE_ANALYTICS_ID=
VITE_GOOGLE_ADSENSE_CLIENT_ID=ca-pub-7741547389250990
```

## Stack

- TanStack Start
- React 19
- TypeScript
- Tailwind CSS 4
- Paraglide JS
- Nitro / Cloudflare Workers
