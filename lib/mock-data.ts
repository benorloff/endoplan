import type { Case, CompletedCase } from '@/types'

/**
 * Mock data for development and testing
 */

export const mockCases: Case[] = [
  {
    id: '2143',
    caseId: 'Case #2143',
    status: 'In Progress',
    procedureType: 'SFA Procedure',
    createdAt: new Date('2025-01-15'),
  },
  {
    id: '2144',
    caseId: 'Case #2144',
    status: 'Planned',
    procedureType: 'Iliac Procedure',
    scheduledDate: new Date('2025-01-18'),
  },
  {
    id: '2145',
    caseId: 'Case #2145',
    status: 'In Progress',
    procedureType: 'Tibial Procedure',
    createdAt: new Date('2025-01-16'),
  },
]

export const mockCompletedCases: CompletedCase[] = [
  {
    caseId: 'Case #2140',
    procedureType: 'SFA Procedure',
    completedAt: new Date('2025-01-12'),
  },
  {
    caseId: 'Case #2139',
    procedureType: 'Iliac Procedure',
    completedAt: new Date('2025-01-10'),
  },
  {
    caseId: 'Case #2138',
    procedureType: 'Tibial Procedure',
    completedAt: new Date('2025-01-08'),
  },
]
