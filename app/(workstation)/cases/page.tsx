import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import {
  Panel,
  PanelHeader,
  PrimaryButton,
  SecondaryButton,
  StatusBadge,
} from '@/components/endoplan'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext, getTenantFilters } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/format'

function caseStatusVariant(status: string) {
  const lower = status.toLowerCase()
  if (lower.includes('complete') || lower.includes('validated')) return 'success' as const
  if (lower.includes('progress') || lower.includes('planning')) return 'warning' as const
  if (lower.includes('draft')) return 'draft' as const
  return 'default' as const
}

/**
 * Cases list page - tenant-aware
 */
export default async function CasesPage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()

  const filters = getTenantFilters(tenant)

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
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold tracking-tight">Cases</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View and manage cases for{' '}
            {tenant.mode === 'org' && tenant.org ? tenant.org.name : 'your organization'}
          </p>
        </div>
        <PrimaryButton asChild>
          <Link href="/wizard">
            <Plus className="size-4" />
            Create New Case
          </Link>
        </PrimaryButton>
      </div>

      <Panel>
        <PanelHeader
          title="All Cases"
          subtitle={cases ? `${cases.length} records` : undefined}
        />
        <div className="p-3">
          {error ? (
            <p className="text-sm text-clinical-critical">
              Error loading cases. Please try again.
            </p>
          ) : !cases || cases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No cases found. Create your first case to get started.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {cases.map((caseItem) => (
                <li
                  key={caseItem.id}
                  className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">
                        {caseItem.locations?.name || 'Unknown Location'}
                      </span>
                      <StatusBadge variant={caseStatusVariant(caseItem.status)}>
                        {caseItem.status}
                      </StatusBadge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {caseItem.procedures?.name || caseItem.procedures?.code || 'No procedure'}
                    </p>
                    <p className="text-data-mono text-muted-foreground">
                      Created: {formatDate(new Date(caseItem.created_at))}
                    </p>
                  </div>
                  <SecondaryButton asChild size="sm">
                    <Link href={`/cases/${caseItem.id}`}>View</Link>
                  </SecondaryButton>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </div>
  )
}
