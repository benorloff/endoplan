import { describe, it, expect } from 'vitest'
import { caseInputsSchema } from './case-inputs'

describe('caseInputsSchema', () => {
  it('validates correct form data', () => {
    const validData = {
      wireDiameter: '0.018',
      wireLength: '150',
      tipConfiguration: 'Angled',
      wireStiffness: 'Standard',
      coatingType: 'Hydrophilic',
      ctoCapable: 'Yes',
    }

    const result = caseInputsSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('rejects missing required fields', () => {
    const invalidData = {
      wireDiameter: '0.018',
      // Missing other required fields
    }

    const result = caseInputsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.length).toBeGreaterThan(0)
    }
  })

  it('accepts optional ctoCapable field', () => {
    const dataWithoutCto = {
      wireDiameter: '0.018',
      wireLength: '150',
      tipConfiguration: 'Angled',
      wireStiffness: 'Standard',
      coatingType: 'Hydrophilic',
    }

    const result = caseInputsSchema.safeParse(dataWithoutCto)
    expect(result.success).toBe(true)
  })

  it('rejects empty strings for required fields', () => {
    const invalidData = {
      wireDiameter: '',
      wireLength: '150',
      tipConfiguration: 'Angled',
      wireStiffness: 'Standard',
      coatingType: 'Hydrophilic',
    }

    const result = caseInputsSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
  })
})
