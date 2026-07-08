'use client'

import { useRouter } from 'next/navigation'
import { ArrowRight, Check, Circle, Loader2 } from 'lucide-react'
import { PrimaryButton, StatusBadge } from '@/components/endoplan'
import { cn } from '@/lib/utils'
import {
  accessSelectionToLabel,
  createCaseFormToPatient,
  procedureCodeToLabel,
} from '@/lib/case/mappers'
import { usePersistCase } from '@/lib/case/use-persist-case'
import { parseCreateCaseForm } from '@/schemas/create-case'
import { useWizardStore } from '@/store/wizard'

interface ConfigItemProps {
  done: boolean
  label: string
}

function ConfigItem({ done, label }: ConfigItemProps) {
  return (
    <li className="flex items-center gap-2 text-sm">
      {done ? (
        <Check className="size-3.5 shrink-0 text-clinical-success" />
      ) : (
        <Circle className="size-3.5 shrink-0 text-muted-foreground" />
      )}
      <span className={cn(done ? 'text-foreground' : 'text-muted-foreground')}>
        {label}
      </span>
    </li>
  )
}

/**
 * Right-sidebar panel for the create-case workflow
 */
export function CreateCaseSidebar() {
  const router = useRouter()
  const { createCaseForm, caseMeta } = useWizardStore()
  const { persist, saving, error } = usePersistCase()
  const patient = createCaseFormToPatient(createCaseForm)

  const hasPatientInfo =
    Boolean(patient.initials) ||
    Boolean(patient.externalId) ||
    patient.age !== undefined ||
    Boolean(patient.sex) ||
    patient.heightCm !== undefined ||
    patient.weightKg !== undefined

  const hasProcedure = Boolean(createCaseForm.procedureCode)
  const hasLocation = Boolean(createCaseForm.locationId)
  const canContinue = parseCreateCaseForm(createCaseForm).success

  const handleContinue = async () => {
    const result = parseCreateCaseForm(createCaseForm)
    if (!result.success) return
    const saved = await persist(createCaseForm)
    if (saved) router.push('/case/measurements')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4">
        <StatusBadge variant="draft">Draft</StatusBadge>

        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-label-caps text-muted-foreground">Procedure</dt>
            <dd className="font-medium text-primary">
              {procedureCodeToLabel(createCaseForm.procedureCode)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-label-caps text-muted-foreground">Access</dt>
            <dd className="font-medium">
              {accessSelectionToLabel(createCaseForm.accessSelection)}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-label-caps text-muted-foreground">Hospital</dt>
            <dd
              className={cn(
                'font-medium',
                hasLocation ? 'text-foreground' : 'text-clinical-warning'
              )}
            >
              {hasLocation ? caseMeta.hospital ?? 'Selected' : 'PENDING'}
            </dd>
          </div>
        </dl>

        <div>
          <p className="mb-2 text-label-caps text-muted-foreground">
            Configuration Status
          </p>
          <ul className="space-y-2">
            <ConfigItem done={hasPatientInfo} label="Patient Information" />
            <ConfigItem done={hasProcedure} label="Procedure Selected" />
            <ConfigItem done={hasLocation} label="Hospital Selected" />
            <ConfigItem done={false} label="Measurements Pending" />
          </ul>
        </div>
      </div>

      <PrimaryButton
        className="mt-4 hidden h-9 w-full text-xs xl:flex"
        onClick={handleContinue}
        disabled={!canContinue || saving}
      >
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
      {error && (
        <p className="mt-2 hidden text-xs text-clinical-critical xl:block">
          {error}
        </p>
      )}
    </div>
  )
}
