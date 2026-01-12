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
- Supabase account and project

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Server-only (optional, for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Installation

```bash
npm install
```

### Database Setup

1. Run the migrations in `supabase/migrations/`:
   - `0001_schema.sql` - Creates all tables
   - `0002_rls.sql` - Sets up Row Level Security policies

2. Generate TypeScript types (optional but recommended):
   ```bash
   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/db.types.ts
   ```
   
   Or use the Supabase Dashboard:
   - Go to Settings > API
   - Copy the TypeScript types
   - Replace the placeholder types in `lib/db.types.ts`

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
```

## Features

### Authentication

- Magic link authentication via Supabase Auth
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

To generate TypeScript types from your Supabase schema:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/db.types.ts
```

Or use the Supabase CLI with linked project:

```bash
npx supabase gen types typescript --linked > lib/db.types.ts
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
