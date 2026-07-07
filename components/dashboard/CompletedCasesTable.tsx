'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/endoplan'
import type { CompletedCase } from '@/types'
import { formatDate } from '@/lib/format'

interface CompletedCasesTableProps {
  cases: CompletedCase[]
}

/**
 * Table component for displaying completed cases
 */
export function CompletedCasesTable({ cases }: CompletedCasesTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-outline-variant hover:bg-transparent">
          <TableHead className="text-label-caps text-muted-foreground">Case ID</TableHead>
          <TableHead className="text-label-caps text-muted-foreground">Procedure Type</TableHead>
          <TableHead className="text-label-caps text-muted-foreground">Completion Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((caseData) => (
          <TableRow key={caseData.caseId} className="border-outline-variant">
            <TableCell className="text-sm font-medium">{caseData.caseId}</TableCell>
            <TableCell className="text-sm">{caseData.procedureType}</TableCell>
            <TableCell className="text-data-mono text-muted-foreground">
              {formatDate(caseData.completedAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
