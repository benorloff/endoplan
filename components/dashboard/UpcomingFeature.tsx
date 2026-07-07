import { Building } from 'lucide-react'
import { Panel, PanelHeader } from '@/components/endoplan'

/**
 * Placeholder component for upcoming features
 */
export function UpcomingFeature() {
  return (
    <Panel>
      <PanelHeader title="Upcoming Feature" />
      <div className="space-y-2 p-3">
        <div className="flex items-center gap-2">
          <Building className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Hospital Inventory Integration</span>
        </div>
        <p className="text-sm text-muted-foreground">
          This feature will be available in a future update.
        </p>
      </div>
    </Panel>
  )
}
