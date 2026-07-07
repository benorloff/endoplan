'use client'

import { WizardWorkspace } from '@/components/wizard/WizardWorkspace'

export default function PlannerPage() {
  return <WizardWorkspace initialStep={2} backLabel="Back to Measurements" />
}
