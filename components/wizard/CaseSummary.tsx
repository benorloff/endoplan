'use client'

import { Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CaseSummaryProps {
  procedureType: string
  vesselDiameter?: string
  lesionLength?: string
  calcification?: string
  ctoPresent?: boolean
  onEdit?: () => void
}

/**
 * Case summary sidebar component
 */
export function CaseSummary({
  procedureType,
  vesselDiameter,
  lesionLength,
  calcification,
  ctoPresent,
  onEdit,
}: CaseSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Procedure Type
          </p>
          <p className="mt-1 text-base">{procedureType}</p>
        </div>

        {vesselDiameter && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Vessel Diameter
            </p>
            <p className="mt-1 text-base">{vesselDiameter}</p>
          </div>
        )}

        {lesionLength && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Lesion Length
            </p>
            <p className="mt-1 text-base">{lesionLength}</p>
          </div>
        )}

        {calcification && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Calcification
            </p>
            <p className="mt-1 text-base">{calcification}</p>
          </div>
        )}

        {ctoPresent !== undefined && (
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              CTO Present
            </p>
            <p className="mt-1 text-base">{ctoPresent ? 'Yes' : 'No'}</p>
          </div>
        )}

        {onEdit && (
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={onEdit}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Edit Inputs
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
