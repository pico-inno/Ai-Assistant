# Ai-Assistant — Codebase Overview

This document helps new contributors understand the project layout, tools, fetching patterns, and how to get started quickly.

**Repository summary**

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI:** React 19 + Tailwind CSS
- **Data fetching & caching:** native `fetch` + `@tanstack/react-query` (React Query)
- **State:** `zustand` for local stores
- **Forms/validation:** `react-hook-form` + `zod`
- **Package manager:** pnpm (lockfile: `pnpm-lock.yaml`)
- **Testing:** Vitest

## Quick Start

Requirements:

- Node.js 22.x (see `package.json` engines)
- `pnpm` installed globally is recommended

Commands (run from repo root):

```
pnpm install
pnpm dev    # runs Next.js in dev mode (port 3001)
pnpm build
pnpm start
pnpm test
pnpm lint
pnpm types:check
```

Scripts are defined in `package.json`.

## Top-level structure

- `src/` — main source code
  - `app/` — Next.js App Router routes and server components. Also contains `api` route handlers under `src/app/api`.
  - `components/` — shared UI components, providers and UI primitives (e.g. `providers/query-provider.tsx`, `ui/*`).
  - `features/` — feature-scoped UI and logic (e.g. `chat`, `agents`, `conversations`, `auth`). Each feature contains its own components, api helpers, and stores.
  - `lib/` — low-level libraries and helpers (e.g. `ai.ts`, `auth/` helpers). Server-side logic that calls external APIs often lives here.
  - `hooks/` — reusable React hooks
  - `utils/` — small utilities, cookie helpers, and context helpers

Other top-level files:

- `next.config.ts` — Next configuration
- `tsconfig.json` — TypeScript config and path aliases (`@/*` -> `./src/*`)
- `tailwind.config.ts` and `globals.css` — Tailwind config and global styles

## Notable files and folders

- `src/components/providers/query-provider.tsx` — React Query/provider wrapper used by the app. Default staleTime set to 5 minutes.
- `src/lib/auth/` — contains `client.ts` and `server.ts` showing both client-side calls to `/api/auth/*` and server-side calls to an external API (via `process.env.EXTERNAL_API_URL`).
- `src/features/chat/` — chat UI, conversation area, prompt area and components.
- `src/app/api/` — Next.js App Router route handlers (server endpoints).
- `src/api/` — additional server-side helpers and API adapters used by features (some projects keep a parallel `src/api` for shared server helpers).

## Fetching patterns and data flow

- Client-side fetches:
  - Client components (or hooks) call the application's own API endpoints (e.g. `fetch('/api/...')`). See `src/lib/auth/client.ts` for examples of client-side calls to `/api/auth/refresh` and logout flows.
  - React Query is used to cache, refetch and manage request state. The `QueryClient` is created in `src/components/providers/query-provider.tsx`.

- Server-side fetches:
  - Server modules (server components and API route handlers) call external services using `fetch` and environment variables (e.g. `process.env.EXTERNAL_API_URL`) as shown in `src/lib/auth/server.ts`.
  - Server-side fetches typically run inside Next.js route handlers or server components under `src/app`.

- Image fetching and static assets
  - Next.js `Image` config exists in `next.config.ts` (currently minimal). Some components may use `fetch` to load binary image data directly (see `features/chat/components/tools/image-view.tsx`).

## State management and caching

- Short-lived async request caching is handled by `@tanstack/react-query`.
- Local UI/global state is implemented via `zustand` where needed.

## Form handling and validation

- Forms use `react-hook-form` and `zod` for schema validation. Look under `features/auth` for examples.

## Styling

- Tailwind CSS is used for styling. Global styles live in `src/app/globals.css` and configuration in `tailwind.config.ts`.

## Testing & linting

- Unit tests: `vitest` (see `vitest.config.mts`).
- Linting: `eslint` with `eslint-config-next` and tailored rules. Formatting uses Prettier with plugins for Tailwind and import sorting.

## Environment variables

- External API base URLs and secrets are referenced via environment variables (e.g. `EXTERNAL_API_URL`).
- When running locally, add a `.env.local` with the variables used by your environment. Check API server code (e.g. `src/lib/auth/server.ts`) to see which env vars are required.

## How to add a new feature or page

1. Add a new folder under `src/features/<your-feature>` with subfolders for `components`, `api` and `stores` as needed.
2. If exposing HTTP endpoints, add a route handler under `src/app/api/<route>` using the App Router conventions.
3. Reuse shared components from `src/components/` and hooks from `src/hooks/`.
4. Use React Query for server communication and caching; provide types with `zod` if validating request/response payloads.

## Developer tips

- Prefer server components (under `src/app`) for rendering when you need server-side data fetching or sensitive env access.
- Use client components (`"use client"`) only when you need browser-only APIs (event handlers, local state, etc.).
- Keep API interaction centralized in `src/lib/*` so the same logic can be reused from both server and client adapters.
- Use React Query for caching rather than manual in-component state where possible.

## Where to look first (guided tour)

- Landing / app shell and layout: `src/app/layout.tsx` and `src/app/globals.css`.
- Authentication flow: `src/lib/auth/*`, `src/app/(auth)` and `src/features/auth`.
- Chat and realtime UI: `src/features/chat/*` (components: `chat-view.tsx`, `prompt-area.tsx`).
- Shared components and providers: `src/components/*` and `src/components/providers/query-provider.tsx`.

## Next steps for contributors

- Run the app locally: `pnpm install && pnpm dev` and open `http://localhost:3001`.
- Run type checks and tests: `pnpm types:check && pnpm test`.
- Add a short PR description describing the intent and link to relevant feature folders.
