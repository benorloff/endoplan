import { z } from 'zod'

/**
 * Zod schema for guidewire / device-plan inputs (procedural plan category).
 */
export const devicePlanSchema = z.object({
  wireDiameter: z.string().min(1, 'Wire diameter is required'),
  wireLength: z.string().min(1, 'Wire length is required'),
  tipConfiguration: z.string().min(1, 'Tip configuration is required'),
  wireStiffness: z.string().min(1, 'Wire stiffness is required'),
  coatingType: z.string().min(1, 'Coating type is required'),
  ctoCapable: z.string().optional(),
})

export type DevicePlanFormData = z.infer<typeof devicePlanSchema>

/** @deprecated Use devicePlanSchema */
export const caseInputsSchema = devicePlanSchema

/** @deprecated Use DevicePlanFormData */
export type CaseInputsFormData = DevicePlanFormData
