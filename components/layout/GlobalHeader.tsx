'use client'

import { Bell, Cloud, Settings } from 'lucide-react'
import { useCaseContext, type PlanningStatus } from '@/lib/layout/case-context'
import { IconButton } from '@/components/endoplan/IconButton'
import { cn } from '@/lib/utils'

const STATUS_LABELS: Record<PlanningStatus, string> = {
  draft: 'DRAFT',
  'in-progress': 'PLANNING IN PROGRESS',
  complete: 'PLANNING COMPLETE',
  validated: 'VALIDATED',
}

const STATUS_STYLES: Record<PlanningStatus, string> = {
  draft: 'text-muted-foreground',
  'in-progress': 'text-clinical-warning',
  complete: 'text-clinical-success',
  validated: 'text-clinical-success',
}

interface MetadataFieldProps {
  label: string
  value: string
  className?: string
}

function MetadataField({ label, value, className }: MetadataFieldProps) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-label-caps text-muted-foreground">{label}</span>
      <span className={cn('text-sm font-medium text-foreground', className)}>
        {value}
      </span>
    </div>
  )
}

export function GlobalHeader() {
  const {
    caseId,
    patient,
    procedure,
    hospital,
    planningStatus,
    autosaved,
    userInitials,
  } = useCaseContext()

  return (
    <header className="flex h-12 shrink-0 items-center justify-between border-b border-outline-variant bg-surface-container-lowest px-3">
      <div className="flex items-center gap-6">
        <span className="text-base font-semibold tracking-tight text-foreground">
          EndoPlan
        </span>

        <div className="hidden items-center gap-5 md:flex">
          <MetadataField label="Case ID" value={caseId} />
          <MetadataField label="Patient" value={patient} />
          <MetadataField label="Procedure" value={procedure} />
          {hospital && (
            <MetadataField label="Hospital" value={hospital} />
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            'hidden text-label-caps sm:inline',
            STATUS_STYLES[planningStatus]
          )}
        >
          {STATUS_LABELS[planningStatus]}
        </span>

        {autosaved && (
          <span className="hidden items-center gap-1.5 text-label-caps text-muted-foreground sm:flex">
            <Cloud className="size-3" />
            Autosaved
          </span>
        )}

        <IconButton aria-label="Notifications" size="sm">
          <Bell className="size-4" />
        </IconButton>

        <IconButton aria-label="Settings" size="sm">
          <Settings className="size-4" />
        </IconButton>

        <div
          className="flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          aria-label="User profile"
        >
          {userInitials}
        </div>
      </div>
    </header>
  )
}
