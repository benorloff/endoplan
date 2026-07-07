import { requireAuth } from '@/lib/auth/get-user'
import { getUserInitials } from '@/lib/auth/user-initials'
import { AppShell } from '@/components/layout/AppShell'

export default async function WorkstationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, profile } = await requireAuth()

  const userInitials = getUserInitials(
    profile?.display_name,
    user.email
  )

  return <AppShell userInitials={userInitials}>{children}</AppShell>
}
