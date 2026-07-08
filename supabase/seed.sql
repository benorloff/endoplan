-- =============================================================================
-- EndoPlan seed data — global catalog + demo organization
-- Run via: supabase db reset (local) or npm run db:seed (linked remote)
-- =============================================================================

-- Global procedures
insert into public.procedures (id, code, name, defaults, active)
values
  ('b0000001-0000-4000-8000-000000000001', 'EVAR', 'Endovascular Aneurysm Repair', '{"category":"aortic"}', true),
  ('b0000002-0000-4000-8000-000000000001', 'TEVAR', 'Thoracic Endovascular Aneurysm Repair', '{"category":"aortic"}', true),
  ('b0000003-0000-4000-8000-000000000001', 'FEVAR', 'Fenestrated Endovascular Aneurysm Repair', '{"category":"aortic"}', true),
  ('b0000004-0000-4000-8000-000000000001', 'BRANCHED_EVAR', 'Branched Endovascular Aneurysm Repair', '{"category":"aortic"}', true)
on conflict (id) do update set
  code = excluded.code,
  name = excluded.name,
  defaults = excluded.defaults,
  active = excluded.active;

-- Global vascular access sites
insert into public.access_sites (
  id, code, name, vessel_system, vessel_name, segment, supports_side, default_method, synonyms, active
)
values
  (
    'c0000001-0000-4000-8000-000000000001',
    'CFA',
    'Common Femoral Artery',
    'arterial',
    'Femoral',
    'Common',
    'LR',
    'percutaneous',
    array['bilateral CFA', 'CFA'],
    true
  ),
  (
    'c0000002-0000-4000-8000-000000000001',
    'R-CFA',
    'Right Common Femoral Artery',
    'arterial',
    'Femoral',
    'Common',
    'R',
    'percutaneous',
    array['right CFA'],
    true
  ),
  (
    'c0000003-0000-4000-8000-000000000001',
    'L-CFA',
    'Left Common Femoral Artery',
    'arterial',
    'Femoral',
    'Common',
    'L',
    'percutaneous',
    array['left CFA'],
    true
  )
on conflict (id) do update set
  code = excluded.code,
  name = excluded.name,
  vessel_system = excluded.vessel_system,
  vessel_name = excluded.vessel_name,
  supports_side = excluded.supports_side,
  default_method = excluded.default_method,
  synonyms = excluded.synonyms,
  active = excluded.active;

-- Global catalog items (sample devices)
insert into public.catalog_items (
  id, category, vendor, brand, model, sku, attributes, active
)
values
  (
    'd0000001-0000-4000-8000-000000000001',
    'guidewire',
    'Terumo',
    'Glidewire',
    'GT-R350',
    'GW-TER-GT350',
    '{"diameter_in": 0.035, "length_cm": 260, "coating": "hydrophilic"}',
    true
  ),
  (
    'd0000002-0000-4000-8000-000000000001',
    'sheath',
    'Cook',
    'Flexor',
    'Ankle Introducer 7Fr',
    'SH-COOK-FLX7',
    '{"french": 7, "length_cm": 45}',
    true
  ),
  (
    'd0000003-0000-4000-8000-000000000001',
    'stent_graft',
    'Gore',
    'Excluder',
    'AAA Device 28mm',
    'SG-GORE-EX28',
    '{"diameter_mm": 28, "length_mm": 120}',
    true
  )
on conflict (id) do update set
  category = excluded.category,
  vendor = excluded.vendor,
  brand = excluded.brand,
  model = excluded.model,
  sku = excluded.sku,
  attributes = excluded.attributes,
  active = excluded.active;

-- Demo hospital organization + locations (org-owned; link users via /api/dev/seed)
insert into public.organizations (id, name, kind)
values (
  'a0000001-0000-4000-8000-000000000001',
  'St. Jude Medical Center (Demo)',
  'hospital'
)
on conflict (id) do update set
  name = excluded.name,
  kind = excluded.kind;

insert into public.locations (id, org_id, owner_profile_id, code, name, notes)
values
  (
    'a0000002-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000001',
    null,
    'SJMC-MAIN',
    'St. Jude Medical Center',
    'Main campus — demo seed location'
  ),
  (
    'a0000003-0000-4000-8000-000000000001',
    'a0000001-0000-4000-8000-000000000001',
    null,
    'SJMC-WEST',
    'St. Jude West Campus',
    'West tower — demo seed location'
  )
on conflict (id) do update set
  org_id = excluded.org_id,
  code = excluded.code,
  name = excluded.name,
  notes = excluded.notes;

-- Org-scoped inventory for demo locations
insert into public.location_inventory (location_id, catalog_item_id, stock_status, par_min, is_favorite)
values
  ('a0000002-0000-4000-8000-000000000001', 'd0000001-0000-4000-8000-000000000001', 'in_stock', 5, true),
  ('a0000002-0000-4000-8000-000000000001', 'd0000002-0000-4000-8000-000000000001', 'in_stock', 3, false),
  ('a0000002-0000-4000-8000-000000000001', 'd0000003-0000-4000-8000-000000000001', 'low', 2, true),
  ('a0000003-0000-4000-8000-000000000001', 'd0000001-0000-4000-8000-000000000001', 'in_stock', 4, false)
on conflict (location_id, catalog_item_id) do update set
  stock_status = excluded.stock_status,
  par_min = excluded.par_min,
  is_favorite = excluded.is_favorite;
