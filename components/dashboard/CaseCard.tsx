'use client'

import Link from 'next/link'
import { Panel, PanelHeader, StatusBadge, SecondaryButton } from '@/components/endoplan'
import type { CaseDbStatus, CaseListItem } from '@/types'
import { formatDate } from '@/lib/format'

interface CaseCardProps {
  case: CaseListItem
}

function statusVariant(status: CaseDbStatus) {
  switch (status) {
    case 'draft':
      return 'draft' as const
    case 'final':
      return 'primary' as const
    case 'performed':
      return 'success' as const
    case 'archived':
      return 'default' as const
    default:
      return 'draft' as const
  }
}

function statusLabel(status: CaseDbStatus): string {
  return status.toUpperCase()
}

/**
 * Card component for displaying a case in the dashboard
 */
export function CaseCard({ case: caseData }: CaseCardProps) {
  const displayDate = caseData.scheduledDate
    ? `Scheduled: ${formatDate(caseData.scheduledDate)}`
    : caseData.createdAt
      ? `Created: ${formatDate(caseData.createdAt)}`
      : ''

  return (
    <Panel nested>
      <PanelHeader
        title={caseData.displayId}
        action={
          <SecondaryButton asChild size="sm">
            <Link href={`/case/create?caseId=${caseData.id}`}>Resume</Link>
          </SecondaryButton>
        }
      />
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <StatusBadge variant={statusVariant(caseData.status)}>
            {statusLabel(caseData.status)}
          </StatusBadge>
          <span className="text-sm text-muted-foreground">
            {caseData.procedureLabel}
          </span>
        </div>
        {caseData.locationName && (
          <p className="text-data-mono text-muted-foreground">
            {caseData.locationName}
          </p>
        )}
        {displayDate && (
          <p className="text-data-mono text-muted-foreground">{displayDate}</p>
        )}
      </div>
    </Panel>
  )
}
