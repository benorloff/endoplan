'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'

interface OrgBootstrapFormProps {
  profileId: string
}

/**
 * Form component for creating a new organization
 */
export function OrgBootstrapForm({ profileId }: OrgBootstrapFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const kind = formData.get('kind') as string | null
    const setAsDefault = formData.get('setAsDefault') === 'on'

    try {
      const response = await fetch('/api/org/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          kind: kind || undefined,
          setAsDefault,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create organization')
      }

      // Redirect to dashboard
      router.push('/dashboard')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Details</CardTitle>
        <CardDescription>
          Enter the details for your organization. You'll be added as the administrator.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Organization Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="My Hospital"
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="kind">Organization Type</Label>
            <Select name="kind" disabled={loading}>
              <SelectTrigger id="kind">
                <SelectValue placeholder="Select type (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hospital">Hospital</SelectItem>
                <SelectItem value="asc">ASC (Ambulatory Surgery Center)</SelectItem>
                <SelectItem value="clinic">Clinic</SelectItem>
                <SelectItem value="obl">OBL (Office-Based Lab)</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="setAsDefault"
              name="setAsDefault"
              disabled={loading}
              className="h-4 w-4 rounded border-gray-300"
            />
            <Label
              htmlFor="setAsDefault"
              className="text-sm font-normal leading-none cursor-pointer"
            >
              Set as default organization
            </Label>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Organization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
