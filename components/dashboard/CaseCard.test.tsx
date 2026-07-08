import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseCard } from './CaseCard'
import type { CaseListItem } from '@/types'

describe('CaseCard', () => {
  const mockCase: CaseListItem = {
    id: '2143',
    displayId: 'EP-2143',
    status: 'draft',
    procedureLabel: 'EVAR',
    locationName: 'St. Jude Medical Center',
    createdAt: new Date('2025-01-15'),
  }

  it('renders case information correctly', () => {
    render(<CaseCard case={mockCase} />)

    expect(screen.getByText('EP-2143')).toBeInTheDocument()
    expect(screen.getByText('DRAFT')).toBeInTheDocument()
    expect(screen.getByText('EVAR')).toBeInTheDocument()
    expect(screen.getByText(/Created:/)).toBeInTheDocument()
  })

  it('renders Resume button', () => {
    render(<CaseCard case={mockCase} />)

    const resumeButton = screen.getByRole('link', { name: /resume/i })
    expect(resumeButton).toBeInTheDocument()
    expect(resumeButton).toHaveAttribute('href', '/case/create?caseId=2143')
  })

  it('displays scheduled date when provided', () => {
    const scheduledCase: CaseListItem = {
      ...mockCase,
      scheduledDate: new Date('2025-01-18'),
    }
    render(<CaseCard case={scheduledCase} />)

    expect(screen.getByText(/Scheduled:/)).toBeInTheDocument()
  })
})
