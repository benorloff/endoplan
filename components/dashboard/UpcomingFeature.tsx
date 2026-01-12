import { Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

/**
 * Placeholder component for upcoming features
 */
export function UpcomingFeature() {
  return (
    <Card className="bg-muted/30">
      <CardHeader>
        <CardTitle className="text-base">Upcoming Feature</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" />
          <span className="font-medium">Hospital Inventory Integration</span>
        </div>
        <p className="text-sm text-muted-foreground">
          This feature will be available in a future update.
        </p>
      </CardContent>
    </Card>
  )
}
