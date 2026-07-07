import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext, getTenantFilters } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'

/**
 * Locations list page - tenant-aware
 */
export default async function LocationsPage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()

  const filters = getTenantFilters(tenant)

  // Fetch locations based on tenant context
  const { data: locations, error } = await supabase
    .from('locations')
    .select('*')
    .match(filters)
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching locations:', error)
  }

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Locations</h1>
          <p className="mt-2 text-muted-foreground">
            Manage locations for {tenant.mode === 'org' && tenant.org ? tenant.org.name : 'your cases'}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/locations/new">
            <Plus className="h-5 w-5" />
            Add Location
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Locations</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-destructive">Error loading locations. Please try again.</p>
          ) : !locations || locations.length === 0 ? (
            <p className="text-muted-foreground">No locations found. Create your first location to get started.</p>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => (
                <div key={location.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground">Code: {location.code}</p>
                    {location.notes && (
                      <p className="mt-1 text-sm text-muted-foreground">{location.notes}</p>
                    )}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/locations/${location.id}`}>View</Link>
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
