'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CaseSummary } from '@/components/CaseSummary'
import { NewCaseForm } from '@/components/NewCaseForm'
import { sampleNewCase, type NewCaseInput } from '@/lib/mock-data'

/**
 * Form is pre-filled with sample data. Submitting shows the summary in place;
 * nothing is saved to the database yet.
 */
export default function NewCasePage() {
  const [submitted, setSubmitted] = useState<NewCaseInput | null>(null)

  if (submitted) {
    return (
      <div className="space-y-4">
        <CaseSummary title="Case summary" status="draft" data={submitted} />
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSubmitted(null)}>
            Edit
          </Button>
          <Button asChild>
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
      </div>
    )
  }

  return <NewCaseForm initialValues={sampleNewCase} onSubmit={setSubmitted} />
}
