'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, ChevronDown, ChevronUp, Calendar, ArrowRight, Loader2 } from 'lucide-react'
import {
  ClinicalInput,
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownTrigger,
  DropdownValue,
  Panel,
  PanelHeader,
  PrimaryButton,
} from '@/components/endoplan'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import {
  ACCESS_STRATEGY_OPTIONS,
  PROCEDURE_OPTIONS,
} from '@/lib/case/mappers'
import { usePersistCase } from '@/lib/case/use-persist-case'
import { parseCreateCaseForm } from '@/schemas/create-case'
import { useWizardStore } from '@/store/wizard'
import type { AccessSelectionKey, ProcedureCode } from '@/types'
import type { LocationRow } from '@/types/db'

interface FieldLabelProps {
  htmlFor?: string
  children: React.ReactNode
}

function FieldLabel({ htmlFor, children }: FieldLabelProps) {
  return (
    <Label htmlFor={htmlFor} className="text-label-caps text-muted-foreground">
      {children}
    </Label>
  )
}

interface ProcedureToggleProps {
  code: ProcedureCode
  label: string
  selected: boolean
  onSelect: (code: ProcedureCode) => void
}

function ProcedureToggle({ code, label, selected, onSelect }: ProcedureToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(code)}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-sm border px-3 py-2 text-xs font-medium transition-colors',
        selected
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-outline-variant bg-surface-container-low text-muted-foreground hover:border-outline hover:text-foreground'
      )}
    >
      {selected && <Check className="size-3.5 shrink-0" />}
      <span>{label}</span>
    </button>
  )
}

interface AccessRadioProps {
  value: AccessSelectionKey
  label: string
  checked: boolean
  onChange: (value: AccessSelectionKey) => void
}

function AccessRadio({ value, label, checked, onChange }: AccessRadioProps) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <span
        className={cn(
          'flex size-4 items-center justify-center rounded-full border',
          checked ? 'border-primary' : 'border-outline-variant'
        )}
      >
        {checked && <span className="size-2 rounded-full bg-primary" />}
      </span>
      <input
        type="radio"
        name="accessSelection"
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      {label}
    </label>
  )
}

export interface CreateCaseFormProps {
  locations: Pick<LocationRow, 'id' | 'name' | 'code'>[]
}

/**
 * Create new case form — patient, procedure, location, and access configuration.
 * Field names align with the domain model and `cases` / `case_access_sites` tables.
 */
export function CreateCaseForm({ locations }: CreateCaseFormProps) {
  const router = useRouter()
  const { createCaseForm, updateCreateCaseForm, updateCaseMeta } = useWizardStore()
  const { persist, saving, error: persistError } = usePersistCase()
  const [patientOpen, setPatientOpen] = useState(true)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const set = <K extends keyof typeof createCaseForm>(
    key: K,
    value: (typeof createCaseForm)[K]
  ) => {
    updateCreateCaseForm({ [key]: value })
    if (key === 'locationId') {
      const location = locations.find((l) => l.id === value)
      updateCaseMeta({
        hospital: location?.name ?? 'PENDING',
      })
    }
  }

  const handleContinue = async () => {
    const result = parseCreateCaseForm(createCaseForm)
    if (!result.success) {
      const nextErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const key = String(issue.path[0] ?? 'form')
        if (!nextErrors[key]) nextErrors[key] = issue.message
      }
      setErrors(nextErrors)
      return
    }
    setErrors({})
    const saved = await persist(createCaseForm)
    if (saved) router.push('/case/measurements')
  }

  return (
    <div className="space-y-3">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Create New Case</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure the clinical details required to begin procedural planning.
        </p>
      </div>

      <Panel>
        <PanelHeader
          step={1}
          title="Patient Information"
          action={
            <button
              type="button"
              onClick={() => setPatientOpen((o) => !o)}
              className="text-muted-foreground hover:text-foreground"
              aria-label={patientOpen ? 'Collapse section' : 'Expand section'}
            >
              {patientOpen ? (
                <ChevronUp className="size-4" />
              ) : (
                <ChevronDown className="size-4" />
              )}
            </button>
          }
        />
        {patientOpen && (
          <div className="grid grid-cols-2 gap-3 p-3 md:grid-cols-3 lg:grid-cols-6">
            <div className="space-y-1">
              <FieldLabel htmlFor="initials">Initials</FieldLabel>
              <ClinicalInput
                id="initials"
                placeholder="E.G. J.D."
                value={createCaseForm.patientInitials}
                onChange={(e) => set('patientInitials', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="patientExternalId">ID / MRN</FieldLabel>
              <ClinicalInput
                id="patientExternalId"
                placeholder="Internal tracking number"
                value={createCaseForm.patientExternalId}
                onChange={(e) => set('patientExternalId', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="patientAge">Age</FieldLabel>
              <ClinicalInput
                id="patientAge"
                inputMode="numeric"
                placeholder="--"
                value={createCaseForm.patientAge}
                onChange={(e) => set('patientAge', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="patientSex">Sex</FieldLabel>
              <Dropdown
                value={createCaseForm.patientSex || undefined}
                onValueChange={(v) => set('patientSex', v as 'M' | 'F')}
              >
                <DropdownTrigger id="patientSex" className="h-8 w-full text-sm">
                  <DropdownValue placeholder="Select" />
                </DropdownTrigger>
                <DropdownContent>
                  <DropdownItem value="M">Male</DropdownItem>
                  <DropdownItem value="F">Female</DropdownItem>
                </DropdownContent>
              </Dropdown>
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="patientHeightCm">Height (cm)</FieldLabel>
              <ClinicalInput
                id="patientHeightCm"
                inputMode="decimal"
                placeholder="--"
                value={createCaseForm.patientHeightCm}
                onChange={(e) => set('patientHeightCm', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="patientWeightKg">Weight (kg)</FieldLabel>
              <ClinicalInput
                id="patientWeightKg"
                inputMode="decimal"
                placeholder="--"
                value={createCaseForm.patientWeightKg}
                onChange={(e) => set('patientWeightKg', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        )}
      </Panel>

      <Panel>
        <PanelHeader step={2} title="Procedure" />
        <div className="flex flex-wrap gap-2 p-3">
          {PROCEDURE_OPTIONS.map(({ code, label }) => (
            <ProcedureToggle
              key={code}
              code={code}
              label={label}
              selected={createCaseForm.procedureCode === code}
              onSelect={(c) => set('procedureCode', c)}
            />
          ))}
        </div>
      </Panel>

      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Panel>
          <PanelHeader step={3} title="Procedure Details" />
          <div className="space-y-3 p-3">
            <div className="space-y-1">
              <FieldLabel htmlFor="locationId">Hospital / Location</FieldLabel>
              <Dropdown
                value={createCaseForm.locationId ?? undefined}
                onValueChange={(v) => set('locationId', v)}
              >
                <DropdownTrigger id="locationId" className="h-8 w-full text-sm">
                  <DropdownValue placeholder="Select hospital" />
                </DropdownTrigger>
                <DropdownContent>
                  {locations.length === 0 ? (
                    <DropdownItem value="__none" disabled>
                      No locations available
                    </DropdownItem>
                  ) : (
                    locations.map((location) => (
                      <DropdownItem key={location.id} value={location.id}>
                        {location.name}
                        {location.code ? ` (${location.code})` : ''}
                      </DropdownItem>
                    ))
                  )}
                </DropdownContent>
              </Dropdown>
              {errors.locationId && (
                <p className="text-xs text-clinical-critical">{errors.locationId}</p>
              )}
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="procedureDate">Procedure Date</FieldLabel>
              <div className="relative">
                <ClinicalInput
                  id="procedureDate"
                  type="date"
                  value={createCaseForm.procedureDate}
                  onChange={(e) => set('procedureDate', e.target.value)}
                  className="h-8 pr-9 text-sm"
                />
                <Calendar className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div className="space-y-1">
              <FieldLabel htmlFor="operatingPhysician">Operating Physician</FieldLabel>
              <ClinicalInput
                id="operatingPhysician"
                placeholder="Dr. Surgeon Name"
                value={createCaseForm.operatingPhysician}
                onChange={(e) => set('operatingPhysician', e.target.value)}
                className="h-8 text-sm"
              />
            </div>
          </div>
        </Panel>

        <Panel>
          <PanelHeader step={4} title="Access Strategy" />
          <div className="flex flex-col gap-3 p-3">
            {ACCESS_STRATEGY_OPTIONS.map((opt) => (
              <AccessRadio
                key={opt.key}
                value={opt.key}
                label={opt.label}
                checked={createCaseForm.accessSelection === opt.key}
                onChange={(v) => set('accessSelection', v)}
              />
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col items-end gap-2 xl:hidden">
        {persistError && (
          <p className="text-xs text-clinical-critical">{persistError}</p>
        )}
        <PrimaryButton className="h-9" onClick={handleContinue} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              Continue to Measurements
              <ArrowRight className="size-4" />
            </>
          )}
        </PrimaryButton>
      </div>
    </div>
  )
}
