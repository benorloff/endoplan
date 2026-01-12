import { create } from 'zustand'

interface DashboardStore {
  selectedCaseId: string | null
  setSelectedCaseId: (caseId: string | null) => void
}

/**
 * Zustand store for dashboard state
 */
export const useDashboardStore = create<DashboardStore>((set) => ({
  selectedCaseId: null,
  setSelectedCaseId: (caseId) => set({ selectedCaseId: caseId }),
}))
