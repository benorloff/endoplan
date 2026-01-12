-- =============================================================================
-- Extensions
-- =============================================================================
create extension if not exists pgcrypto; -- gen_random_uuid()
create extension if not exists pg_trgm;  -- trigram search
create extension if not exists citext;   -- case-insensitive text

-- =============================================================================
-- updated_at trigger helper
-- =============================================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- =============================================================================
-- ORGANIZATIONS + MEMBERSHIP
-- =============================================================================
create table if not exists public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  kind       text null check (kind in ('hospital','asc','clinic','obl','other')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

drop trigger if exists trg_organizations_updated_at on public.organizations;
create trigger trg_organizations_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

-- =============================================================================
-- PROFILES (your app's user record; 1:1 with auth.users)
-- NOTE: auth.users is managed by Supabase Auth.
-- =============================================================================
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          citext null unique,  -- optional convenience cache; keep in sync via trigger
  display_name   text not null default '',
  role           text not null default 'surgeon'
                 check (role in ('admin','surgeon','manager','readonly')),
  status         text not null default 'active'
                 check (status in ('active','disabled')),
  default_org_id uuid null references public.organizations(id),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

-- =============================================================================
-- Auto-create profile on auth signup
-- Magic links will create auth.users row; this creates the matching profile.
-- =============================================================================
create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', '')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

-- Optional: keep profiles.email synced if auth.users.email changes
create or replace function public.handle_auth_user_email_update()
returns trigger
language plpgsql
security definer
as $$
begin
  update public.profiles
     set email = new.email
   where id = new.id;
  return new;
end;
$$;

drop trigger if exists on_auth_user_email_updated on auth.users;
create trigger on_auth_user_email_updated
after update of email on auth.users
for each row execute function public.handle_auth_user_email_update();

-- =============================================================================
-- ORG MEMBERS (many profiles per org)
-- =============================================================================
create table if not exists public.org_members (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  role       text not null check (role in ('org_admin','surgeon','manager','readonly')),
  invited_by uuid null references public.profiles(id),
  created_at timestamptz not null default now(),
  unique (org_id, profile_id)
);

create index if not exists idx_org_members_profile on public.org_members(profile_id);
create index if not exists idx_org_members_org     on public.org_members(org_id);

-- =============================================================================
-- PROCEDURES (tenant-owned OR global)
-- =============================================================================
create table if not exists public.procedures (
  id             uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id         uuid null references public.organizations(id),
  -- global allowed (both null)
  code           text not null,
  name           text not null,
  defaults       jsonb null,
  active         boolean not null default true,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz null,
  constraint procedures_owner_xor_org_or_global check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null) or
    (owner_profile_id is null and org_id is null)
  )
);

drop trigger if exists trg_procedures_updated_at on public.procedures;
create trigger trg_procedures_updated_at
before update on public.procedures
for each row execute function public.set_updated_at();

create unique index if not exists uq_proc_profile_code
  on public.procedures(owner_profile_id, code)
  where owner_profile_id is not null and deleted_at is null;

create unique index if not exists uq_proc_org_code
  on public.procedures(org_id, code)
  where org_id is not null and deleted_at is null;

create unique index if not exists uq_proc_global_code
  on public.procedures(code)
  where owner_profile_id is null and org_id is null and deleted_at is null;

-- =============================================================================
-- LOCATIONS (tenant-owned only: profile OR org)
-- =============================================================================
create table if not exists public.locations (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  code             text not null,
  name             text not null,
  notes            text null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz null,
  constraint locations_owner_xor_org check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null)
  )
);

drop trigger if exists trg_locations_updated_at on public.locations;
create trigger trg_locations_updated_at
before update on public.locations
for each row execute function public.set_updated_at();

create unique index if not exists uq_loc_profile_code
  on public.locations(owner_profile_id, code)
  where owner_profile_id is not null and deleted_at is null;

create unique index if not exists uq_loc_org_code
  on public.locations(org_id, code)
  where org_id is not null and deleted_at is null;

-- =============================================================================
-- CONTACTS (per location)
-- =============================================================================
create table if not exists public.contacts (
  id          uuid primary key default gen_random_uuid(),
  location_id uuid not null references public.locations(id) on delete cascade,
  name        text not null,
  email       citext null,
  phone       text null,
  role        text null,
  is_primary  boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

drop trigger if exists trg_contacts_updated_at on public.contacts;
create trigger trg_contacts_updated_at
before update on public.contacts
for each row execute function public.set_updated_at();

create index if not exists idx_contacts_location on public.contacts(location_id);

-- =============================================================================
-- ACCESS_SITES (tenant-owned OR global)
-- =============================================================================
create table if not exists public.access_sites (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  -- global allowed
  code             text null, -- e.g., "L-CFA"
  name             text not null,
  vessel_system    text null, -- arterial|venous
  vessel_name      text null,
  segment          text null,
  supports_side    text not null default 'LR'
                   check (supports_side in ('L','R','LR','midline')),
  default_method   text null,
  synonyms         text[] not null default '{}'::text[],
  notes            text null,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz null,
  constraint access_sites_owner_xor_org_or_global check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null) or
    (owner_profile_id is null and org_id is null)
  )
);

drop trigger if exists trg_access_sites_updated_at on public.access_sites;
create trigger trg_access_sites_updated_at
before update on public.access_sites
for each row execute function public.set_updated_at();

create unique index if not exists uq_as_profile_name
  on public.access_sites(owner_profile_id, name)
  where owner_profile_id is not null and deleted_at is null;

create unique index if not exists uq_as_org_name
  on public.access_sites(org_id, name)
  where org_id is not null and deleted_at is null;

create unique index if not exists uq_as_global_name
  on public.access_sites(name)
  where owner_profile_id is null and org_id is null and deleted_at is null;

create index if not exists idx_as_trgm_name
  on public.access_sites using gin (name gin_trgm_ops);

-- =============================================================================
-- CATALOG_ITEMS (tenant-owned OR global)
-- barcode/UPC/EAN/GTIN stored as TEXT to preserve leading zeros
-- =============================================================================
create table if not exists public.catalog_items (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  -- global allowed
  category         text not null,
  vendor           text null,
  brand            text null,
  model            text null,
  sku              text null,
  udi              text null,
  barcode          text null,
  attributes       jsonb not null default '{}'::jsonb,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz null,
  constraint catalog_items_owner_xor_org_or_global check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null) or
    (owner_profile_id is null and org_id is null)
  )
);

drop trigger if exists trg_catalog_items_updated_at on public.catalog_items;
create trigger trg_catalog_items_updated_at
before update on public.catalog_items
for each row execute function public.set_updated_at();

create unique index if not exists uq_cat_profile_composite
  on public.catalog_items(
    owner_profile_id, category,
    coalesce(vendor,''), coalesce(brand,''), coalesce(model,''), coalesce(sku,'')
  )
  where owner_profile_id is not null and deleted_at is null;

create unique index if not exists uq_cat_org_composite
  on public.catalog_items(
    org_id, category,
    coalesce(vendor,''), coalesce(brand,''), coalesce(model,''), coalesce(sku,'')
  )
  where org_id is not null and deleted_at is null;

create unique index if not exists uq_cat_global_composite
  on public.catalog_items(
    category,
    coalesce(vendor,''), coalesce(brand,''), coalesce(model,''), coalesce(sku,'')
  )
  where owner_profile_id is null and org_id is null and deleted_at is null;

create index if not exists idx_catalog_items_trgm_model
  on public.catalog_items using gin (model gin_trgm_ops);

create index if not exists idx_catalog_items_trgm_sku
  on public.catalog_items using gin (sku gin_trgm_ops);

create index if not exists idx_catalog_items_attrs
  on public.catalog_items using gin (attributes);

-- =============================================================================
-- LOCATION_INVENTORY (per location)
-- =============================================================================
create table if not exists public.location_inventory (
  id               uuid primary key default gen_random_uuid(),
  location_id      uuid not null references public.locations(id) on delete cascade,
  catalog_item_id  uuid not null references public.catalog_items(id) on delete cascade,
  stock_status     text not null default 'unknown'
                   check (stock_status in ('in_stock','low','out','unknown')),
  par_min          integer null check (par_min is null or par_min >= 0),
  is_favorite      boolean not null default false,
  notes            text null,
  last_verified_at timestamptz null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  unique (location_id, catalog_item_id)
);

drop trigger if exists trg_location_inventory_updated_at on public.location_inventory;
create trigger trg_location_inventory_updated_at
before update on public.location_inventory
for each row execute function public.set_updated_at();

create index if not exists idx_locinv_faves
  on public.location_inventory(location_id, is_favorite desc);

-- =============================================================================
-- CASES (tenant-owned: profile OR org)
-- =============================================================================
create table if not exists public.cases (
  id                uuid primary key default gen_random_uuid(),
  owner_profile_id  uuid null references public.profiles(id),
  org_id            uuid null references public.organizations(id),
  location_id       uuid not null references public.locations(id),
  procedure_id      uuid null references public.procedures(id),
  patient_height_cm numeric(5,2) null,
  status            text not null default 'draft'
                    check (status in ('draft','final','performed','archived')),
  created_by        uuid not null references public.profiles(id),
  updated_by        uuid null references public.profiles(id),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  finalized_at      timestamptz null,
  performed_at      timestamptz null,
  deleted_at        timestamptz null,
  constraint cases_owner_xor_org check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null)
  )
);

drop trigger if exists trg_cases_updated_at on public.cases;
create trigger trg_cases_updated_at
before update on public.cases
for each row execute function public.set_updated_at();

create index if not exists idx_cases_location on public.cases(location_id);
create index if not exists idx_cases_procedure on public.cases(procedure_id);

-- Ensure case tenant matches location tenant (guard)
create or replace function public.guard_case_location_tenant()
returns trigger
language plpgsql
as $$
declare loc_owner uuid;
declare loc_org   uuid;
begin
  select owner_profile_id, org_id into loc_owner, loc_org
  from public.locations
  where id = new.location_id;

  if new.owner_profile_id is not null then
    if loc_owner is distinct from new.owner_profile_id or loc_org is not null then
      raise exception 'Case owner_profile_id must match location owner and location must not be org-owned';
    end if;
  end if;

  if new.org_id is not null then
    if loc_org is distinct from new.org_id or loc_owner is not null then
      raise exception 'Case org_id must match location org and location must not be profile-owned';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_case_location_tenant on public.cases;
create trigger trg_guard_case_location_tenant
before insert or update on public.cases
for each row execute function public.guard_case_location_tenant();

-- =============================================================================
-- CASE_ACCESS_SITES (per-case instances; refs ACCESS_SITES optional)
-- =============================================================================
create table if not exists public.case_access_sites (
  id               uuid primary key default gen_random_uuid(),
  case_id          uuid not null references public.cases(id) on delete cascade,
  access_site_id   uuid null references public.access_sites(id), -- nullable for free-text
  side             text null check (side in ('L','R','M')),
  resolved_label   text null, -- snapshot of catalog name or typed label
  vessel           text null,
  method           text null,
  planned_sheath_id uuid null references public.catalog_items(id),
  sheath_fr        numeric(4,1) null,
  sheath_length_cm numeric(6,2) null,
  notes            text null,
  idx              integer not null default 1,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

drop trigger if exists trg_case_access_sites_updated_at on public.case_access_sites;
create trigger trg_case_access_sites_updated_at
before update on public.case_access_sites
for each row execute function public.set_updated_at();

create index if not exists idx_case_access_sites_case on public.case_access_sites(case_id);

-- Optional laterality guard based on selected catalog access_site
create or replace function public.guard_case_access_site_laterality()
returns trigger
language plpgsql
as $$
declare ap_side text;
begin
  if new.access_site_id is null or new.side is null then
    return new;
  end if;

  select supports_side into ap_side from public.access_sites where id = new.access_site_id;

  if ap_side = 'midline' and new.side <> 'M' then
    raise exception 'Selected access site is midline-only';
  elsif ap_side = 'L' and new.side <> 'L' then
    raise exception 'Selected access site supports left side only';
  elsif ap_side = 'R' and new.side <> 'R' then
    raise exception 'Selected access site supports right side only';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_guard_case_access_site_laterality on public.case_access_sites;
create trigger trg_guard_case_access_site_laterality
before insert or update on public.case_access_sites
for each row execute function public.guard_case_access_site_laterality();

-- =============================================================================
-- CASE_PATHWAYS (links to per-case access site instance)
-- =============================================================================
create table if not exists public.case_pathways (
  id                      uuid primary key default gen_random_uuid(),
  case_id                 uuid not null references public.cases(id) on delete cascade,
  access_site_instance_id uuid not null references public.case_access_sites(id) on delete cascade,
  name                    text not null, -- A/B/C or custom
  target_lesion           text null,
  up_and_over             boolean not null default false,
  idx                     integer not null default 1,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

drop trigger if exists trg_case_pathways_updated_at on public.case_pathways;
create trigger trg_case_pathways_updated_at
before update on public.case_pathways
for each row execute function public.set_updated_at();

create index if not exists idx_case_pathways_case on public.case_pathways(case_id);
create index if not exists idx_case_pathways_access_instance on public.case_pathways(access_site_instance_id);

-- =============================================================================
-- PLANNED + USED ITEMS
-- =============================================================================
create table if not exists public.case_items_planned (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references public.cases(id) on delete cascade,
  pathway_id      uuid null references public.case_pathways(id) on delete set null,
  catalog_item_id uuid not null references public.catalog_items(id),
  quantity        integer not null default 1 check (quantity > 0),
  required        boolean not null default true,
  rationale       text null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_case_items_planned_updated_at on public.case_items_planned;
create trigger trg_case_items_planned_updated_at
before update on public.case_items_planned
for each row execute function public.set_updated_at();

create index if not exists idx_case_items_planned_case on public.case_items_planned(case_id);
create index if not exists idx_case_items_planned_pathway on public.case_items_planned(pathway_id);

create table if not exists public.case_items_used (
  id              uuid primary key default gen_random_uuid(),
  case_id         uuid not null references public.cases(id) on delete cascade,
  catalog_item_id uuid not null references public.catalog_items(id),
  quantity        integer not null default 1 check (quantity > 0),
  source          text not null check (source in ('planned','added')),
  note            text null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

drop trigger if exists trg_case_items_used_updated_at on public.case_items_used;
create trigger trg_case_items_used_updated_at
before update on public.case_items_used
for each row execute function public.set_updated_at();

create index if not exists idx_case_items_used_case on public.case_items_used(case_id);

-- =============================================================================
-- TEMPLATES (tenant-owned: profile OR org)
-- =============================================================================
create table if not exists public.templates (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  procedure_id     uuid null references public.procedures(id),
  name             text not null,
  scope            text not null check (scope in ('personal','public')),
  version          integer not null default 1,
  payload          jsonb not null,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  deleted_at       timestamptz null,
  constraint templates_owner_xor_org check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null)
  )
);

drop trigger if exists trg_templates_updated_at on public.templates;
create trigger trg_templates_updated_at
before update on public.templates
for each row execute function public.set_updated_at();

create unique index if not exists uq_tpl_profile_name_version
  on public.templates(owner_profile_id, name, version)
  where owner_profile_id is not null and deleted_at is null;

create unique index if not exists uq_tpl_org_name_version
  on public.templates(org_id, name, version)
  where org_id is not null and deleted_at is null;

-- =============================================================================
-- COMPATIBILITY_RULES (tenant-owned OR global)
-- =============================================================================
create table if not exists public.compatibility_rules (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  -- global allowed
  rule_type        text not null,
  lhs_attr         text not null,
  op               text not null, -- <=, >=, =, in, between
  rhs              text not null, -- attr key OR JSON-encoded literal
  severity         text not null check (severity in ('hard','warn')),
  message          text not null,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint rules_owner_xor_org_or_global check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null) or
    (owner_profile_id is null and org_id is null)
  )
);

drop trigger if exists trg_compatibility_rules_updated_at on public.compatibility_rules;
create trigger trg_compatibility_rules_updated_at
before update on public.compatibility_rules
for each row execute function public.set_updated_at();

-- =============================================================================
-- EXPORTS (tenant-owned: profile OR org)
-- =============================================================================
create table if not exists public.exports (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  case_id          uuid not null references public.cases(id) on delete cascade,
  kind             text not null check (kind in ('pdf','csv')),
  storage_key      text not null,
  expires_at       timestamptz null,
  created_by       uuid not null references public.profiles(id),
  created_at       timestamptz not null default now(),
  constraint exports_owner_xor_org check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null)
  )
);

create index if not exists idx_exports_case on public.exports(case_id);

-- =============================================================================
-- AUDIT_LOG (tenant-owned: profile OR org)
-- =============================================================================
create table if not exists public.audit_log (
  id               uuid primary key default gen_random_uuid(),
  owner_profile_id uuid null references public.profiles(id),
  org_id           uuid null references public.organizations(id),
  actor_profile_id uuid null references public.profiles(id),
  entity_table     text not null,
  entity_id        uuid not null,
  action           text not null,
  before           jsonb null,
  after            jsonb null,
  context          jsonb null,
  created_at       timestamptz not null default now(),
  constraint audit_owner_xor_org check (
    (owner_profile_id is not null and org_id is null) or
    (owner_profile_id is null and org_id is not null)
  )
);

create index if not exists idx_audit_entity
  on public.audit_log(
    coalesce(owner_profile_id, '00000000-0000-0000-0000-000000000000'::uuid),
    coalesce(org_id, '00000000-0000-0000-0000-000000000000'::uuid),
    entity_table, entity_id, created_at desc
  );