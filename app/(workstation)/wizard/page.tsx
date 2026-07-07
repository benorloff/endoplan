'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
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

/**
 * Wizard page - multi-step device selection workflow
 */
export default function WizardPage() {
  const router = useRouter()
  const { currentStep, setCurrentStep } = useWizardStore()

  const handleContinue = () => {
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
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
    <>
      <ShellSidebar title="Case Summary">
        <CaseSummary
          procedureType="SFA Intervention"
          vesselDiameter="5.5 mm"
          lesionLength="120 mm"
          calcification="Moderate"
          ctoPresent={false}
          onEdit={() => router.push('/dashboard')}
        />
      </ShellSidebar>

      <div className="space-y-6">
        <div className="space-y-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            asChild
          >
            <Link href="/dashboard">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Cases
            </Link>
          </Button>

          <Stepper currentStep={currentStep} steps={[...WIZARD_STEPS]} />
        </div>

        <div>
          {currentStep === 0 && <CaseInputsForm onContinue={handleContinue} />}
          {currentStep === 1 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Diagnostics</h2>
              <p className="text-muted-foreground">
                Diagnostics step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 2 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Interventions</h2>
              <p className="text-muted-foreground">
                Interventions step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 3 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Devices</h2>
              <p className="text-muted-foreground">
                Devices step content will be available here.
              </p>
            </div>
          )}
          {currentStep === 4 && (
            <div className="rounded-sm border border-outline-variant bg-card p-8 text-center">
              <h2 className="mb-2 text-xl font-semibold">Summary</h2>
              <p className="text-muted-foreground">
                Summary step content will be available here.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
