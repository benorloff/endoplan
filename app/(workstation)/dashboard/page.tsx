import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CaseCard } from '@/components/dashboard/CaseCard'
import { CompletedCasesTable } from '@/components/dashboard/CompletedCasesTable'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { UpcomingFeature } from '@/components/dashboard/UpcomingFeature'
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

  // Check if user needs to create an org
  const tenant = await getTenantContext(user.id)
  if (!tenant.org) {
    // No org yet - could redirect to bootstrap, but for now show dashboard
    // In the future, you might want to redirect: redirect('/org/bootstrap')
  }

  const inProgressCases = mockCases.filter(
    (c) => c.status === 'In Progress' || c.status === 'Planned'
  )

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Begin a new procedure plan or resume an active case.
          </p>
          {tenant.mode === 'org' && tenant.org && (
            <p className="mt-1 text-sm text-muted-foreground">
              Organization: {tenant.org.name}
            </p>
          )}
        </div>
        <Button asChild size="lg">
          <Link href="/wizard">
            <Plus className="h-5 w-5" />
            Create New Case
          </Link>
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Upcoming / In-Progress Cases */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              Upcoming / In-Progress Cases
            </h2>
            <div className="space-y-4">
              {inProgressCases.map((caseData) => (
                <CaseCard key={caseData.id} case={caseData} />
              ))}
            </div>
          </div>

          {/* Recent Completed Cases */}
          <div>
            <h2 className="mb-4 text-xl font-semibold">Recent Completed Cases</h2>
            <Card>
              <CardContent className="p-0">
                <CompletedCasesTable cases={mockCompletedCases} />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <QuickActions />
          <UpcomingFeature />
        </div>
      </div>
    </div>
  )
}
