# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 16 (React 19) application for Bhutan Tourism ("Bhutan Upward Travels"), featuring a public website and an admin CMS panel. The application uses:

- Next.js App Router with Server Components
- Supabase (Postgres) for data storage, Supabase Storage for images
- Tailwind CSS v4 for styling
- TypeScript for type safety
- Radix UI and custom components for UI primitives
- Zod for schema validation
- Supabase Auth for admin authentication
- Resend for transactional email

## Repository Structure

```
frontend/                 # Main Next.js application
├── src/
│   ├── app/             # App router structure
│   │   ├── (website)/   # Public website pages
│   │   ├── admin/       # Admin CMS panel
│   │   └── api/         # API routes
│   ├── components/      # Shared UI components
│   ├── lib/             # Business logic and data access
│   └── hooks/           # Custom React hooks
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## Common Development Commands

All commands run from the `frontend/` directory (the Next.js app root), not the repo root.

### Running the Application

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```

### Development Utilities

```bash
# Run ESLint
npm run lint

# Seed dummy content (destinations, tours, hotels, etc.)
npm run seed:dummy

# Create the first admin user (email/password via args or ADMIN_EMAIL/ADMIN_PASSWORD)
npm run seed:admin
```

## Architecture Overview

### Data Layer

- Supabase Postgres is the primary database, accessed server-side with the service-role key (`src/lib/supabase/admin.ts`)
- Table columns are snake_case; `src/lib/supabase/mapping.ts` converts top-level keys to/from the camelCase document shapes used by components (jsonb payloads stay camelCase)
- Data access is organized by entity (tours, destinations, experiences, etc.)
- Each entity has a dedicated file in `src/lib/data/` with CRUD operations
- Zod schemas are defined in corresponding `schema.ts` files for validation
- Schema lives in `supabase/migrations/`; run it in the Supabase SQL editor (or via supabase CLI) when creating a project
- Admin users live in Supabase Auth (not an app table); role is stored in `app_metadata.role`

### Authentication

- Admin authentication uses Supabase Auth (email/password) via `@supabase/ssr`
- `src/proxy.ts` (Next.js 16's renamed middleware — exports a `proxy()` function + `config.matcher`) validates the session and guards `/admin/*`, redirecting to `/login` unless the user's role is `admin`. There is no `src/middleware.ts`.
- Role is read from `app_metadata.role` (set server-side, not self-assignable), falling back to `user_metadata.role`
- Server-side session helpers are in `src/lib/supabase/server.ts` (`supabaseServer`, `getAuthUser`, `getAdminUser`)

### Component Architecture

- UI components follow a strict separation between presentation and data-fetching
- Server Components handle data fetching and pass props to Client Components
- Reusable UI primitives are in `src/components/ui/`
- Entity-specific components are organized by feature area

### Admin Panel

The admin panel is a comprehensive CMS with:

- Dashboard with statistics
- CRUD interfaces for all content types (tours, destinations, experiences, etc.)
- DataTable components with sorting, filtering, and pagination
- Image upload functionality
- Tour request management

### Public Website

The public website includes:

- Homepage with featured content
- Detailed pages for tours, destinations, experiences, and hotels
- Interactive map components
- Enquiry forms with email notifications
- Responsive design for all device sizes

## Testing

No test runner is configured — there is no `test` script in `package.json` and no test files in the repo. Verify changes with `npm run lint` and `npm run build`. If adding tests, wire up the runner and script first.

## Deployment

Two options, both backed by hosted Supabase + Resend:

- **Vercel** (default): `npm run build` / `npm run start`.
- **Self-hosted via Docker**: `docker-compose up` from the repo root, which builds `frontend/Dockerfile` and reads env from `frontend/.env`.

Environment variables must be configured (copy `frontend/.env.example` to `frontend/.env`):

- NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY: Supabase project URL and anon key
- SUPABASE_SERVICE_ROLE_KEY: Supabase service-role key (server-only)
- RESEND_API_KEY / EMAIL_FROM / OPERATOR_EMAIL: Resend email configuration (tour-request notifications go to OPERATOR_EMAIL)
- NEXT_PUBLIC_SITE_URL: canonical public URL (used for sitemap/robots and email links)

## Common Patterns

1. **Data Fetching**: Use server-side data fetching in Server Components
2. **Validation**: Use Zod schemas for all data validation
3. **Styling**: Use Tailwind CSS classes with consistent naming
4. **Component Structure**: Separate presentational and container components
5. **Error Handling**: Use proper error boundaries and validation feedback