/**
 * Core domain types for EndoPlan
 */

export type CaseStatus = 'In Progress' | 'Planned' | 'Completed'

export type ProcedureType = 'SFA Procedure' | 'Iliac Procedure' | 'Tibial Procedure' | 'SFA Intervention'

export interface Case {
  id: string
  caseId: string // Display format: "Case #2143"
  status: CaseStatus
  procedureType: ProcedureType
  createdAt?: Date
  scheduledDate?: Date
  completedAt?: Date
}

export interface CompletedCase {
  caseId: string
  procedureType: ProcedureType
  completedAt: Date
}

// Wizard/Stepper types
export type WizardStep = 'Case Inputs' | 'Diagnostics' | 'Interventions' | 'Devices' | 'Summary'

export interface CaseInputs {
  wireDiameter?: string
  wireLength?: string
  tipConfiguration?: string
  wireStiffness?: string
  coatingType?: string
  ctoCapable?: string
}

export interface WizardState {
  currentStep: number
  caseInputs: CaseInputs
  selectedDevices: unknown[] // Will be typed later
}
