-- =============================================================================
-- Helper functions for RLS checks
-- =============================================================================
create or replace function public.is_org_member(p_org_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_members om
    where om.org_id = p_org_id
      and om.profile_id = auth.uid()
  );
$$;

create or replace function public.has_org_role(p_org_id uuid, p_roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.org_members om
    where om.org_id = p_org_id
      and om.profile_id = auth.uid()
      and om.role = any(p_roles)
  );
$$;

-- =============================================================================
-- Enable RLS
-- =============================================================================
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.org_members enable row level security;

alter table public.procedures enable row level security;
alter table public.locations enable row level security;
alter table public.contacts enable row level security;

alter table public.access_sites enable row level security;

alter table public.catalog_items enable row level security;
alter table public.location_inventory enable row level security;

alter table public.cases enable row level security;
alter table public.case_access_sites enable row level security;
alter table public.case_pathways enable row level security;
alter table public.case_items_planned enable row level security;
alter table public.case_items_used enable row level security;

alter table public.templates enable row level security;
alter table public.compatibility_rules enable row level security;

alter table public.exports enable row level security;
alter table public.audit_log enable row level security;

-- =============================================================================
-- PROFILES policies
-- =============================================================================
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles
for select
using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

-- Optional: allow users to insert their own profile (usually the trigger handles it)
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles
for insert
with check (id = auth.uid());

-- =============================================================================
-- ORGANIZATIONS policies
-- =============================================================================
drop policy if exists "orgs_select_member" on public.organizations;
create policy "orgs_select_member"
on public.organizations
for select
using (public.is_org_member(id));

-- For MVP: allow any authenticated user to create an org.
-- You will typically create the org and then add yourself to org_members as org_admin.
drop policy if exists "orgs_insert_authenticated" on public.organizations;
create policy "orgs_insert_authenticated"
on public.organizations
for insert
with check (auth.uid() is not null);

-- Only org_admin/manager can update org record
drop policy if exists "orgs_update_admin_manager" on public.organizations;
create policy "orgs_update_admin_manager"
on public.organizations
for update
using (public.has_org_role(id, array['org_admin','manager']))
with check (public.has_org_role(id, array['org_admin','manager']));

-- =============================================================================
-- ORG_MEMBERS policies
-- =============================================================================
drop policy if exists "org_members_select_member" on public.org_members;
create policy "org_members_select_member"
on public.org_members
for select
using (public.is_org_member(org_id));

-- Bootstrap: allow a user to insert *their own* org_admin membership row for a new org.
-- Also allow org_admin to invite/add others.
drop policy if exists "org_members_insert_bootstrap_or_admin" on public.org_members;
create policy "org_members_insert_bootstrap_or_admin"
on public.org_members
for insert
with check (
  (profile_id = auth.uid() and role = 'org_admin')
  or public.has_org_role(org_id, array['org_admin'])
);

-- Only org_admin can update membership roles/remove members
drop policy if exists "org_members_update_admin" on public.org_members;
create policy "org_members_update_admin"
on public.org_members
for update
using (public.has_org_role(org_id, array['org_admin']))
with check (public.has_org_role(org_id, array['org_admin']));

drop policy if exists "org_members_delete_admin" on public.org_members;
create policy "org_members_delete_admin"
on public.org_members
for delete
using (public.has_org_role(org_id, array['org_admin']));

-- =============================================================================
-- Global + Tenant tables: PROCEDURES / ACCESS_SITES / CATALOG_ITEMS / COMPATIBILITY_RULES
-- =============================================================================

-- PROCEDURES
drop policy if exists "procedures_select_visible" on public.procedures;
create policy "procedures_select_visible"
on public.procedures
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
  or (owner_profile_id is null and org_id is null) -- global
);

drop policy if exists "procedures_write_owner_or_org_admin" on public.procedures;
create policy "procedures_write_owner_or_org_admin"
on public.procedures
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- ACCESS_SITES
drop policy if exists "access_sites_select_visible" on public.access_sites;
create policy "access_sites_select_visible"
on public.access_sites
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
  or (owner_profile_id is null and org_id is null) -- global
);

drop policy if exists "access_sites_write_owner_or_org_admin" on public.access_sites;
create policy "access_sites_write_owner_or_org_admin"
on public.access_sites
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- CATALOG_ITEMS
drop policy if exists "catalog_items_select_visible" on public.catalog_items;
create policy "catalog_items_select_visible"
on public.catalog_items
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
  or (owner_profile_id is null and org_id is null) -- global
);

drop policy if exists "catalog_items_write_owner_or_org_admin" on public.catalog_items;
create policy "catalog_items_write_owner_or_org_admin"
on public.catalog_items
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- COMPATIBILITY_RULES
drop policy if exists "compat_rules_select_visible" on public.compatibility_rules;
create policy "compat_rules_select_visible"
on public.compatibility_rules
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
  or (owner_profile_id is null and org_id is null) -- global
);

drop policy if exists "compat_rules_write_owner_or_org_admin" on public.compatibility_rules;
create policy "compat_rules_write_owner_or_org_admin"
on public.compatibility_rules
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- =============================================================================
-- LOCATIONS
-- =============================================================================
drop policy if exists "locations_select_visible" on public.locations;
create policy "locations_select_visible"
on public.locations
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
);

drop policy if exists "locations_write_owner_or_org_admin" on public.locations;
create policy "locations_write_owner_or_org_admin"
on public.locations
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- =============================================================================
-- CONTACTS (inherit visibility from location)
-- =============================================================================
drop policy if exists "contacts_select_via_location" on public.contacts;
create policy "contacts_select_via_location"
on public.contacts
for select
using (
  exists (
    select 1
    from public.locations l
    where l.id = contacts.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.is_org_member(l.org_id))
      )
  )
);

drop policy if exists "contacts_write_via_location_admin" on public.contacts;
create policy "contacts_write_via_location_admin"
on public.contacts
for all
using (
  exists (
    select 1
    from public.locations l
    where l.id = contacts.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.has_org_role(l.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1
    from public.locations l
    where l.id = contacts.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.has_org_role(l.org_id, array['org_admin','manager']))
      )
  )
);

-- =============================================================================
-- LOCATION_INVENTORY (inherit visibility from location)
-- =============================================================================
drop policy if exists "locinv_select_via_location" on public.location_inventory;
create policy "locinv_select_via_location"
on public.location_inventory
for select
using (
  exists (
    select 1
    from public.locations l
    where l.id = location_inventory.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.is_org_member(l.org_id))
      )
  )
);

drop policy if exists "locinv_write_via_location_admin" on public.location_inventory;
create policy "locinv_write_via_location_admin"
on public.location_inventory
for all
using (
  exists (
    select 1
    from public.locations l
    where l.id = location_inventory.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.has_org_role(l.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1
    from public.locations l
    where l.id = location_inventory.location_id
      and l.deleted_at is null
      and (
        l.owner_profile_id = auth.uid()
        or (l.org_id is not null and public.has_org_role(l.org_id, array['org_admin','manager']))
      )
  )
);

-- =============================================================================
-- CASES (tenant-scoped columns exist: owner_profile_id OR org_id)
-- =============================================================================
drop policy if exists "cases_select_visible" on public.cases;
create policy "cases_select_visible"
on public.cases
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
);

drop policy if exists "cases_write_owner_or_org_admin" on public.cases;
create policy "cases_write_owner_or_org_admin"
on public.cases
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- =============================================================================
-- CASE_ACCESS_SITES (inherits visibility from case)
-- =============================================================================
drop policy if exists "case_access_sites_select_via_case" on public.case_access_sites;
create policy "case_access_sites_select_via_case"
on public.case_access_sites
for select
using (
  exists (
    select 1 from public.cases c
    where c.id = case_access_sites.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.is_org_member(c.org_id))
      )
  )
);

drop policy if exists "case_access_sites_write_via_case_admin" on public.case_access_sites;
create policy "case_access_sites_write_via_case_admin"
on public.case_access_sites
for all
using (
  exists (
    select 1 from public.cases c
    where c.id = case_access_sites.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_access_sites.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
);

-- =============================================================================
-- CASE_PATHWAYS (inherits visibility from case via case_id)
-- =============================================================================
drop policy if exists "case_pathways_select_via_case" on public.case_pathways;
create policy "case_pathways_select_via_case"
on public.case_pathways
for select
using (
  exists (
    select 1 from public.cases c
    where c.id = case_pathways.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.is_org_member(c.org_id))
      )
  )
);

drop policy if exists "case_pathways_write_via_case_admin" on public.case_pathways;
create policy "case_pathways_write_via_case_admin"
on public.case_pathways
for all
using (
  exists (
    select 1 from public.cases c
    where c.id = case_pathways.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_pathways.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
);

-- =============================================================================
-- CASE_ITEMS_PLANNED / CASE_ITEMS_USED (inherit visibility from case)
-- =============================================================================
drop policy if exists "case_items_planned_select_via_case" on public.case_items_planned;
create policy "case_items_planned_select_via_case"
on public.case_items_planned
for select
using (
  exists (
    select 1 from public.cases c
    where c.id = case_items_planned.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.is_org_member(c.org_id))
      )
  )
);

drop policy if exists "case_items_planned_write_via_case_admin" on public.case_items_planned;
create policy "case_items_planned_write_via_case_admin"
on public.case_items_planned
for all
using (
  exists (
    select 1 from public.cases c
    where c.id = case_items_planned.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_items_planned.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
);

drop policy if exists "case_items_used_select_via_case" on public.case_items_used;
create policy "case_items_used_select_via_case"
on public.case_items_used
for select
using (
  exists (
    select 1 from public.cases c
    where c.id = case_items_used.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.is_org_member(c.org_id))
      )
  )
);

drop policy if exists "case_items_used_write_via_case_admin" on public.case_items_used;
create policy "case_items_used_write_via_case_admin"
on public.case_items_used
for all
using (
  exists (
    select 1 from public.cases c
    where c.id = case_items_used.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
)
with check (
  exists (
    select 1 from public.cases c
    where c.id = case_items_used.case_id
      and c.deleted_at is null
      and (
        c.owner_profile_id = auth.uid()
        or (c.org_id is not null and public.has_org_role(c.org_id, array['org_admin','manager']))
      )
  )
);

-- =============================================================================
-- TEMPLATES
-- =============================================================================
drop policy if exists "templates_select_visible" on public.templates;
create policy "templates_select_visible"
on public.templates
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
);

drop policy if exists "templates_write_owner_or_org_admin" on public.templates;
create policy "templates_write_owner_or_org_admin"
on public.templates
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- =============================================================================
-- EXPORTS
-- =============================================================================
drop policy if exists "exports_select_visible" on public.exports;
create policy "exports_select_visible"
on public.exports
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
);

drop policy if exists "exports_write_owner_or_org_admin" on public.exports;
create policy "exports_write_owner_or_org_admin"
on public.exports
for all
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']))
)
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);

-- =============================================================================
-- AUDIT_LOG (append-only)
-- - select like others
-- - insert allowed like others
-- - no update/delete policies = effectively forbidden
-- =============================================================================
drop policy if exists "audit_select_visible" on public.audit_log;
create policy "audit_select_visible"
on public.audit_log
for select
using (
  (owner_profile_id = auth.uid())
  or (org_id is not null and public.is_org_member(org_id))
);

drop policy if exists "audit_insert_owner_or_org_admin" on public.audit_log;
create policy "audit_insert_owner_or_org_admin"
on public.audit_log
for insert
with check (
  (owner_profile_id = auth.uid() and org_id is null)
  or (org_id is not null and public.has_org_role(org_id, array['org_admin','manager']) and owner_profile_id is null)
);