'use client'

import { useRouter } from 'next/navigation'
import { Panel, PanelHeader } from '@/components/endoplan'
import { LoadDemoDataButton } from '@/components/dev/LoadDemoDataButton'

/**
 * Development utilities surfaced in Settings (non-production workflows).
 */
export function DevToolsPanel() {
  const router = useRouter()

  return (
    <Panel>
      <PanelHeader title="Development" />
      <div className="space-y-3 p-3 text-sm">
        <p className="text-muted-foreground">
          Load the demo hospital, global procedure catalog, sample devices, and
          draft cases. Links your account to the demo organization.
        </p>
        <LoadDemoDataButton onSuccess={() => router.refresh()} />
      </div>
    </Panel>
  )
}
