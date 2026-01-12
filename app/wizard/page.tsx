'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Stepper } from '@/components/wizard/Stepper'
import { CaseSummary } from '@/components/wizard/CaseSummary'
import { CaseInputsForm } from '@/components/wizard/CaseInputsForm'
import { useWizardStore } from '@/store/wizard'

const WIZARD_STEPS = [
  'Case Inputs',
  'Diagnostics',
  'Interventions',
  'Devices',
  'Summary',
] as const

/**
 * Wizard page - multi-step device selection workflow
 */
export default function WizardPage() {
  const router = useRouter()
  const { currentStep, setCurrentStep, caseInputs } = useWizardStore()

  const handleContinue = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Navigate to summary or complete
      router.push('/dashboard')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header with Back button and Stepper */}
      <div className="mb-8 space-y-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          asChild
          className="mb-4"
        >
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cases
          </Link>
        </Button>

        <Stepper currentStep={currentStep} steps={[...WIZARD_STEPS]} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Sidebar - Case Summary */}
        <div className="lg:col-span-1">
          <CaseSummary
            procedureType="SFA Intervention"
            vesselDiameter="5.5 mm"
            lesionLength="120 mm"
            calcification="Moderate"
            ctoPresent={false}
            onEdit={() => router.push('/dashboard')}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          {currentStep === 0 && <CaseInputsForm onContinue={handleContinue} />}
          {currentStep === 1 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Diagnostics</h2>
              <p className="text-muted-foreground">
                Diagnostics step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 2 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Interventions</h2>
              <p className="text-muted-foreground">
                Interventions step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 3 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Devices</h2>
              <p className="text-muted-foreground">
                Devices step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="rounded-lg border bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Summary</h2>
              <p className="text-muted-foreground">
                Summary step content will be available here.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
