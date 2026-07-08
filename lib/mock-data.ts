import type { CaseListItem, CompletedCaseListItem } from '@/types'

/**
 * Mock data for development and testing
 */

export const mockCases: CaseListItem[] = [
  {
    id: '2143',
    displayId: 'EP-2143',
    status: 'draft',
    procedureLabel: 'EVAR',
    locationName: 'St. Jude Medical Center',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '2144',
    displayId: 'EP-2144',
    status: 'final',
    procedureLabel: 'TEVAR',
    locationName: 'St. Jude Medical Center',
    scheduledDate: new Date('2025-01-18'),
  },
  {
    id: '2145',
    displayId: 'EP-2145',
    status: 'draft',
    procedureLabel: 'FEVAR',
    locationName: 'Regional Vascular Center',
    createdAt: new Date('2025-01-16'),
  },
]

export const mockCompletedCases: CompletedCaseListItem[] = [
  {
    displayId: 'EP-2140',
    procedureLabel: 'EVAR',
    completedAt: new Date('2025-01-12'),
  },
  {
    displayId: 'EP-2139',
    procedureLabel: 'TEVAR',
    completedAt: new Date('2025-01-10'),
  },
  {
    displayId: 'EP-2138',
    procedureLabel: 'FEVAR',
    completedAt: new Date('2025-01-08'),
  },
]
