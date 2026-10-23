'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ACCESS_APPROACHES,
  HOSPITALS,
  PROCEDURES,
  type NewCaseInput,
} from '@/lib/mock-data'

interface NewCaseFormProps {
  initialValues: NewCaseInput
  onSubmit: (values: NewCaseInput) => void
}

export function NewCaseForm({ initialValues, onSubmit }: NewCaseFormProps) {
  const [values, setValues] = useState<NewCaseInput>(initialValues)

  const set = <K extends keyof NewCaseInput>(key: K, value: NewCaseInput[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(values)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New case</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="patientInitials">Patient initials</Label>
            <Input
              id="patientInitials"
              value={values.patientInitials}
              onChange={(e) => set('patientInitials', e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="patientAge">Age</Label>
              <Input
                id="patientAge"
                type="number"
                min={0}
                max={130}
                value={values.patientAge}
                onChange={(e) => set('patientAge', Number(e.target.value))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="patientSex">Sex</Label>
              <Select
                value={values.patientSex}
                onValueChange={(v) => set('patientSex', v as NewCaseInput['patientSex'])}
              >
                <SelectTrigger id="patientSex" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="F">F</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedure">Procedure</Label>
            <Select
              value={values.procedure}
              onValueChange={(v) => set('procedure', v as NewCaseInput['procedure'])}
            >
              <SelectTrigger id="procedure" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PROCEDURES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospital">Hospital</Label>
            <Select
              value={values.hospital}
              onValueChange={(v) => set('hospital', v as NewCaseInput['hospital'])}
            >
              <SelectTrigger id="hospital" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {HOSPITALS.map((h) => (
                  <SelectItem key={h} value={h}>
                    {h}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="procedureDate">Procedure date</Label>
            <Input
              id="procedureDate"
              type="date"
              value={values.procedureDate}
              onChange={(e) => set('procedureDate', e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="surgeon">Surgeon</Label>
            <Input
              id="surgeon"
              value={values.surgeon}
              onChange={(e) => set('surgeon', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="access">Access</Label>
            <Select
              value={values.access}
              onValueChange={(v) => set('access', v as NewCaseInput['access'])}
            >
              <SelectTrigger id="access" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_APPROACHES.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <textarea
              id="notes"
              rows={3}
              value={values.notes}
              onChange={(e) => set('notes', e.target.value)}
              className="w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <div className="sm:col-span-2">
            <Button type="submit">Create case</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
