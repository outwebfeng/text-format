---
name: new-page
description: "Create a new page in the dashboard with proper patterns — client component, API integration, nav entry. Use when the user asks to add a page, create a view, build a dashboard section, or says 'I need a page for...'"
argument-hint: "<page name and what it should show/do>"
user-invocable: true
---

# New Page — $ARGUMENTS

Create a new dashboard page based on the user's description.

## Step 1: Determine Page Requirements

From "$ARGUMENTS", figure out:
- **Route path:** e.g., `/settings/projects`
- **Data source:** Which module service to call? Does it need a new API route?
- **Interactivity:** Is this a read-only list, a CRUD form, or both?
- **Components needed:** Tables, cards, forms, dialogs?

## Step 2: Create API Route (if needed)

If the page needs data from the server, create or verify the API server route exists.

**Pattern:** `src/routes/api/<feature>.ts`

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { respData, respErr } from '@/lib/resp';
import { getAuth } from '@/core/auth';
import * as featureService from '@/modules/<feature>/service';

async function GET({ request }: { request: Request }) {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) return respErr('Unauthorized');

  const data = await featureService.list(session.user.id);
  return respData(data);
}

export const Route = createFileRoute('/api/<feature>')({
  server: { handlers: { GET } },
});
```

## Step 3: Create the Page

Pages do client-side data fetching with **TanStack Query** over `@/lib/api-client` — never raw `fetch`. Route paths are **locale-free** (no `{-$locale}` segment; the `/zh` prefix is added by the router rewrite). Define the route with `createFileRoute` and a `component`:

```typescript
// src/routes/settings/<feature>.tsx
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { m } from "@/paraglide/messages.js";
import { apiGet } from "@/lib/api-client";

interface Item { id: string; name: string }

function FeaturePage() {
  const { data, isFetching } = useQuery({
    queryKey: ["<feature>"],
    queryFn: () => apiGet<Item[]>("/api/<feature>"),
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m["settings.<feature>.title"]()}
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          {m["settings.<feature>.description"]()}
        </p>
      </div>
      {/* render data?.map(...) — show a loading state while isFetching */}
    </div>
  );
}

export const Route = createFileRoute("/settings/<feature>")({
  component: FeaturePage,
});
```

For **paginated** lists, use `pageQuery` + `PageResult<T>` + `placeholderData: keepPreviousData`, and feed a `DataTable` with `loading={query.isFetching}`. For writes, use `useMutation` with `onSuccess` → `toast` + `queryClient.invalidateQueries({ queryKey: ["<feature>"] })`. See `src/routes/admin/users.tsx` for the full pattern.

## Step 4: Add shadcn Components

Check if the page needs components not yet added. If so:
```bash
npx shadcn@latest add table dialog badge
```

**Remember:** shadcn v4 (Base Nova) does NOT support `asChild`. For Link-as-Button:
```tsx
<Link href="..." className={cn(buttonVariants({ variant: "outline" }))}>
```

## Step 5: Add Translation Keys

Add translation keys (flat, dot-joined) to **both** locale files:
1. Add `settings.<feature>.*` keys to `messages/en.json`
2. Add the same keys with Chinese values to `messages/zh.json`
3. Reference them with `m["settings.<feature>.xxx"]()` from `@/paraglide/messages.js` in the component

## Step 6: Add Navigation Entry

Update the layout `src/routes/settings/route.tsx` — add an entry to the nav array (labels use `m[...]`):

```typescript
import { SomeIcon } from "lucide-react";
import { m } from "@/paraglide/messages.js";

const navItems = [
  // existing items...
  { href: "/settings/<feature>", label: m["settings.nav.<feature>"](), icon: SomeIcon },
];
```

## Step 7: Add Visuals (optional)

If the page has an empty state, a hero header, or a section that would feel sparse with text alone, invoke the `/generate-image` skill once per visual:

- **Empty state** (no data yet): `flat_design` illustration, 600×400, slug like `empty-projects`. Reference it from the empty-state placeholder.
- **Page hero** (above the table/grid): wide background image, 1280×400 or 1600×500, slug like `<feature>-hero`.

The skill saves to `public/imgs/generated/` and returns a `/imgs/generated/<file>.png` URL ready for `<Image src=...>`. Always include `"no text"` in the prompt — Pollinations otherwise bakes garbled fake captions into the image. Skip image generation entirely for pages that are purely tabular or form-driven.

## Step 8: Verify

Run `pnpm build` to verify the page compiles.

## Rules

- **Fetch with TanStack Query + `@/lib/api-client`** (`apiGet`/`apiPost`/…) — no raw `fetch`, and don't import server-only modules (`@/modules/*`, `@/core/db`) in components.
- **Route paths are locale-free** — `createFileRoute("/settings/<feature>")`, no `{-$locale}` segment.
- **Page layout is inherited** from `AppLayout` via the `settings/route.tsx` layout — sidebar, header, auth guard are automatic.
- **Use `m["...key"]()`** from `@/paraglide/messages.js` for all user-facing text (add keys to both `messages/en.json` and `messages/zh.json`).
- **Use `Link` from `@/core/i18n/navigation`** — locale-aware navigation.
- **Use semantic Tailwind classes** — `bg-card`, `text-muted-foreground`, `border-border`, not raw colors.
- **Import icons from `lucide-react`** — `import { SomeIcon } from "lucide-react"`.
- **Keep pages focused** — one page does one thing.
