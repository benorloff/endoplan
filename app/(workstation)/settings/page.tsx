import { requireAuth } from '@/lib/auth/get-user'
import { getTenantContext } from '@/lib/tenant/context'
import { Panel, PanelHeader } from '@/components/endoplan'
import { StatusBadge } from '@/components/endoplan/StatusBadge'

export default async function SettingsPage() {
  const { user, profile } = await requireAuth()
  const tenant = await getTenantContext(user.id)

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account and workstation preferences.
        </p>
      </div>

      <Panel>
        <PanelHeader title="Account" />
        <div className="space-y-3 p-3 text-sm">
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <span className="text-label-caps text-muted-foreground">Email</span>
            <span>{user.email}</span>
          </div>
          <div className="flex items-center justify-between border-b border-outline-variant pb-2">
            <span className="text-label-caps text-muted-foreground">Display Name</span>
            <span>{profile?.display_name ?? '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-label-caps text-muted-foreground">Organization</span>
            <StatusBadge variant="primary">
              {tenant.mode === 'org' && tenant.org ? tenant.org.name : 'Personal'}
            </StatusBadge>
          </div>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Workstation" />
        <div className="space-y-3 p-3 text-sm text-muted-foreground">
          <p>Cloud sync, autosave, and notification preferences will be configurable here.</p>
        </div>
      </Panel>
    </div>
  )
}
