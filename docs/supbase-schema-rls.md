# Supabase Schema + RLS (MVP)

## Auth Model
- Use Supabase Auth (magic links) for identity.
- Domain user record is `public.profiles` with `id = auth.users.id`.
- `profiles` created automatically via `public.handle_new_auth_user()` trigger.

## Tenancy Model
Most tables support either:
- Personal scope: `owner_profile_id = auth.uid()`
- Org scope: `org_id` where `auth.uid()` is a member via `public.org_members`
Some catalogs allow Global scope:
- Global rows have `owner_profile_id IS NULL AND org_id IS NULL`
- Global rows are read-only to regular users.

## Roles
- `org_members.role` in: `org_admin | surgeon | manager | readonly`
- For MVP writes to org-owned rows require `org_admin` or `manager`.
- Personal rows writable by owner.

## Global+Tenant Catalog Tables
- `procedures`, `access_sites`, `catalog_items`, `compatibility_rules`:
  - SELECT: personal OR org-member OR global
  - WRITE: personal owner OR org admin/manager

## Tenant-only Tables
- `locations`, `contacts`, `location_inventory`, `cases`,
  `case_access_sites`, `case_pathways`, `case_items_planned`, `case_items_used`,
  `templates`, `exports`, `audit_log`

## Important Notes
- UPC/EAN/GTIN stored as TEXT in `catalog_items.barcode`
- Case hierarchy:
  - `cases` -> `case_access_sites` -> `case_pathways` -> `case_items_planned`
  - `case_items_used` ties directly to case

## Developer Actions (Types)
- Generate TS types: `supabase gen types typescript --project-id <id> --schema public > src/lib/db.types.ts`
- Use typed Supabase client in code.