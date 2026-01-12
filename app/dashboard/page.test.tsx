import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from './page'

// Mock Next.js Link component
vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

describe('DashboardPage', () => {
  it('renders dashboard title and subtitle', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(
      screen.getByText(/Begin a new procedure plan or resume an active case/i)
    ).toBeInTheDocument()
  })

  it('renders Create New Case button', () => {
    render(<DashboardPage />)

    const createButton = screen.getByRole('link', { name: /create new case/i })
    expect(createButton).toBeInTheDocument()
    expect(createButton).toHaveAttribute('href', '/wizard')
  })

  it('renders case sections', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Upcoming / In-Progress Cases')).toBeInTheDocument()
    expect(screen.getByText('Recent Completed Cases')).toBeInTheDocument()
  })

  it('renders quick actions section', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
  })

  it('renders resume buttons for cases', () => {
    render(<DashboardPage />)

    const resumeButtons = screen.getAllByRole('link', { name: /resume/i })
    expect(resumeButtons.length).toBeGreaterThan(0)
  })
})
