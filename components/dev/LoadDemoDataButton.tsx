'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { PrimaryButton } from '@/components/endoplan'

interface LoadDemoDataButtonProps {
  onSuccess?: () => void
  className?: string
}

/**
 * Dev helper — loads catalog + demo hospital and links the current user.
 */
export function LoadDemoDataButton({
  onSuccess,
  className,
}: LoadDemoDataButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/dev/seed', { method: 'POST' })
      const body = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(body.error ?? 'Failed to load demo data')
        return
      }

      onSuccess?.()
    } catch {
      setError('Network error while loading demo data.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <PrimaryButton
        type="button"
        className="h-8 text-xs"
        onClick={handleClick}
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="size-3.5 animate-spin" />
            Loading…
          </>
        ) : (
          'Load Demo Data'
        )}
      </PrimaryButton>
      {error && (
        <p className="mt-2 text-xs text-clinical-critical">{error}</p>
      )}
    </div>
  )
}
