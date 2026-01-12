import { create } from 'zustand'
import type { CaseInputs } from '@/types'

interface WizardStore {
  currentStep: number
  caseInputs: CaseInputs
  selectedDevices: unknown[]
  setCurrentStep: (step: number) => void
  updateCaseInputs: (inputs: Partial<CaseInputs>) => void
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

/**
 * Zustand store for wizard/stepper state
 */
export const useWizardStore = create<WizardStore>((set) => ({
  currentStep: 0,
  caseInputs: initialCaseInputs,
  selectedDevices: [],
  setCurrentStep: (step) => set({ currentStep: step }),
  updateCaseInputs: (inputs) =>
    set((state) => ({
      caseInputs: { ...state.caseInputs, ...inputs },
    })),
  resetWizard: () =>
    set({
      currentStep: 0,
      caseInputs: initialCaseInputs,
      selectedDevices: [],
    }),
}))
