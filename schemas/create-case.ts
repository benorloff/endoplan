import { z } from 'zod'
import {
  ACCESS_SELECTION_KEYS,
  PATIENT_SEX_VALUES,
  PROCEDURE_CODES,
} from '@/types/enums'

const optionalNumericString = z
  .string()
  .trim()
  .refine((v) => v === '' || !Number.isNaN(Number(v)), 'Must be a number')
  .refine((v) => v === '' || Number(v) >= 0, 'Must be zero or greater')

const patientSexSchema = z.union([
  z.enum(PATIENT_SEX_VALUES),
  z.literal(''),
])

/**
 * Validates create-case form data before persisting to `cases` + `case_access_sites`.
 */
export const createCaseSchema = z.object({
  patientExternalId: z.string().trim().max(64).optional().default(''),
  patientInitials: z
    .string()
    .trim()
    .max(16, 'Initials must be 16 characters or fewer')
    .optional()
    .default(''),
  patientAge: optionalNumericString.optional().default(''),
  patientSex: patientSexSchema.optional().default(''),
  patientHeightCm: optionalNumericString.optional().default(''),
  patientWeightKg: optionalNumericString.optional().default(''),
  locationId: z
    .union([z.string().uuid(), z.null()])
    .refine((v) => v !== null, 'Hospital / location is required'),
  procedureCode: z.enum(PROCEDURE_CODES),
  procedureId: z.string().uuid().nullable().optional().default(null),
  procedureDate: z.string().optional().default(''),
  operatingPhysician: z.string().trim().max(128).optional().default(''),
  accessSelection: z.enum(ACCESS_SELECTION_KEYS),
})

export type CreateCaseFormData = z.infer<typeof createCaseSchema>

export function parseCreateCaseForm(data: unknown) {
  return createCaseSchema.safeParse(data)
}
