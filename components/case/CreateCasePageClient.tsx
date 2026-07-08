'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateCaseForm } from '@/components/case/CreateCaseForm'
import { CreateCaseSidebar } from '@/components/case/CreateCaseSidebar'
import { LoadDemoDataButton } from '@/components/dev/LoadDemoDataButton'
import { Panel } from '@/components/endoplan'
import { ShellSidebar } from '@/lib/layout/shell-context'
import { useWizardStore } from '@/store/wizard'
import type { LocationRow } from '@/types/db'

interface CreateCasePageClientProps {
  locations: Pick<LocationRow, 'id' | 'name' | 'code'>[]
}

export function CreateCasePageClient({ locations }: CreateCasePageClientProps) {
  const router = useRouter()
  const updateCaseMeta = useWizardStore((s) => s.updateCaseMeta)

  useEffect(() => {
    updateCaseMeta({ planningStatus: 'draft' })
  }, [updateCaseMeta])

  return (
    <>
      <ShellSidebar title="Case Summary">
        <CreateCaseSidebar />
      </ShellSidebar>
      {locations.length === 0 && (
        <Panel className="mb-3 border-clinical-warning/40 bg-clinical-warning/5">
          <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              No hospitals are available for your account. Load demo data to
              test case creation with sample locations and procedures.
            </p>
            <LoadDemoDataButton onSuccess={() => router.refresh()} />
          </div>
        </Panel>
      )}
      <CreateCaseForm locations={locations} />
    </>
  )
}
