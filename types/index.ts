/**
 * Core types for EndoPlan
 */

export type {
  Database,
  Json,
  AccessSiteRow,
  CaseRow,
  CaseInsert,
  CaseUpdate,
  CaseAccessSiteRow,
  CaseAccessSiteInsert,
  ProcedureRow,
  LocationRow,
  CatalogItemRow,
  ProfileRow,
} from '@/types/db'

export type {
  Patient,
  PatientSex,
  ProcedureCode,
  AccessSide,
  AccessSupportsSide,
  AccessSelectionKey,
  AccessStrategyOption,
  CaseAccessSiteDraft,
  CreateCaseForm,
  DevicePlanInputs,
  CaseListItem,
  CompletedCaseListItem,
  WorkflowStep,
} from '@/types/domain'

export type {
  CaseDbStatus,
  OrgKind,
  ProfileRole,
  OrgMemberRole,
  CaseItemUsedSource,
  CompatibilitySeverity,
  LocationStockStatus,
  ExportKind,
  TemplateScope,
} from '@/types/enums'

export {
  CASE_DB_STATUSES,
  PROCEDURE_CODES,
  ACCESS_SELECTION_KEYS,
  PATIENT_SEX_VALUES,
} from '@/types/enums'

import type {
  CaseListItem,
  CompletedCaseListItem,
  DevicePlanInputs,
  WorkflowStep,
  ProcedureCode,
  AccessSelectionKey,
} from '@/types/domain'

/** @deprecated Use CaseListItem */
export type Case = CaseListItem

/** @deprecated Use CompletedCaseListItem */
export type CompletedCase = CompletedCaseListItem

/** @deprecated Use DevicePlanInputs */
export type CaseInputs = DevicePlanInputs

/** @deprecated Use WorkflowStep */
export type WizardStep = WorkflowStep

/** @deprecated Use ProcedureCode */
export type ProcedureOption = ProcedureCode

/** @deprecated Use AccessSelectionKey */
export type AccessStrategy = AccessSelectionKey
