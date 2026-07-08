import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/db.types'
import type { TenantContext } from '@/lib/tenant/context'
import { SEED_IDS } from '@/lib/seed/constants'

type AdminClient = SupabaseClient<Database>

/**
 * Idempotently upserts global catalog + demo org data.
 * Uses service role — server only.
 */
export async function upsertGlobalCatalog(admin: AdminClient) {
  const procedures = [
    { id: SEED_IDS.procedures.evar, code: 'EVAR', name: 'Endovascular Aneurysm Repair' },
    { id: SEED_IDS.procedures.tevar, code: 'TEVAR', name: 'Thoracic Endovascular Aneurysm Repair' },
    { id: SEED_IDS.procedures.fevar, code: 'FEVAR', name: 'Fenestrated Endovascular Aneurysm Repair' },
    {
      id: SEED_IDS.procedures.branchedEvar,
      code: 'BRANCHED_EVAR',
      name: 'Branched Endovascular Aneurysm Repair',
    },
  ]

  for (const proc of procedures) {
    const { error } = await admin.from('procedures').upsert(
      { ...proc, defaults: { category: 'aortic' }, active: true },
      { onConflict: 'id' }
    )
    if (error) throw error
  }

  const accessSites = [
    {
      id: SEED_IDS.accessSites.cfa,
      code: 'CFA',
      name: 'Common Femoral Artery',
      vessel_system: 'arterial',
      vessel_name: 'Femoral',
      segment: 'Common',
      supports_side: 'LR',
      default_method: 'percutaneous',
      synonyms: ['bilateral CFA', 'CFA'],
      active: true,
    },
    {
      id: SEED_IDS.accessSites.rightCfa,
      code: 'R-CFA',
      name: 'Right Common Femoral Artery',
      vessel_system: 'arterial',
      vessel_name: 'Femoral',
      segment: 'Common',
      supports_side: 'R',
      default_method: 'percutaneous',
      synonyms: ['right CFA'],
      active: true,
    },
    {
      id: SEED_IDS.accessSites.leftCfa,
      code: 'L-CFA',
      name: 'Left Common Femoral Artery',
      vessel_system: 'arterial',
      vessel_name: 'Femoral',
      segment: 'Common',
      supports_side: 'L',
      default_method: 'percutaneous',
      synonyms: ['left CFA'],
      active: true,
    },
  ]

  for (const site of accessSites) {
    const { error } = await admin.from('access_sites').upsert(site, { onConflict: 'id' })
    if (error) throw error
  }

  const catalogItems = [
    {
      id: SEED_IDS.catalog.guidewire,
      category: 'guidewire',
      vendor: 'Terumo',
      brand: 'Glidewire',
      model: 'GT-R350',
      sku: 'GW-TER-GT350',
      attributes: { diameter_in: 0.035, length_cm: 260, coating: 'hydrophilic' },
      active: true,
    },
    {
      id: SEED_IDS.catalog.sheath,
      category: 'sheath',
      vendor: 'Cook',
      brand: 'Flexor',
      model: 'Ankle Introducer 7Fr',
      sku: 'SH-COOK-FLX7',
      attributes: { french: 7, length_cm: 45 },
      active: true,
    },
    {
      id: SEED_IDS.catalog.stentGraft,
      category: 'stent_graft',
      vendor: 'Gore',
      brand: 'Excluder',
      model: 'AAA Device 28mm',
      sku: 'SG-GORE-EX28',
      attributes: { diameter_mm: 28, length_mm: 120 },
      active: true,
    },
  ]

  for (const item of catalogItems) {
    const { error } = await admin.from('catalog_items').upsert(item, { onConflict: 'id' })
    if (error) throw error
  }
}

export async function upsertDemoOrg(admin: AdminClient) {
  const { error: orgError } = await admin.from('organizations').upsert(
    {
      id: SEED_IDS.org.demoHospital,
      name: 'St. Jude Medical Center (Demo)',
      kind: 'hospital',
    },
    { onConflict: 'id' }
  )
  if (orgError) throw orgError

  const locations = [
    {
      id: SEED_IDS.locations.stJudeMain,
      org_id: SEED_IDS.org.demoHospital,
      owner_profile_id: null,
      code: 'SJMC-MAIN',
      name: 'St. Jude Medical Center',
      notes: 'Main campus — demo seed location',
    },
    {
      id: SEED_IDS.locations.stJudeWest,
      org_id: SEED_IDS.org.demoHospital,
      owner_profile_id: null,
      code: 'SJMC-WEST',
      name: 'St. Jude West Campus',
      notes: 'West tower — demo seed location',
    },
  ]

  for (const location of locations) {
    const { error } = await admin.from('locations').upsert(location, { onConflict: 'id' })
    if (error) throw error
  }

  const inventory = [
    {
      location_id: SEED_IDS.locations.stJudeMain,
      catalog_item_id: SEED_IDS.catalog.guidewire,
      stock_status: 'in_stock' as const,
      par_min: 5,
      is_favorite: true,
    },
    {
      location_id: SEED_IDS.locations.stJudeMain,
      catalog_item_id: SEED_IDS.catalog.sheath,
      stock_status: 'in_stock' as const,
      par_min: 3,
      is_favorite: false,
    },
    {
      location_id: SEED_IDS.locations.stJudeMain,
      catalog_item_id: SEED_IDS.catalog.stentGraft,
      stock_status: 'low' as const,
      par_min: 2,
      is_favorite: true,
    },
  ]

  for (const row of inventory) {
    const { error } = await admin.from('location_inventory').upsert(row, {
      onConflict: 'location_id,catalog_item_id',
    })
    if (error) throw error
  }
}

/**
 * Links the signed-in user to the demo org so seeded locations are visible.
 */
export async function linkProfileToDemoOrg(
  admin: AdminClient,
  profileId: string
) {
  const { error: memberError } = await admin.from('org_members').upsert(
    {
      org_id: SEED_IDS.org.demoHospital,
      profile_id: profileId,
      role: 'org_admin',
    },
    { onConflict: 'org_id,profile_id' }
  )
  if (memberError) throw memberError

  const { error: profileError } = await admin
    .from('profiles')
    .update({ default_org_id: SEED_IDS.org.demoHospital })
    .eq('id', profileId)

  if (profileError) throw profileError
}

export async function upsertDemoCases(admin: AdminClient, profileId: string) {
  const cases = [
    {
      id: SEED_IDS.cases.draftEvar,
      org_id: SEED_IDS.org.demoHospital,
      owner_profile_id: null,
      location_id: SEED_IDS.locations.stJudeMain,
      procedure_id: SEED_IDS.procedures.evar,
      patient_initials: 'J.D.',
      patient_external_id: 'MRN-10042',
      patient_age: 68,
      patient_sex: 'M',
      patient_height_cm: 178,
      patient_weight_kg: 82,
      procedure_date: '2026-07-15',
      operating_physician: 'Dr. Chen',
      planning_physician_id: profileId,
      status: 'draft' as const,
      created_by: profileId,
      updated_by: profileId,
    },
    {
      id: SEED_IDS.cases.draftTevar,
      org_id: SEED_IDS.org.demoHospital,
      owner_profile_id: null,
      location_id: SEED_IDS.locations.stJudeWest,
      procedure_id: SEED_IDS.procedures.tevar,
      patient_initials: 'M.R.',
      patient_age: 72,
      patient_sex: 'F',
      patient_height_cm: 165,
      patient_weight_kg: 70,
      procedure_date: '2026-07-22',
      operating_physician: 'Dr. Patel',
      planning_physician_id: profileId,
      status: 'draft' as const,
      created_by: profileId,
      updated_by: profileId,
    },
  ]

  for (const row of cases) {
    const { error } = await admin.from('cases').upsert(row, { onConflict: 'id' })
    if (error) throw error
  }
}

export async function runDemoSeed(admin: AdminClient, profileId?: string) {
  await upsertGlobalCatalog(admin)
  await upsertDemoOrg(admin)
  if (profileId) {
    await linkProfileToDemoOrg(admin, profileId)
    await upsertDemoCases(admin, profileId)
  }
}
