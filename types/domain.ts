/**
 * EndoPlan domain model — aligned with the clinical data model spec
 * and mapped to `public.*` tables in Supabase.
 */

import type { CaseDbStatus } from '@/types/enums'

/** Patient attributes — maps to `cases.patient_*` columns. */
export interface Patient {
  /** Optional external ID / MRN → `cases.patient_external_id` */
  externalId?: string
  initials?: string
  age?: number
  sex?: PatientSex
  heightCm?: number
  weightKg?: number
  bmi?: number
}

export type PatientSex = 'M' | 'F'

/** Procedure catalog code — maps to `procedures.code`. */
export type ProcedureCode = 'EVAR' | 'TEVAR' | 'FEVAR' | 'BRANCHED_EVAR'

/** `case_access_sites.side` */
export type AccessSide = 'L' | 'R' | 'M'

/** `access_sites.supports_side` */
export type AccessSupportsSide = 'L' | 'R' | 'LR' | 'midline'

/**
 * UI access strategy presets — expanded into `case_access_sites` rows on save.
 * Bilateral CFA typically creates two rows (L + R) referencing CFA access sites.
 */
export type AccessSelectionKey = 'bilateral-cfa' | 'right-cfa' | 'left-cfa'

export interface AccessStrategyOption {
  key: AccessSelectionKey
  label: string
  resolvedLabel: string
  vessel: string
  sides: AccessSide[]
  /** Catalog `access_sites.code` values used when persisting */
  accessSiteCodes: string[]
  defaultMethod?: string
}

/** Draft access site instance before a case is persisted. */
export interface CaseAccessSiteDraft {
  accessSiteId?: string | null
  resolvedLabel: string
  side: AccessSide | null
  vessel?: string | null
  method?: string | null
  idx: number
}

/**
 * Create-case workflow form state.
 * Maps to `cases`, `case_access_sites`, and in-memory patient data.
 */
export interface CreateCaseForm {
  patientExternalId: string
  patientInitials: string
  patientAge: string
  patientSex: PatientSex | ''
  patientHeightCm: string
  patientWeightKg: string
  locationId: string | null
  procedureCode: ProcedureCode
  procedureId: string | null
  procedureDate: string
  operatingPhysician: string
  accessSelection: AccessSelectionKey
}

/** Guidewire / device-plan inputs (procedural plan — guidewire category). */
export interface DevicePlanInputs {
  wireDiameter?: string
  wireLength?: string
  tipConfiguration?: string
  wireStiffness?: string
  coatingType?: string
  ctoCapable?: string
}

/** Dashboard / list view model (not a direct table row). */
export interface CaseListItem {
  id: string
  displayId: string
  status: CaseDbStatus
  procedureLabel: string
  locationName?: string
  createdAt?: Date
  scheduledDate?: Date
  performedAt?: Date
}

export interface CompletedCaseListItem {
  displayId: string
  procedureLabel: string
  completedAt: Date
}

export type WorkflowStep =
  | 'Case Inputs'
  | 'Diagnostics'
  | 'Interventions'
  | 'Devices'
  | 'Summary'
