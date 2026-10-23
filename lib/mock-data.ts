/**
 * Placeholder data for UI development. Nothing here is read from or written
 * to Supabase yet.
 */

export const PROCEDURES = ['EVAR', 'TEVAR', 'FEVAR', 'Branched EVAR'] as const
export const HOSPITALS = [
  'St. Jude Medical Center',
  'St. Jude West Campus',
  'Regional Vascular Center',
] as const
export const ACCESS_APPROACHES = ['Bilateral CFA', 'Right CFA', 'Left CFA'] as const

export type Procedure = (typeof PROCEDURES)[number]
export type Hospital = (typeof HOSPITALS)[number]
export type AccessApproach = (typeof ACCESS_APPROACHES)[number]
export type CaseStatus = 'draft' | 'planned' | 'completed'

export interface MockCase {
  id: string
  status: CaseStatus
  patientInitials: string
  patientAge: number
  patientSex: 'M' | 'F'
  procedure: Procedure
  hospital: Hospital
  procedureDate: string
  surgeon: string
  access: AccessApproach
  notes: string
}

export type NewCaseInput = Omit<MockCase, 'id' | 'status'>

/** Pre-fills the New Case form so it can be submitted without typing. */
export const sampleNewCase: NewCaseInput = {
  patientInitials: 'J.D.',
  patientAge: 68,
  patientSex: 'M',
  procedure: 'EVAR',
  hospital: 'St. Jude Medical Center',
  procedureDate: '2026-11-05',
  surgeon: 'Dr. Chen',
  access: 'Bilateral CFA',
  notes: 'Infrarenal AAA, 5.8 cm. Adequate iliac access.',
}

export const mockCases: MockCase[] = [
  {
    id: 'EP-1001',
    status: 'draft',
    patientInitials: 'J.D.',
    patientAge: 68,
    patientSex: 'M',
    procedure: 'EVAR',
    hospital: 'St. Jude Medical Center',
    procedureDate: '2026-11-05',
    surgeon: 'Dr. Chen',
    access: 'Bilateral CFA',
    notes: 'Infrarenal AAA, 5.8 cm. Adequate iliac access.',
  },
  {
    id: 'EP-1002',
    status: 'planned',
    patientInitials: 'M.R.',
    patientAge: 72,
    patientSex: 'F',
    procedure: 'TEVAR',
    hospital: 'St. Jude West Campus',
    procedureDate: '2026-11-12',
    surgeon: 'Dr. Patel',
    access: 'Right CFA',
    notes: 'Descending thoracic aneurysm. Consider LSA coverage.',
  },
  {
    id: 'EP-1003',
    status: 'completed',
    patientInitials: 'A.K.',
    patientAge: 64,
    patientSex: 'M',
    procedure: 'FEVAR',
    hospital: 'Regional Vascular Center',
    procedureDate: '2026-10-01',
    surgeon: 'Dr. Chen',
    access: 'Bilateral CFA',
    notes: 'Juxtarenal AAA, 3-fenestration custom device.',
  },
]

export function getMockCase(id: string): MockCase | undefined {
  return mockCases.find((c) => c.id === id)
}
