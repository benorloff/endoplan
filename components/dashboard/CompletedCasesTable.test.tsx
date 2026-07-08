import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CompletedCasesTable } from './CompletedCasesTable'
import type { CompletedCaseListItem } from '@/types'

describe('CompletedCasesTable', () => {
  const mockCompletedCases: CompletedCaseListItem[] = [
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
  ]

  it('renders table headers', () => {
    render(<CompletedCasesTable cases={mockCompletedCases} />)

    expect(screen.getByText('Case ID')).toBeInTheDocument()
    expect(screen.getByText('Procedure Type')).toBeInTheDocument()
    expect(screen.getByText('Completion Date')).toBeInTheDocument()
  })

  it('renders all completed cases', () => {
    render(<CompletedCasesTable cases={mockCompletedCases} />)

    expect(screen.getByText('EP-2140')).toBeInTheDocument()
    expect(screen.getByText('EVAR')).toBeInTheDocument()
    expect(screen.getByText('EP-2139')).toBeInTheDocument()
    expect(screen.getByText('TEVAR')).toBeInTheDocument()
  })

  it('renders empty table when no cases provided', () => {
    render(<CompletedCasesTable cases={[]} />)

    expect(screen.getByText('Case ID')).toBeInTheDocument()
    expect(screen.queryByText('EP-2140')).not.toBeInTheDocument()
  })
})
