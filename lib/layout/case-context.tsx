'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

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

function contextsEqual(
  a: CaseContextValue,
  b: CaseContextValue
): boolean {
  return (
    a.caseId === b.caseId &&
    a.patient === b.patient &&
    a.procedure === b.procedure &&
    a.hospital === b.hospital &&
    a.planningStatus === b.planningStatus &&
    a.autosaved === b.autosaved &&
    a.userInitials === b.userInitials
  )
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

  const setCaseContext = useCallback((value: Partial<CaseContextValue>) => {
    setContext((prev) => {
      const next = { ...prev, ...value }
      return contextsEqual(prev, next) ? prev : next
    })
  }, [])

  const providerValue = useMemo(
    () => ({ ...context, setCaseContext }),
    [context, setCaseContext]
  )

  return (
    <CaseContext.Provider value={providerValue}>
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
