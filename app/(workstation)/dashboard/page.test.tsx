import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardPage from './page'

vi.mock('next/link', () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}))

vi.mock('next/navigation', () => ({
  redirect: vi.fn(),
}))

vi.mock('@/lib/auth/get-user', () => ({
  requireAuth: vi.fn().mockResolvedValue({
    user: { id: 'user-1', email: 'surgeon@example.com' },
    profile: { id: 'user-1', display_name: 'Dr. Smith' },
  }),
}))

vi.mock('@/lib/tenant/context', () => ({
  getTenantContext: vi.fn().mockResolvedValue({
    mode: 'personal',
    profileId: 'user-1',
    org: null,
  }),
}))

describe('DashboardPage', () => {
  it('renders dashboard title and subtitle', async () => {
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(
      screen.getByText(/Begin a new procedure plan or resume an active case/i)
    ).toBeInTheDocument()
  })

  it('renders Create New Case button', async () => {
    const ui = await DashboardPage()
    render(ui)

    const createButton = screen.getByRole('link', { name: /create new case/i })
    expect(createButton).toBeInTheDocument()
    expect(createButton).toHaveAttribute('href', '/wizard')
  })

  it('renders case sections', async () => {
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByText('Upcoming / In-Progress Cases')).toBeInTheDocument()
    expect(screen.getByText('Recent Completed Cases')).toBeInTheDocument()
  })

  it('renders quick actions section', async () => {
    const ui = await DashboardPage()
    render(ui)

    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
  })

  it('renders resume buttons for cases', async () => {
    const ui = await DashboardPage()
    render(ui)

    const resumeButtons = screen.getAllByRole('link', { name: /resume/i })
    expect(resumeButtons.length).toBeGreaterThan(0)
  })
})
