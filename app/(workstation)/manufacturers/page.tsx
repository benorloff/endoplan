import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'
import { Panel, PanelHeader } from '@/components/endoplan'
import { StatusBadge } from '@/components/endoplan/StatusBadge'

export default async function ManufacturersPage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()

  const { data: catalogItems, error } = await supabase
    .from('catalog_items')
    .select('vendor, brand')
    .or(
      tenant.mode === 'org'
        ? `org_id.eq.${tenant.orgId},org_id.is.null`
        : `owner_profile_id.eq.${tenant.profileId},owner_profile_id.is.null`
    )
    .is('deleted_at', null)
    .eq('active', true)

  const manufacturers = catalogItems
    ? [...new Set(catalogItems.map((item) => item.vendor).filter(Boolean))].sort()
    : []

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Manufacturers</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Vendors and manufacturers from your device catalog.
        </p>
      </div>

      <Panel>
        <PanelHeader
          title="Registered Manufacturers"
          subtitle={`${manufacturers.length} vendors in catalog`}
        />
        <div className="p-3">
          {error ? (
            <p className="text-sm text-clinical-critical">
              Error loading manufacturers. Please try again.
            </p>
          ) : manufacturers.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No manufacturers found. Add devices to your catalog to populate this list.
            </p>
          ) : (
            <ul className="divide-y divide-outline-variant">
              {manufacturers.map((vendor) => (
                <li
                  key={vendor}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <span className="font-medium">{vendor}</span>
                  <StatusBadge variant="success">In Catalog</StatusBadge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Panel>
    </div>
  )
}
