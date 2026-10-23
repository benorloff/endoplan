# EndoPlan

MVP web app for planning endovascular cases.

The app uses Supabase for email/password auth only. All case data in the UI is
placeholder data from `lib/mock-data.ts`; nothing is read from or written to the
database yet.

## Tech stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (stock theme)
- Supabase (auth)
- Vitest + React Testing Library

## Getting started

1. Create `.env.local` from `.env.local.example`. Keys are in the
   [Supabase dashboard](https://supabase.com/dashboard/project/gpchmnlilthlmhoayplg/settings/api)
   under **Project Settings → API**. `SUPABASE_SERVICE_ROLE_KEY` is required
   for sign-up, which creates pre-confirmed users so no confirmation email is sent.
2. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create an account at
`/sign-up`, and you'll land on the dashboard.

## Pages

| Route         | What it does                                                   |
| ------------- | -------------------------------------------------------------- |
| `/sign-in`    | Email + password sign-in                                       |
| `/sign-up`    | Create an account                                              |
| `/dashboard`  | List of mock cases                                             |
| `/cases/new`  | New case form, pre-filled with sample data; submit shows the summary |
| `/cases/[id]` | Summary for a mock case                                        |

Everything except the auth pages requires sign-in (see `app/(app)/layout.tsx`).

## Project structure

```
app/
  (auth)/          sign-in, sign-up
  (app)/           signed-in pages: dashboard, cases/new, cases/[id]
components/
  ui/              shadcn/ui components
  NewCaseForm.tsx
  CaseSummary.tsx
  SignOutButton.tsx
lib/
  supabase/        Supabase clients (browser, server, admin) + session refresh
  auth/            requireAuth(), sign-up server action
  mock-data.ts     placeholder cases and form options
  db.types.ts      generated database types
supabase/
  migrations/      database schema (not used by the UI yet)
```

## Scripts

```bash
npm test           # run tests
npm run build      # production build
npm run db:push    # apply migrations to the linked Supabase project
npm run db:types   # regenerate lib/db.types.ts
```
