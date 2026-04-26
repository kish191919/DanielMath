<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Phase B (auth + dashboard) conventions

- This project uses **`@supabase/ssr`** with the Next 16 cookie pattern. The middleware file is renamed to **`proxy.ts`** at the project root (not `middleware.ts`). `cookies()` and `headers()` from `next/headers` are **async** — always `await`.
- Before touching auth code, read:
  - `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`
  - `node_modules/next/dist/docs/01-app/02-guides/authentication.md`
- Supabase clients are split by context — never import the wrong one:
  - `src/lib/supabase/browser.ts` → client components only
  - `src/lib/supabase/server.ts` → Server Components, Server Actions, Route Handlers
  - `src/lib/supabase/proxy.ts` → only inside `proxy.ts`
  - `src/lib/supabase/admin.ts` → service-role; server-only, never from a client component
- Every dashboard page/action **must** call `requireSession()` or `requireRole()` from `src/lib/dal.ts`. The proxy is optimistic only and can be bypassed by Server Actions on non-matched routes.
- Marketing pages live under `src/app/(marketing)/`; dashboard under `src/app/(dashboard)/`. Route group names do **not** appear in URLs.
