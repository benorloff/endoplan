import { describe, it, expect } from 'vitest'
import {
  accessSelectionToLabel,
  createCaseFormToAccessSiteInserts,
  createCaseFormToCaseInsert,
  createCaseFormToPatient,
  procedureCodeToLabel,
} from '@/lib/case/mappers'
import type { CreateCaseForm } from '@/types'

const sampleForm: CreateCaseForm = {
  patientExternalId: 'MRN-22',
  patientInitials: 'J.D.',
  patientAge: '68',
  patientSex: 'M',
  patientHeightCm: '180',
  patientWeightKg: '80',
  locationId: '550e8400-e29b-41d4-a716-446655440000',
  procedureCode: 'EVAR',
  procedureId: null,
  procedureDate: '2026-07-01',
  operatingPhysician: 'Dr. Surgeon',
  accessSelection: 'bilateral-cfa',
}

describe('case mappers', () => {
  it('maps patient fields from the create-case form', () => {
    const patient = createCaseFormToPatient(sampleForm)
    expect(patient.initials).toBe('J.D.')
    expect(patient.externalId).toBe('MRN-22')
    expect(patient.heightCm).toBe(180)
    expect(patient.weightKg).toBe(80)
    expect(patient.bmi).toBeCloseTo(24.7, 1)
  })

  it('maps create-case form to cases insert row', () => {
    const insert = createCaseFormToCaseInsert(
      { ...sampleForm, procedureId: 'b0000001-0000-4000-8000-000000000001' },
      {
        createdBy: 'user-1',
        ownerProfileId: 'user-1',
        orgId: null,
        planningPhysicianId: 'user-1',
      }
    )

    expect(insert.location_id).toBe(sampleForm.locationId)
    expect(insert.patient_initials).toBe('J.D.')
    expect(insert.patient_external_id).toBe('MRN-22')
    expect(insert.patient_age).toBe(68)
    expect(insert.patient_sex).toBe('M')
    expect(insert.patient_height_cm).toBe(180)
    expect(insert.patient_weight_kg).toBe(80)
    expect(insert.procedure_date).toBe('2026-07-01')
    expect(insert.operating_physician).toBe('Dr. Surgeon')
    expect(insert.status).toBe('draft')
    expect(insert.created_by).toBe('user-1')
  })

  it('resolves access site ids when persisting access rows', () => {
    const rows = createCaseFormToAccessSiteInserts(sampleForm, 'case-1', {
      CFA: 'c0000001-0000-4000-8000-000000000001',
    })
    expect(rows).toHaveLength(2)
    expect(rows[0].access_site_id).toBe('c0000001-0000-4000-8000-000000000001')
  })

  it('expands bilateral CFA into two case_access_sites rows', () => {
    const rows = createCaseFormToAccessSiteInserts(sampleForm, 'case-1')
    expect(rows).toHaveLength(2)
    expect(rows.map((r) => r.side)).toEqual(['L', 'R'])
    expect(rows[0].vessel).toBe('CFA')
  })

  it('formats labels for UI', () => {
    expect(procedureCodeToLabel('BRANCHED_EVAR')).toBe('Branched EVAR')
    expect(accessSelectionToLabel('bilateral-cfa')).toBe('BILATERAL')
  })
})
