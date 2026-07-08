import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext, getTenantFilters } from '@/lib/tenant/context'
import { createClient } from '@/lib/supabase/server'
import { CreateCasePageClient } from '@/components/case/CreateCasePageClient'

export default async function CreateCasePage() {
  const { user } = await requireAuth()
  const tenant = await getTenantContext(user.id)
  const supabase = await createClient()
  const filters = getTenantFilters(tenant)

  const { data: locations } = await supabase
    .from('locations')
    .select('id, name, code')
    .match(filters)
    .is('deleted_at', null)
    .order('name', { ascending: true })

  return <CreateCasePageClient locations={locations ?? []} />
}
