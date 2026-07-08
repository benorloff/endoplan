'use client'

import { CaseWorkflow } from '@/components/case/CaseWorkflow'

export default function SummaryPage() {
  return <CaseWorkflow initialStep={4} backLabel="Back to Planner" />
}
