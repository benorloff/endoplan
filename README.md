# EndoPlan

Clinical web app for vascular surgeons to plan endovascular cases and select devices through a guided stepper workflow.

## Tech Stack

- **Next.js 16** (App Router)
- **TypeScript**
- **TailwindCSS**
- **shadcn/ui**
- **Supabase** (Auth + Database)
- **Zustand** (State management)
- **Zod** (Validation)
- **Vitest + React Testing Library** (Testing)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project ([EndoplanDev](https://supabase.com/dashboard/project/gpchmnlilthlmhoayplg))

### Environment Variables

Create a `.env.local` file in the root directory (see `.env.local.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://gpchmnlilthlmhoayplg.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

Keys are in the [Supabase Dashboard](https://supabase.com/dashboard/project/gpchmnlilthlmhoayplg/settings/api) under **Project Settings → API**.

### Installation

```bash
npm install
```

### Database

Schema migrations live in `supabase/migrations/`. After restoring a backup or applying schema changes:

```bash
npm run db:push    # apply pending migrations to linked Supabase project
npm run db:types   # regenerate TypeScript types from remote schema
```

### Demo seed data

For local testing, load catalog items, demo hospitals, and sample draft cases:

**In the app (recommended):** Sign in → **Settings** → **Development** → **Load Demo Data**. This links your account to the demo org so locations appear on the create-case form.

**CLI (catalog + org only, or with user link):**

```bash
npm run db:seed
PROFILE_ID=<your-supabase-user-uuid> npm run db:seed
```

Seed SQL also runs automatically on `supabase db reset` when using local Supabase (`supabase/seed.sql`).

Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

### Google OAuth Setup

1. **Google Cloud Console** — create OAuth 2.0 credentials ([Google Auth Platform](https://console.cloud.google.com/apis/credentials)):
   - Application type: **Web application**
   - Authorized redirect URI: `https://gpchmnlilthlmhoayplg.supabase.co/auth/v1/callback`

2. **Supabase Dashboard** — [Authentication → Providers → Google](https://supabase.com/dashboard/project/gpchmnlilthlmhoayplg/auth/providers):
   - Enable Google provider
   - Paste Client ID and Client Secret from Google

3. **Supabase Dashboard** — [Authentication → URL Configuration](https://supabase.com/dashboard/project/gpchmnlilthlmhoayplg/auth/url-configuration):
   - Site URL: `http://localhost:3000` (dev) or your production URL
   - Redirect URLs: `http://localhost:3000/auth/callback` (add production URL when deploying)

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
npm test
```

### Build

```bash
npm run build
```

## Project Structure

```
app/                    # Next.js App Router pages
  ├── auth/            # Auth routes (callback)
  ├── dashboard/       # Dashboard page
  ├── wizard/          # Case planning wizard
  ├── sign-in/         # Sign-in page
  ├── org/             # Organization management
  ├── locations/       # Locations management
  ├── catalog/         # Catalog items
  └── cases/           # Cases management

components/            # React components
  ├── ui/              # shadcn/ui components
  ├── dashboard/       # Dashboard-specific components
  ├── wizard/          # Wizard components
  └── org/             # Organization components

lib/                   # Utilities and helpers
  ├── supabase/        # Supabase clients (client, server, admin)
  ├── auth/            # Auth utilities
  ├── tenant/          # Tenant context helpers
  ├── db.types.ts      # Database types (generate from Supabase)
  └── utils.ts         # General utilities

store/                 # Zustand stores

schemas/               # Zod validation schemas

types/                 # TypeScript type definitions

supabase/
  └── migrations/      # SQL migrations
```

## Features

### Authentication

- Google OAuth via Supabase Auth
- Magic link authentication
- Auto-created profiles via database trigger
- Protected routes with server-side auth checks

### Tenant Model

- **Personal mode**: User owns their own data
- **Org mode**: Data is owned by an organization
- Users can be members of multiple organizations
- Default organization can be set on profile

### Row Level Security (RLS)

- All queries respect RLS policies
- Users can only see their own data or org data where they're members
- Writes require appropriate permissions (owner or org_admin/manager)

### Data Access Patterns

All database queries use:
- `createClient()` from `@/lib/supabase/server` for server components
- `createClient()` from `@/lib/supabase/client` for client components
- `createAdminClient()` from `@/lib/supabase/admin` only for server-side admin tasks

Use tenant context helpers from `@/lib/tenant/context` to build queries that respect tenant boundaries.

## Database Types

Generate TypeScript types from the linked Supabase project:

```bash
npm run db:types
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
