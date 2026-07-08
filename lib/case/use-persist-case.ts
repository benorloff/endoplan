'use client'

import { useCallback, useState } from 'react'
import { useWizardStore } from '@/store/wizard'
import { parseCreateCaseForm } from '@/schemas/create-case'
import type { CreateCaseForm } from '@/types/domain'

interface PersistCaseResult {
  caseId: string
  displayId: string
  procedureId: string | null
}

export function usePersistCase() {
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateCaseMeta = useWizardStore((s) => s.updateCaseMeta)
  const setActiveCaseId = useWizardStore((s) => s.setActiveCaseId)

  const persist = useCallback(
    async (form: CreateCaseForm): Promise<PersistCaseResult | null> => {
      const parsed = parseCreateCaseForm(form)
      if (!parsed.success) {
        setError('Please complete all required fields before continuing.')
        return null
      }

      setSaving(true)
      setError(null)

      try {
        const response = await fetch('/api/cases', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(parsed.data),
        })

        const body = (await response.json()) as
          | PersistCaseResult
          | { error?: string | unknown }

        if (!response.ok) {
          const message =
            typeof body === 'object' &&
            body !== null &&
            'error' in body &&
            typeof body.error === 'string'
              ? body.error
              : 'Failed to save case'
          setError(message)
          return null
        }

        const result = body as PersistCaseResult
        setActiveCaseId(result.caseId)
        updateCaseMeta({
          caseId: result.displayId,
          planningStatus: 'draft',
        })
        return result
      } catch {
        setError('Network error while saving case. Please try again.')
        return null
      } finally {
        setSaving(false)
      }
    },
    [setActiveCaseId, updateCaseMeta]
  )

  return { persist, saving, error, clearError: () => setError(null) }
}
