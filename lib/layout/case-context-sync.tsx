'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useShallow } from 'zustand/react/shallow'
import { useCaseContext } from '@/lib/layout/case-context'
import { useWizardStore } from '@/store/wizard'

interface CaseContextSyncProps {
  userInitials: string
}

const IDLE_CONTEXT = {
  caseId: '—',
  patient: '—',
  procedure: 'Unassigned',
  hospital: undefined as string | undefined,
  planningStatus: 'draft' as const,
}

/**
 * Syncs header case metadata from wizard store on workflow routes,
 * or resets to idle values elsewhere.
 */
export function CaseContextSync({ userInitials }: CaseContextSyncProps) {
  const pathname = usePathname()
  const { setCaseContext } = useCaseContext()
  const caseMeta = useWizardStore(
    useShallow((s) => ({
      caseId: s.caseMeta.caseId,
      patient: s.caseMeta.patient,
      procedure: s.caseMeta.procedure,
      hospital: s.caseMeta.hospital,
      planningStatus: s.caseMeta.planningStatus,
    }))
  )

  useEffect(() => {
    if (pathname.startsWith('/wizard')) {
      setCaseContext({
        ...caseMeta,
        userInitials,
        autosaved: true,
      })
      return
    }

    setCaseContext({
      ...IDLE_CONTEXT,
      userInitials,
      autosaved: true,
    })
  }, [
    pathname,
    caseMeta.caseId,
    caseMeta.patient,
    caseMeta.procedure,
    caseMeta.hospital,
    caseMeta.planningStatus,
    userInitials,
    setCaseContext,
  ])

  return null
}
