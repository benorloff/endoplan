'use client'

import { CaseWorkflow } from '@/components/case/CaseWorkflow'

export default function MeasurementsPage() {
  return <CaseWorkflow initialStep={1} backLabel="Back to Create Case" />
}
