# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

No test suite is configured in this project.

## Environment Setup

Create `.env.local` with Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Architecture

Realmwright is a Next.js 16 App Router worldbuilding platform for Game Masters. The path alias `@/*` maps to `./src/*`.

### Route Groups

- `src/app/(public)/` — Unauthenticated pages (landing, login, signup)
- `src/app/(protected)/` — Auth-guarded pages; the layout checks the session and redirects to `/login` if absent, then renders `AppShell`

Protected routes follow a world-scoped pattern: `/worlds/[worldId]/{locations,npcs,items,gods,gods}`

### Data Layer

All database operations go through **Next.js Server Actions** in `src/app/actions/`. There are two Supabase clients:

- `supabaseServerClient.ts` — Read-only, used in Server Components
- `supabaseActionClient.ts` — Read-write, used in Server Actions
- `supabaseBrowserClient.ts` — Browser-side client (used sparingly)

Supabase uses Row Level Security (RLS) so users can only access their own worlds and related resources (locations, npcs, items, gods).

### State Management

`src/store/appStore.ts` is a Zustand store (with `persist` + `devtools`) tracking:
- `sidebarOpen` — mobile sidebar toggle
- `selectedWorld` — currently active world context
- `globalSearch` — search query state

### Component Patterns

- Feature-based folders under `src/components/` (one per resource type: `worlds/`, `locations/`, `npcs/`, `items/`, `gods/`)
- Each resource type has `Create*Dialog.tsx` and `Edit*Dialog.tsx` modals
- Shared UI primitives live in `src/components/ui/`
- Forms use React Hook Form + Zod validation; Zod schemas live in `src/lib/validators/`

### Key Architectural Connections

1. `middleware.ts` refreshes Supabase auth sessions on every request
2. `(protected)/layout.tsx` enforces auth, fetches the current user, renders `AppShell`
3. `AppShell.tsx` renders the persistent header, sidebar (`Sidebar.tsx`), and page content
4. Sidebar is world-aware — it reads `selectedWorld` from Zustand and renders scoped nav links
5. `src/app/actions/search.ts` performs cross-resource full-text search
6. `src/app/actions/worldDashboard.ts` aggregates resource counts per world for the dashboard view
