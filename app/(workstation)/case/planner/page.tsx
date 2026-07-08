'use client'

import { CaseWorkflow } from '@/components/case/CaseWorkflow'

export default function PlannerPage() {
  return <CaseWorkflow initialStep={2} backLabel="Back to Measurements" />
}
