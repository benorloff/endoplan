import { create } from 'zustand'
import type { CaseInputs } from '@/types'
import type { PlanningStatus } from '@/lib/layout/case-context'

export interface CaseMeta {
  caseId: string
  patient: string
  procedure: string
  hospital?: string
  planningStatus: PlanningStatus
}

interface WizardStore {
  currentStep: number
  caseInputs: CaseInputs
  caseMeta: CaseMeta
  selectedDevices: unknown[]
  setCurrentStep: (step: number) => void
  updateCaseInputs: (inputs: Partial<CaseInputs>) => void
  updateCaseMeta: (meta: Partial<CaseMeta>) => void
  resetWizard: () => void
}

const initialCaseInputs: CaseInputs = {
  wireDiameter: undefined,
  wireLength: undefined,
  tipConfiguration: undefined,
  wireStiffness: undefined,
  coatingType: undefined,
  ctoCapable: undefined,
}

const initialCaseMeta: CaseMeta = {
  caseId: 'NEW-CASE',
  patient: '—',
  procedure: 'Unassigned',
  hospital: undefined,
  planningStatus: 'draft',
}

/**
 * Zustand store for wizard/stepper state
 */
export const useWizardStore = create<WizardStore>((set) => ({
  currentStep: 0,
  caseInputs: initialCaseInputs,
  caseMeta: initialCaseMeta,
  selectedDevices: [],
  setCurrentStep: (step) => set({ currentStep: step }),
  updateCaseInputs: (inputs) =>
    set((state) => ({
      caseInputs: { ...state.caseInputs, ...inputs },
    })),
  updateCaseMeta: (meta) =>
    set((state) => ({
      caseMeta: { ...state.caseMeta, ...meta },
    })),
  resetWizard: () =>
    set({
      currentStep: 0,
      caseInputs: initialCaseInputs,
      caseMeta: initialCaseMeta,
      selectedDevices: [],
    }),
}))
