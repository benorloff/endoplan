import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompletedCasesTable } from './CompletedCasesTable'
import type { CompletedCase } from '@/types'

describe('CompletedCasesTable', () => {
  const mockCompletedCases: CompletedCase[] = [
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
  ]

  it('renders table headers', () => {
    render(<CompletedCasesTable cases={mockCompletedCases} />)

    expect(screen.getByText('Case ID')).toBeInTheDocument()
    expect(screen.getByText('Procedure Type')).toBeInTheDocument()
    expect(screen.getByText('Completion Date')).toBeInTheDocument()
  })

  it('renders all completed cases', () => {
    render(<CompletedCasesTable cases={mockCompletedCases} />)

    expect(screen.getByText('Case #2140')).toBeInTheDocument()
    expect(screen.getByText('SFA Procedure')).toBeInTheDocument()
    expect(screen.getByText('Case #2139')).toBeInTheDocument()
    expect(screen.getByText('Iliac Procedure')).toBeInTheDocument()
  })

  it('renders empty table when no cases provided', () => {
    render(<CompletedCasesTable cases={[]} />)

    expect(screen.getByText('Case ID')).toBeInTheDocument()
    expect(screen.queryByText('Case #2140')).not.toBeInTheDocument()
  })
})
