import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CaseSummary } from '@/components/CaseSummary'
import { getMockCase } from '@/lib/mock-data'

export default async function CasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const caseData = getMockCase(id)
  if (!caseData) notFound()

  return (
    <div className="space-y-4">
      <CaseSummary title={caseData.id} status={caseData.status} data={caseData} />
      <Button variant="outline" asChild>
        <Link href="/dashboard">Back to dashboard</Link>
      </Button>
    </div>
  )
}
