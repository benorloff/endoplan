'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Panel, PanelHeader, StatusBadge, SecondaryButton } from '@/components/endoplan'
import type { Case } from '@/types'
import { formatDate } from '@/lib/format'

interface CaseCardProps {
  case: Case
}

function statusVariant(status: Case['status']) {
  switch (status) {
    case 'In Progress':
      return 'warning' as const
    case 'Planned':
      return 'primary' as const
    case 'Completed':
      return 'success' as const
    default:
      return 'draft' as const
  }
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
    <Panel>
      <PanelHeader
        title={caseData.caseId}
        action={
          <SecondaryButton asChild size="sm">
            <Link href={`/wizard?caseId=${caseData.id}`}>Resume</Link>
          </SecondaryButton>
        }
      />
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <StatusBadge variant={statusVariant(caseData.status)}>
            {caseData.status}
          </StatusBadge>
          <span className="text-sm text-muted-foreground">
            {caseData.procedureType}
          </span>
        </div>
        {displayDate && (
          <p className="text-data-mono text-muted-foreground">{displayDate}</p>
        )}
      </div>
    </Panel>
  )
}
