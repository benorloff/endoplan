import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CaseInputsForm } from './CaseInputsForm'

// Mock zustand store
vi.mock('@/store/wizard', () => ({
  useWizardStore: vi.fn(() => ({
    caseInputs: {},
    updateCaseInputs: vi.fn(),
  })),
}))

describe('CaseInputsForm', () => {
  const mockOnContinue = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form fields', () => {
    render(<CaseInputsForm onContinue={mockOnContinue} />)

    expect(screen.getByText('Case Inputs')).toBeInTheDocument()
    expect(screen.getByLabelText(/wire diameter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/wire length/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tip configuration/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/wire stiffness/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/coating type/i)).toBeInTheDocument()
  })

  it('renders continue button', () => {
    render(<CaseInputsForm onContinue={mockOnContinue} />)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeInTheDocument()
  })

  it('disables continue button when form is invalid', () => {
    render(<CaseInputsForm onContinue={mockOnContinue} />)

    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeDisabled()
  })

  it('renders selection guidance', () => {
    render(<CaseInputsForm onContinue={mockOnContinue} />)

    expect(screen.getByText(/selection guidance/i)).toBeInTheDocument()
    expect(
      screen.getByText(/For SFA interventions with moderate calcification/i)
    ).toBeInTheDocument()
  })

  it('renders reset filters button', () => {
    render(<CaseInputsForm onContinue={mockOnContinue} />)

    expect(screen.getByRole('button', { name: /reset filters/i })).toBeInTheDocument()
  })
})
