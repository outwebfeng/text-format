---
name: new-static-page
description: "Create a static content page (privacy policy, refund policy, cookies, about, etc.) as MDX in the (pages) route group. Use when the user asks for a legal page, info page, static page, or says 'add a page for...', 'I need a refund policy', 'create an about page'."
argument-hint: "<page type and any specific details>"
user-invocable: true
---

# New Static Page — $ARGUMENTS

Create a static MDX content page based on the user's description.

## Step 1: Determine Page Details

From "$ARGUMENTS", figure out:
- **Page type:** privacy policy, terms of service, refund policy, cookies policy, about, FAQ, contact, etc.
- **Route slug:** e.g., `refund-policy`, `cookies`, `about`, `faq`
- **Content specifics:** any details the user mentioned (e.g., "30-day refund window", "we use Google Analytics cookies")

## Step 2: Create the MDX Content Files

Create one MDX file per locale at `src/content/pages/<slug>.en.mdx` and `src/content/pages/<slug>.zh.mdx`. Each file exports a `meta` object (title/description for the page `head`) and then the Markdown body.

These files are rendered by per-slug route files (via an eager `import.meta.glob` in `(pages)/-static-page.tsx`) inside the `(pages)` route group, which automatically provides:
- Back link to homepage
- `prose` typography styling (element styles from `src/components/mdx-components.tsx`)
- Clean centered layout (max-w-3xl)

**MDX template:**

```mdx
export const meta = {
  title: "Page Title",
  description: "Short description for SEO.",
};

# Page Title

*Last updated: YYYY-MM-DD*

## Section 1

Content here...

## Section 2

- List item 1
- List item 2

## Contact

If you have questions, please contact us at the email address provided on our website.
```

## Step 2b: Create the Route File

Create a thin route file at `src/routes/(pages)/<slug>.tsx` using the shared factory (route paths are locale-free — the `/zh` prefix is handled by the router rewrite):

```tsx
import { createFileRoute } from '@tanstack/react-router';

import { staticPageRouteOptions } from './-static-page';

export const Route = createFileRoute('/(pages)/<slug>')(
  staticPageRouteOptions('<slug>')
);
```

The factory in `(pages)/-static-page.tsx` handles the MDX lookup, `head()` metadata (title/description/canonical), and rendering.

## Step 3: Generate Content

Write professional, complete content in Markdown. Guidelines:

- **Markdown body + a `meta` export** — the layout handles typography and chrome; only the `meta` export is required boilerplate
- **Write both locales** — `.en.mdx` and `.zh.mdx`
- **Be thorough** — cover all standard sections for that page type
- **Use standard Markdown** — `#` for headings, `-` for lists, `*text*` for emphasis
- **Keep it generic enough** to work for any SaaS but specific enough to be useful
- **Include "Last updated" date** and a "Contact" section

### Content guidelines by type:

**Refund Policy:** cancellation process, refund timeframe, eligible/ineligible items, how to request
**Cookie Policy:** what cookies are used, types (essential, analytics, marketing), how to manage, third-party cookies
**About:** company mission, what the product does, team info placeholder
**FAQ:** common questions about the service, billing, accounts, data
**Contact:** email, support hours, response time expectations

## Step 4: Verify

Run `pnpm build` to verify.

## Step 5: Report

Tell the user:
- Page URL: `/<slug>`
- File locations: `src/content/pages/<slug>.en.mdx` and `src/content/pages/<slug>.zh.mdx`
- Route file: `src/routes/(pages)/<slug>.tsx`
- Suggest adding a link in the landing page footer

## Rules

1. **MDX content files** — both `.en.mdx` and `.zh.mdx` in `src/content/pages/`
2. **Create the route file** — `(pages)/<slug>.tsx` via `staticPageRouteOptions`, or the page won't resolve
3. **Markdown body + `meta` export** — the layout wraps everything; element styling lives in `src/components/mdx-components.tsx`
4. **`(pages)` route group** — shared layout with back link + prose typography
5. **Slug format** — lowercase, hyphenated (e.g., `refund-policy`, not `refundPolicy`)
6. **`pnpm build` must pass** after creating the page
