'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
        <TableRow>
          <TableHead>Case ID</TableHead>
          <TableHead>Procedure Type</TableHead>
          <TableHead>Completion Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cases.map((caseData) => (
          <TableRow key={caseData.caseId}>
            <TableCell className="font-medium">{caseData.caseId}</TableCell>
            <TableCell>{caseData.procedureType}</TableCell>
            <TableCell>{formatDate(caseData.completedAt)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
