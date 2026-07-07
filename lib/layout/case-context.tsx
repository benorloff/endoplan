'use client'

import { createContext, useContext, useState, type ReactNode } from 'react'

export type PlanningStatus =
  | 'draft'
  | 'in-progress'
  | 'complete'
  | 'validated'

export interface CaseContextValue {
  caseId: string
  patient: string
  procedure: string
  hospital?: string
  planningStatus: PlanningStatus
  autosaved: boolean
  userInitials: string
}

interface CaseContextState extends CaseContextValue {
  setCaseContext: (value: Partial<CaseContextValue>) => void
}

const defaultContext: CaseContextValue = {
  caseId: '—',
  patient: '—',
  procedure: 'Unassigned',
  hospital: undefined,
  planningStatus: 'draft',
  autosaved: true,
  userInitials: 'DR',
}

const CaseContext = createContext<CaseContextState | null>(null)

export function CaseContextProvider({
  children,
  initial,
}: {
  children: ReactNode
  initial?: Partial<CaseContextValue>
}) {
  const [context, setContext] = useState<CaseContextValue>({
    ...defaultContext,
    ...initial,
  })

  const setCaseContext = (value: Partial<CaseContextValue>) => {
    setContext((prev) => ({ ...prev, ...value }))
  }

  return (
    <CaseContext.Provider value={{ ...context, setCaseContext }}>
      {children}
    </CaseContext.Provider>
  )
}

export function useCaseContext(): CaseContextState {
  const ctx = useContext(CaseContext)
  if (!ctx) {
    return {
      ...defaultContext,
      setCaseContext: () => {},
    }
  }
  return ctx
}
