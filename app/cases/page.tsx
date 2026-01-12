import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext, getTenantFilters } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/format'

/**
 * Cases list page - tenant-aware
 */
export default async function CasesPage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()

  const filters = getTenantFilters(tenant)

  // Fetch cases based on tenant context
  const { data: cases, error } = await supabase
    .from('cases')
    .select('*, locations(name, code), procedures(code, name)')
    .match(filters)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching cases:', error)
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Cases</h1>
          <p className="mt-2 text-muted-foreground">
            View and manage cases for {tenant.mode === 'org' && tenant.org ? tenant.org.name : 'your organization'}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/wizard">
            <Plus className="h-5 w-5" />
            Create New Case
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Cases</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading cases. Please try again.</p>
          ) : !cases || cases.length === 0 ? (
            <p className="text-muted-foreground">No cases found. Create your first case to get started.</p>
          ) : (
            <div className="space-y-4">
              {cases.map((caseItem: any) => (
                <div
                  key={caseItem.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">
                        {caseItem.locations?.name || 'Unknown Location'}
                      </h3>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                        {caseItem.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {caseItem.procedures?.name || caseItem.procedures?.code || 'No procedure'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Created: {formatDate(new Date(caseItem.created_at))}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/cases/${caseItem.id}`}>View</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
