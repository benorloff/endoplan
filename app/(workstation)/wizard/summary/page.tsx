'use client'

import { WizardWorkspace } from '@/components/wizard/WizardWorkspace'

export default function SummaryPage() {
  return (
    <WizardWorkspace
      initialStep={4}
      backLabel="Back to Planner"
    />
  )
}
