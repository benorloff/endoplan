import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseCard } from './CaseCard'
import type { Case } from '@/types'

describe('CaseCard', () => {
  const mockCase: Case = {
    id: '2143',
    caseId: 'Case #2143',
    status: 'In Progress',
    procedureType: 'SFA Procedure',
    createdAt: new Date('2025-01-15'),
  }

  it('renders case information correctly', () => {
    render(<CaseCard case={mockCase} />)

    expect(screen.getByText('Case #2143')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('SFA Procedure')).toBeInTheDocument()
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
  })

  it('renders Resume button', () => {
    render(<CaseCard case={mockCase} />)

    const resumeButton = screen.getByRole('link', { name: /resume/i })
    expect(resumeButton).toBeInTheDocument()
    expect(resumeButton).toHaveAttribute('href', '/wizard?caseId=2143')
  })

  it('displays scheduled date when provided', () => {
    const scheduledCase: Case = {
      ...mockCase,
      scheduledDate: new Date('2025-01-18'),
    }
    render(<CaseCard case={scheduledCase} />)

    expect(screen.getByText(/Scheduled:/)).toBeInTheDocument()
  })
})
