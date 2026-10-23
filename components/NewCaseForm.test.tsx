import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewCaseForm } from '@/components/NewCaseForm'
import { sampleNewCase } from '@/lib/mock-data'

describe('NewCaseForm', () => {
  it('pre-fills the form with sample data', () => {
    render(<NewCaseForm initialValues={sampleNewCase} onSubmit={() => {}} />)
    expect(screen.getByLabelText('Patient initials')).toHaveValue('J.D.')
    expect(screen.getByLabelText('Surgeon')).toHaveValue('Dr. Chen')
  })

  it('submits the edited values', async () => {
    const onSubmit = vi.fn()
    render(<NewCaseForm initialValues={sampleNewCase} onSubmit={onSubmit} />)

    const initials = screen.getByLabelText('Patient initials')
    await userEvent.clear(initials)
    await userEvent.type(initials, 'A.B.')
    await userEvent.click(screen.getByRole('button', { name: 'Create case' }))

    expect(onSubmit).toHaveBeenCalledWith({ ...sampleNewCase, patientInitials: 'A.B.' })
  })
})
