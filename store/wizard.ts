import { create } from 'zustand'
import type { CreateCaseForm, DevicePlanInputs } from '@/types'
import type { PlanningStatus } from '@/lib/layout/case-context'
import {
  patientDisplayLabel,
  procedureCodeToLabel,
} from '@/lib/case/mappers'

export interface CaseMeta {
  caseId: string
  patient: string
  procedure: string
  hospital?: string
  planningStatus: PlanningStatus
}

interface WizardStore {
  currentStep: number
  devicePlan: DevicePlanInputs
  createCaseForm: CreateCaseForm
  caseMeta: CaseMeta
  activeCaseId: string | null
  selectedDevices: unknown[]
  setCurrentStep: (step: number) => void
  updateDevicePlan: (inputs: Partial<DevicePlanInputs>) => void
  /** @deprecated Use updateDevicePlan */
  updateCaseInputs: (inputs: Partial<DevicePlanInputs>) => void
  updateCreateCaseForm: (form: Partial<CreateCaseForm>) => void
  updateCaseMeta: (meta: Partial<CaseMeta>) => void
  setActiveCaseId: (caseId: string | null) => void
  resetWizard: () => void
}

const initialDevicePlan: DevicePlanInputs = {
  wireDiameter: undefined,
  wireLength: undefined,
  tipConfiguration: undefined,
  wireStiffness: undefined,
  coatingType: undefined,
  ctoCapable: undefined,
}

const initialCreateCaseForm: CreateCaseForm = {
  patientExternalId: '',
  patientInitials: '',
  patientAge: '',
  patientSex: '',
  patientHeightCm: '',
  patientWeightKg: '',
  locationId: null,
  procedureCode: 'EVAR',
  procedureId: null,
  procedureDate: '',
  operatingPhysician: '',
  accessSelection: 'bilateral-cfa',
}

const initialCaseMeta: CaseMeta = {
  caseId: 'NEW-CASE',
  patient: '—',
  procedure: 'EVAR',
  hospital: 'PENDING',
  planningStatus: 'draft',
}

function deriveCaseMetaFromForm(form: CreateCaseForm): Partial<CaseMeta> {
  return {
    caseId: 'NEW-CASE',
    patient: patientDisplayLabel({
      initials: form.patientInitials.trim() || undefined,
      externalId: form.patientExternalId.trim() || undefined,
    }),
    procedure: procedureCodeToLabel(form.procedureCode),
    hospital: form.locationId ? undefined : 'PENDING',
    planningStatus: 'draft',
  }
}

/**
 * Zustand store for case workflow state
 */
export const useWizardStore = create<WizardStore>((set) => ({
  currentStep: 0,
  devicePlan: initialDevicePlan,
  createCaseForm: initialCreateCaseForm,
  caseMeta: initialCaseMeta,
  activeCaseId: null,
  selectedDevices: [],
  setCurrentStep: (step) => set({ currentStep: step }),
  updateDevicePlan: (inputs) =>
    set((state) => ({
      devicePlan: { ...state.devicePlan, ...inputs },
    })),
  updateCaseInputs: (inputs) =>
    set((state) => ({
      devicePlan: { ...state.devicePlan, ...inputs },
    })),
  updateCreateCaseForm: (form) =>
    set((state) => {
      const nextForm = { ...state.createCaseForm, ...form }
      return {
        createCaseForm: nextForm,
        caseMeta: { ...state.caseMeta, ...deriveCaseMetaFromForm(nextForm) },
      }
    }),
  updateCaseMeta: (meta) =>
    set((state) => ({
      caseMeta: { ...state.caseMeta, ...meta },
    })),
  setActiveCaseId: (caseId) => set({ activeCaseId: caseId }),
  resetWizard: () =>
    set({
      currentStep: 0,
      devicePlan: initialDevicePlan,
      createCaseForm: initialCreateCaseForm,
      caseMeta: initialCaseMeta,
      activeCaseId: null,
      selectedDevices: [],
    }),
}))
