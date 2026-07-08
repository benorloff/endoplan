/** `cases.status` check constraint values */
export const CASE_DB_STATUSES = [
  'draft',
  'final',
  'performed',
  'archived',
] as const

export type CaseDbStatus = (typeof CASE_DB_STATUSES)[number]

export const ORG_KINDS = ['hospital', 'asc', 'clinic', 'obl', 'other'] as const
export type OrgKind = (typeof ORG_KINDS)[number]

export const PROFILE_ROLES = ['admin', 'surgeon', 'manager', 'readonly'] as const
export type ProfileRole = (typeof PROFILE_ROLES)[number]

export const ORG_MEMBER_ROLES = [
  'org_admin',
  'surgeon',
  'manager',
  'readonly',
] as const
export type OrgMemberRole = (typeof ORG_MEMBER_ROLES)[number]

export const CASE_ITEM_USED_SOURCES = ['planned', 'added'] as const
export type CaseItemUsedSource = (typeof CASE_ITEM_USED_SOURCES)[number]

export const COMPATIBILITY_SEVERITIES = ['hard', 'warn'] as const
export type CompatibilitySeverity = (typeof COMPATIBILITY_SEVERITIES)[number]

export const LOCATION_STOCK_STATUSES = [
  'in_stock',
  'low',
  'out',
  'unknown',
] as const
export type LocationStockStatus = (typeof LOCATION_STOCK_STATUSES)[number]

export const EXPORT_KINDS = ['pdf', 'csv'] as const
export type ExportKind = (typeof EXPORT_KINDS)[number]

export const TEMPLATE_SCOPES = ['personal', 'public'] as const
export type TemplateScope = (typeof TEMPLATE_SCOPES)[number]

export const PROCEDURE_CODES = [
  'EVAR',
  'TEVAR',
  'FEVAR',
  'BRANCHED_EVAR',
] as const

export const ACCESS_SELECTION_KEYS = [
  'bilateral-cfa',
  'right-cfa',
  'left-cfa',
] as const

export const PATIENT_SEX_VALUES = ['M', 'F'] as const
