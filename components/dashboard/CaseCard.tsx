'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Case } from '@/types'
import { formatDate } from '@/lib/format'

interface CaseCardProps {
  case: Case
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
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold">{caseData.caseId}</h3>
            <Badge variant="secondary">{caseData.status}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {caseData.procedureType}
          </p>
        </div>
        <Button asChild variant="default" size="sm">
          <Link href={`/wizard?caseId=${caseData.id}`}>Resume</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{displayDate}</p>
      </CardContent>
    </Card>
  )
}
