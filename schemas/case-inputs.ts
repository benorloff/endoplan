import { z } from 'zod'

/**
 * Zod schema for validating case input form data
 */
export const caseInputsSchema = z.object({
  wireDiameter: z.string().min(1, 'Wire diameter is required'),
  wireLength: z.string().min(1, 'Wire length is required'),
  tipConfiguration: z.string().min(1, 'Tip configuration is required'),
  wireStiffness: z.string().min(1, 'Wire stiffness is required'),
  coatingType: z.string().min(1, 'Coating type is required'),
  ctoCapable: z.string().optional(),
})

export type CaseInputsFormData = z.infer<typeof caseInputsSchema>
