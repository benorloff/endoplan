import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { CaseStatus, NewCaseInput } from '@/lib/mock-data'

interface CaseSummaryProps {
  title: string
  status?: CaseStatus
  data: NewCaseInput
}

export function CaseSummary({ title, status, data }: CaseSummaryProps) {
  const rows: [string, string][] = [
    ['Patient', `${data.patientInitials}, ${data.patientAge}${data.patientSex}`],
    ['Procedure', data.procedure],
    ['Hospital', data.hospital],
    ['Procedure date', data.procedureDate],
    ['Surgeon', data.surgeon],
    ['Access', data.access],
    ['Notes', data.notes || '—'],
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        {status && <Badge variant="secondary">{status}</Badge>}
      </CardHeader>
      <CardContent>
        <dl className="divide-y text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-3 gap-4 py-2">
              <dt className="text-muted-foreground">{label}</dt>
              <dd className="col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
