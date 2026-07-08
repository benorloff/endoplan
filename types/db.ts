import type { Database } from '@/lib/db.types'

export type { Database, Json } from '@/lib/db.types'

type Tables = Database['public']['Tables']

export type AccessSiteRow = Tables['access_sites']['Row']
export type AccessSiteInsert = Tables['access_sites']['Insert']

export type CaseRow = Tables['cases']['Row']
export type CaseInsert = Tables['cases']['Insert']
export type CaseUpdate = Tables['cases']['Update']

export type CaseAccessSiteRow = Tables['case_access_sites']['Row']
export type CaseAccessSiteInsert = Tables['case_access_sites']['Insert']

export type CasePathwayRow = Tables['case_pathways']['Row']
export type CaseItemPlannedRow = Tables['case_items_planned']['Row']
export type CaseItemUsedRow = Tables['case_items_used']['Row']

export type CatalogItemRow = Tables['catalog_items']['Row']
export type CompatibilityRuleRow = Tables['compatibility_rules']['Row']
export type ContactRow = Tables['contacts']['Row']
export type ExportRow = Tables['exports']['Row']
export type LocationRow = Tables['locations']['Row']
export type LocationInventoryRow = Tables['location_inventory']['Row']
export type OrganizationRow = Tables['organizations']['Row']
export type OrgMemberRow = Tables['org_members']['Row']
export type ProcedureRow = Tables['procedures']['Row']
export type ProfileRow = Tables['profiles']['Row']
export type TemplateRow = Tables['templates']['Row']
