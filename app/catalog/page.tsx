import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext, getCatalogFilters } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Catalog items list page - shows personal + org + global items
 */
export default async function CatalogPage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()

  // Build query based on tenant context (personal + org + global for catalog)
  const { data: catalogItems, error } = await supabase
    .from('catalog_items')
    .select('*')
    .or(
      tenant.mode === 'org'
        ? `org_id.eq.${tenant.orgId},org_id.is.null`
        : `owner_profile_id.eq.${tenant.profileId},owner_profile_id.is.null`
    )
    .is('deleted_at', null)
    .eq('active', true)
    .order('category', { ascending: true })
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching catalog items:', error)
  }

  // Group by category
  type CatalogItem = NonNullable<typeof catalogItems>[number]
  const groupedByCategory = catalogItems
    ? catalogItems.reduce((acc, item) => {
        const category = item.category || 'Other'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(item)
        return acc
      }, {} as Record<string, CatalogItem[]>)
    : {}

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Catalog</h1>
        <p className="mt-2 text-muted-foreground">
          Browse catalog items ({tenant.mode === 'org' && tenant.org ? 'org and global' : 'personal and global'}).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Catalog Items</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading catalog items. Please try again.</p>
          ) : Object.keys(groupedByCategory).length === 0 ? (
            <p className="text-muted-foreground">No catalog items found.</p>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedByCategory).map(([category, items]) => (
                <div key={category}>
                  <h2 className="mb-3 text-lg font-semibold">{category}</h2>
                  <div className="space-y-2">
                    {(items as CatalogItem[]).map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div>
                          <p className="font-medium">
                            {[item.vendor, item.brand, item.model].filter(Boolean).join(' ')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {item.sku && `SKU: ${item.sku}`}
                            {item.udi && ` • UDI: ${item.udi}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
