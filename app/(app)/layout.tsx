import Link from 'next/link'
import { SignOutButton } from '@/components/SignOutButton'
import { requireAuth } from '@/lib/auth/get-user'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireAuth()

  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/dashboard" className="font-semibold">
              EndoPlan
            </Link>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">
              Dashboard
            </Link>
            <Link href="/cases/new" className="text-muted-foreground hover:text-foreground">
              New case
            </Link>
          </nav>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted-foreground">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  )
}
