'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/wizard/Stepper'
import { CaseSummary } from '@/components/wizard/CaseSummary'
import { CaseInputsForm } from '@/components/wizard/CaseInputsForm'
import { ShellSidebar } from '@/lib/layout/shell-context'
import { useWizardStore } from '@/store/wizard'

const WIZARD_STEPS = [
  'Case Inputs',
  'Diagnostics',
  'Interventions',
  'Devices',
  'Summary',
] as const

const STEP_ROUTES = [
  '/wizard',
  '/wizard/measurements',
  '/wizard/planner',
  '/wizard/planner',
  '/wizard/summary',
] as const

export interface WizardWorkspaceProps {
  /** Initial step for this route (0–4) */
  initialStep: number
  backHref?: string
  backLabel?: string
}

export function WizardWorkspace({
  initialStep,
  backHref = '/dashboard',
  backLabel = 'Back to Cases',
}: WizardWorkspaceProps) {
  const router = useRouter()
  const { currentStep, setCurrentStep, updateCaseMeta } = useWizardStore()

  useEffect(() => {
    const step = useWizardStore.getState().currentStep
    if (initialStep === 2 && step === 3) return
    setCurrentStep(initialStep)
  }, [initialStep, setCurrentStep])

  useEffect(() => {
    if (currentStep === 0) {
      updateCaseMeta({ planningStatus: 'draft' })
    } else if (currentStep >= 1 && currentStep < 4) {
      updateCaseMeta({ planningStatus: 'in-progress' })
    } else if (currentStep === 4) {
      updateCaseMeta({ planningStatus: 'complete' })
    }
  }, [currentStep, updateCaseMeta])

  const handleContinue = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      const nextStep = currentStep + 1
      setCurrentStep(nextStep)
      const nextRoute = STEP_ROUTES[nextStep]
      if (nextRoute !== STEP_ROUTES[currentStep]) {
        router.push(nextRoute)
      }
      return
    }
    router.push('/dashboard')
  }

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1
      setCurrentStep(prevStep)
      router.push(STEP_ROUTES[prevStep])
      return
    }
    router.push(backHref)
  }

  return (
    <>
      <ShellSidebar title="Case Summary">
        <CaseSummary
          procedureType="SFA Intervention"
          vesselDiameter="5.5 mm"
          lesionLength="120 mm"
          calcification="Moderate"
          ctoPresent={false}
          onEdit={() => router.push('/wizard')}
        />
      </ShellSidebar>

      <div className="space-y-4">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            {backLabel}
          </Button>

          <Stepper currentStep={currentStep} steps={[...WIZARD_STEPS]} />
        </div>

        <div>
          {currentStep === 0 && <CaseInputsForm onContinue={handleContinue} />}
          {currentStep === 1 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-lg font-semibold">Anatomic Measurements</h2>
              <p className="text-sm text-muted-foreground">
                Measurement capture and validation will be available here.
              </p>
              <Button className="mt-4" size="sm" onClick={handleContinue}>
                Continue to Planner
              </Button>
            </div>
          )}
          {currentStep === 2 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-lg font-semibold">Procedure Planner</h2>
              <p className="text-sm text-muted-foreground">
                Guidewire selection and device planning will be available here.
              </p>
              <Button className="mt-4" size="sm" onClick={handleContinue}>
                Continue to Devices
              </Button>
            </div>
          )}
          {currentStep === 3 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-lg font-semibold">Device Selection</h2>
              <p className="text-sm text-muted-foreground">
                Device comparison and selection will be available here.
              </p>
              <Button className="mt-4" size="sm" onClick={handleContinue}>
                Continue to Summary
              </Button>
            </div>
          )}
          {currentStep === 4 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-lg font-semibold">Case Summary</h2>
              <p className="text-sm text-muted-foreground">
                Final validation and export will be available here.
              </p>
              <Button className="mt-4" size="sm" onClick={handleContinue}>
                Return to Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
