import type {
  AccessSelectionKey,
  AccessStrategyOption,
  CaseAccessSiteDraft,
  CreateCaseForm,
  Patient,
  ProcedureCode,
} from '@/types/domain'
import type { CaseAccessSiteInsert, CaseInsert } from '@/types/db'

export const PROCEDURE_OPTIONS: {
  code: ProcedureCode
  label: string
}[] = [
  { code: 'EVAR', label: 'EVAR' },
  { code: 'TEVAR', label: 'TEVAR' },
  { code: 'FEVAR', label: 'FEVAR' },
  { code: 'BRANCHED_EVAR', label: 'Branched EVAR' },
]

export const ACCESS_STRATEGY_OPTIONS: AccessStrategyOption[] = [
  {
    key: 'bilateral-cfa',
    label: 'Bilateral CFA',
    resolvedLabel: 'Common Femoral Artery',
    vessel: 'CFA',
    sides: ['L', 'R'],
    accessSiteCodes: ['CFA'],
  },
  {
    key: 'right-cfa',
    label: 'Right CFA',
    resolvedLabel: 'Right Common Femoral Artery',
    vessel: 'CFA',
    sides: ['R'],
    accessSiteCodes: ['R-CFA'],
  },
  {
    key: 'left-cfa',
    label: 'Left CFA',
    resolvedLabel: 'Left Common Femoral Artery',
    vessel: 'CFA',
    sides: ['L'],
    accessSiteCodes: ['L-CFA'],
  },
]

export function procedureCodeToLabel(code: ProcedureCode): string {
  return PROCEDURE_OPTIONS.find((p) => p.code === code)?.label ?? code
}

export function accessSelectionToLabel(key: AccessSelectionKey): string {
  const option = ACCESS_STRATEGY_OPTIONS.find((o) => o.key === key)
  if (!option) return key
  if (key === 'bilateral-cfa') return 'BILATERAL'
  if (key === 'right-cfa') return 'RIGHT CFA'
  return 'LEFT CFA'
}

export function createCaseFormToPatient(form: CreateCaseForm): Patient {
  return {
    externalId: form.patientExternalId.trim() || undefined,
    initials: form.patientInitials.trim() || undefined,
    age: form.patientAge ? Number(form.patientAge) : undefined,
    sex: form.patientSex || undefined,
    heightCm: form.patientHeightCm ? Number(form.patientHeightCm) : undefined,
    weightKg: form.patientWeightKg ? Number(form.patientWeightKg) : undefined,
    bmi:
      form.patientHeightCm && form.patientWeightKg
        ? computeBmi(Number(form.patientWeightKg), Number(form.patientHeightCm))
        : undefined,
  }
}

export function computeBmi(weightKg: number, heightCm: number): number | undefined {
  if (heightCm <= 0) return undefined
  const heightM = heightCm / 100
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10
}

export interface CaseInsertContext {
  createdBy: string
  ownerProfileId?: string | null
  orgId?: string | null
  planningPhysicianId?: string | null
}

/**
 * Maps create-case form state to a `cases` insert row.
 */
export function createCaseFormToCaseInsert(
  form: CreateCaseForm,
  ctx: CaseInsertContext
): CaseInsert {
  const patient = createCaseFormToPatient(form)

  if (!form.locationId) {
    throw new Error('locationId is required to create a case')
  }

  return {
    location_id: form.locationId,
    procedure_id: form.procedureId,
    patient_initials: patient.initials ?? null,
    patient_external_id: patient.externalId ?? null,
    patient_age: patient.age ?? null,
    patient_sex: patient.sex ?? null,
    patient_height_cm: patient.heightCm ?? null,
    patient_weight_kg: patient.weightKg ?? null,
    procedure_date: form.procedureDate || null,
    operating_physician: form.operatingPhysician.trim() || null,
    planning_physician_id: ctx.planningPhysicianId ?? null,
    status: 'draft',
    created_by: ctx.createdBy,
    updated_by: ctx.createdBy,
    owner_profile_id: ctx.ownerProfileId ?? null,
    org_id: ctx.orgId ?? null,
  }
}

/**
 * Expands the UI access selection into `case_access_sites` insert rows.
 */
export function createCaseFormToAccessSiteInserts(
  form: CreateCaseForm,
  caseId: string,
  accessSiteIds: Record<string, string> = {}
): CaseAccessSiteInsert[] {
  const option = ACCESS_STRATEGY_OPTIONS.find((o) => o.key === form.accessSelection)
  if (!option) return []

  const primaryCode = option.accessSiteCodes[0]

  return option.sides.map((side, index) => ({
    case_id: caseId,
    access_site_id: primaryCode ? accessSiteIds[primaryCode] ?? null : null,
    side,
    resolved_label: option.resolvedLabel,
    vessel: option.vessel,
    method: option.defaultMethod ?? 'percutaneous',
    idx: index + 1,
  }))
}

export function createCaseFormToAccessSiteDrafts(
  form: CreateCaseForm
): CaseAccessSiteDraft[] {
  const option = ACCESS_STRATEGY_OPTIONS.find((o) => o.key === form.accessSelection)
  if (!option) return []

  return option.sides.map((side, index) => ({
    resolvedLabel: option.resolvedLabel,
    side,
    vessel: option.vessel,
    method: option.defaultMethod ?? 'percutaneous',
    idx: index + 1,
  }))
}

export function patientDisplayLabel(patient: Patient): string {
  if (patient.initials) return patient.initials
  if (patient.externalId) return patient.externalId
  return '—'
}

export function formatPatientAgeSex(patient: Patient): string {
  const parts: string[] = []
  if (patient.age !== undefined) parts.push(String(patient.age))
  if (patient.sex) parts.push(patient.sex)
  return parts.length > 0 ? parts.join('') : '—'
}
