import { redirect } from 'next/navigation'
import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext } from '@/lib/tenant/context'
import { OrgBootstrapForm } from '@/components/org/OrgBootstrapForm'

/**
 * Organization bootstrap page
 * Allows users to create their first organization
 */
export default async function OrgBootstrapPage() {
  const { user, profile } = await requireAuth()

  if (!profile) {
    redirect('/dashboard')
  }

  // Check if user already has an org
  const tenant = await getTenantContext(user.id)

  if (tenant.mode === 'org') {
    // Already has an org - redirect to dashboard
    redirect('/dashboard')
  }

  return (
    <div className="container mx-auto max-w-2xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create Organization</h1>
        <p className="mt-2 text-muted-foreground">
          Create your first organization to get started with EndoPlan.
        </p>
      </div>

      <OrgBootstrapForm profileId={user.id} />
    </div>
  )
}
