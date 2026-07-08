'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, RotateCcw, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { devicePlanSchema } from '@/schemas/device-plan'
import { useWizardStore } from '@/store/wizard'

interface CaseInputsFormProps {
  onContinue: () => void
}

/**
 * Case inputs form component for wizard step 1
 */
export function CaseInputsForm({ onContinue }: CaseInputsFormProps) {
  const { devicePlan, updateDevicePlan } = useWizardStore()
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    wireDiameter: devicePlan.wireDiameter || '',
    wireLength: devicePlan.wireLength || '',
    tipConfiguration: devicePlan.tipConfiguration || '',
    wireStiffness: devicePlan.wireStiffness || '',
    coatingType: devicePlan.coatingType || '',
    ctoCapable: devicePlan.ctoCapable || 'Any',
  })

  // Validate form data
  const validate = () => {
    const result = devicePlanSchema.safeParse(formData)
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          newErrors[issue.path[0] as string] = issue.message
        }
      })
      setErrors(newErrors)
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      updateDevicePlan(formData)
      onContinue()
    }
  }

  const handleReset = () => {
    const resetData = {
      wireDiameter: '',
      wireLength: '',
      tipConfiguration: '',
      wireStiffness: '',
      coatingType: '',
      ctoCapable: 'Any',
    }
    setFormData(resetData)
    setErrors({})
  }

  const isFormValid = () => {
    return (
      formData.wireDiameter &&
      formData.wireLength &&
      formData.tipConfiguration &&
      formData.wireStiffness &&
      formData.coatingType
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Case Inputs</CardTitle>
              <CardDescription className="mt-1">
                Specify guidewire requirements to filter compatible options.
              </CardDescription>
            </div>
            <span className="text-sm text-muted-foreground">Step 1 of 5</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Form Fields */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="wireDiameter">Wire Diameter (inches)</Label>
              <Select
                value={formData.wireDiameter}
                onValueChange={(value) =>
                  setFormData({ ...formData, wireDiameter: value })
                }
              >
                <SelectTrigger id="wireDiameter">
                  <SelectValue placeholder="Select diameter..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.014">0.014"</SelectItem>
                  <SelectItem value="0.018">0.018"</SelectItem>
                  <SelectItem value="0.035">0.035"</SelectItem>
                </SelectContent>
              </Select>
              {errors.wireDiameter && (
                <p className="text-sm text-destructive">
                  {errors.wireDiameter}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wireLength">Wire Length (cm)</Label>
              <Select
                value={formData.wireLength}
                onValueChange={(value) =>
                  setFormData({ ...formData, wireLength: value })
                }
              >
                <SelectTrigger id="wireLength">
                  <SelectValue placeholder="Select length..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">150 cm</SelectItem>
                  <SelectItem value="180">180 cm</SelectItem>
                  <SelectItem value="200">200 cm</SelectItem>
                  <SelectItem value="260">260 cm</SelectItem>
                </SelectContent>
              </Select>
              {errors.wireLength && (
                <p className="text-sm text-destructive">{errors.wireLength}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tipConfiguration">Tip Configuration</Label>
              <Select
                value={formData.tipConfiguration}
                onValueChange={(value) =>
                  setFormData({ ...formData, tipConfiguration: value })
                }
              >
                <SelectTrigger id="tipConfiguration">
                  <SelectValue placeholder="Select tip type..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Straight">Straight</SelectItem>
                  <SelectItem value="Angled">Angled</SelectItem>
                  <SelectItem value="J-tip">J-tip</SelectItem>
                </SelectContent>
              </Select>
              {errors.tipConfiguration && (
                <p className="text-sm text-destructive">
                  {errors.tipConfiguration}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="wireStiffness">Wire Stiffness</Label>
              <Select
                value={formData.wireStiffness}
                onValueChange={(value) =>
                  setFormData({ ...formData, wireStiffness: value })
                }
              >
                <SelectTrigger id="wireStiffness">
                  <SelectValue placeholder="Select stiffness..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Soft">Soft</SelectItem>
                  <SelectItem value="Standard">Standard</SelectItem>
                  <SelectItem value="Stiff">Stiff</SelectItem>
                </SelectContent>
              </Select>
              {errors.wireStiffness && (
                <p className="text-sm text-destructive">
                  {errors.wireStiffness}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coatingType">Coating Type</Label>
              <Select
                value={formData.coatingType}
                onValueChange={(value) =>
                  setFormData({ ...formData, coatingType: value })
                }
              >
                <SelectTrigger id="coatingType">
                  <SelectValue placeholder="Select coating..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Hydrophilic">Hydrophilic</SelectItem>
                  <SelectItem value="Non-hydrophilic">Non-hydrophilic</SelectItem>
                </SelectContent>
              </Select>
              {errors.coatingType && (
                <p className="text-sm text-destructive">{errors.coatingType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ctoCapable">CTO Capable</Label>
              <Select
                value={formData.ctoCapable}
                onValueChange={(value) =>
                  setFormData({ ...formData, ctoCapable: value })
                }
              >
                <SelectTrigger id="ctoCapable">
                  <SelectValue placeholder="Any" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Any">Any</SelectItem>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selection Guidance */}
          <div className="rounded-lg border bg-muted/30 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="mt-0.5 h-5 w-5 text-primary" />
              <div className="flex-1 space-y-1 text-sm">
                <p className="font-medium">Selection Guidance</p>
                <p className="text-muted-foreground">
                  For SFA interventions with moderate calcification, an 0.018"
                  hydrophilic wire with standard stiffness is typically recommended.
                  Consider CTO-capable wires if crossing difficulty is anticipated.
                </p>
              </div>
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="w-full md:w-auto"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset Filters
          </Button>

          <Separator />

          {/* Advanced Filters */}
          <div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full justify-between"
            >
              <span>Advanced Filters</span>
              {showAdvanced ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            {showAdvanced && (
              <div className="mt-4 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  Advanced filter options will be available here.
                </p>
              </div>
            )}
          </div>

          {/* Continue Button */}
          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={!isFormValid()}>
              Continue
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
