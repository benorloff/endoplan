import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { mockCases } from '@/lib/mock-data'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Cases</h1>
        <Button asChild>
          <Link href="/cases/new">New case</Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Patient</TableHead>
            <TableHead>Procedure</TableHead>
            <TableHead>Hospital</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockCases.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <Link href={`/cases/${c.id}`} className="font-medium underline">
                  {c.id}
                </Link>
              </TableCell>
              <TableCell>{c.patientInitials}</TableCell>
              <TableCell>{c.procedure}</TableCell>
              <TableCell>{c.hospital}</TableCell>
              <TableCell>{c.procedureDate}</TableCell>
              <TableCell>
                <Badge variant="secondary">{c.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
