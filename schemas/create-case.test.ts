import { describe, it, expect } from 'vitest'
import { createCaseSchema } from './create-case'

const validForm = {
  patientExternalId: 'MRN-1001',
  patientInitials: 'J.D.',
  patientAge: '68',
  patientSex: 'M',
  patientHeightCm: '175',
  patientWeightKg: '82',
  locationId: '550e8400-e29b-41d4-a716-446655440000',
  procedureCode: 'EVAR',
  procedureId: null,
  procedureDate: '2026-07-15',
  operatingPhysician: 'Dr. Smith',
  accessSelection: 'bilateral-cfa',
} as const

describe('createCaseSchema', () => {
  it('validates a complete create-case form', () => {
    const result = createCaseSchema.safeParse(validForm)
    expect(result.success).toBe(true)
  })

  it('requires a hospital location', () => {
    const result = createCaseSchema.safeParse({
      ...validForm,
      locationId: null,
    })
    expect(result.success).toBe(false)
  })

  it('accepts optional patient identifiers', () => {
    const result = createCaseSchema.safeParse({
      ...validForm,
      patientExternalId: '',
      patientInitials: '',
      patientAge: '',
      patientSex: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects invalid procedure codes', () => {
    const result = createCaseSchema.safeParse({
      ...validForm,
      procedureCode: 'SFA',
    })
    expect(result.success).toBe(false)
  })
})
