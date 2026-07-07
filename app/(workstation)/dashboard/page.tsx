import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CaseCard } from '@/components/dashboard/CaseCard'
import { CompletedCasesTable } from '@/components/dashboard/CompletedCasesTable'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { UpcomingFeature } from '@/components/dashboard/UpcomingFeature'
import {
  MetricCard,
  Panel,
  PanelHeader,
  PrimaryButton,
} from '@/components/endoplan'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext } from '@/lib/tenant/context'
import { mockCases, mockCompletedCases } from '@/lib/mock-data'

/**
 * Dashboard page - main landing page for the application
 * Protected route - requires authentication
 */
export default async function DashboardPage() {
  const { user, profile } = await requireAuth()

  if (!profile) {
    redirect('/sign-in')
  }

  const tenant = await getTenantContext(user.id)

  const inProgressCases = mockCases.filter(
    (c) => c.status === 'In Progress' || c.status === 'Planned'
  )

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Begin a new procedure plan or resume an active case.
          </p>
          {tenant.mode === 'org' && tenant.org && (
            <p className="mt-1 text-data-mono text-muted-foreground">
              Org: {tenant.org.name}
            </p>
          )}
        </div>
        <PrimaryButton asChild>
          <Link href="/wizard">
            <Plus className="size-4" />
            Create New Case
          </Link>
        </PrimaryButton>
      </div>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <MetricCard label="Active Cases" value={String(inProgressCases.length)} />
        <MetricCard
          label="Completed"
          value={String(mockCompletedCases.length)}
        />
        <MetricCard label="Planned" value={String(mockCases.filter((c) => c.status === 'Planned').length)} />
        <MetricCard label="In Progress" value={String(mockCases.filter((c) => c.status === 'In Progress').length)} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Panel>
            <PanelHeader title="Upcoming / In-Progress Cases" />
            <div className="space-y-2 p-3">
              {inProgressCases.map((caseData) => (
                <CaseCard key={caseData.id} case={caseData} />
              ))}
            </div>
          </Panel>

          <Panel>
            <PanelHeader title="Recent Completed Cases" />
            <CompletedCasesTable cases={mockCompletedCases} />
          </Panel>
        </div>

        <div className="space-y-4">
          <QuickActions />
          <UpcomingFeature />
        </div>
      </div>
    </div>
  )
}
