'use client'

import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { LeftNavRail } from '@/components/layout/LeftNavRail'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { StatusBar } from '@/components/layout/StatusBar'
import { CaseContextProvider } from '@/lib/layout/case-context'
import { ShellProvider, useShell } from '@/lib/layout/shell-context'

interface AppShellProps {
  children: React.ReactNode
}

function AppShellInner({ children }: AppShellProps) {
  const { sidebar } = useShell()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-surface">
      <GlobalHeader />
      <div className="flex min-h-0 flex-1">
        <LeftNavRail />
        <main className="min-w-0 flex-1 overflow-y-auto p-3">{children}</main>
        {sidebar && (
          <RightSidebar title={sidebar.title}>{sidebar.children}</RightSidebar>
        )}
      </div>
      <StatusBar />
    </div>
  )
}

export function AppShell({ children }: AppShellProps) {
  return (
    <CaseContextProvider>
      <ShellProvider>
        <AppShellInner>{children}</AppShellInner>
      </ShellProvider>
    </CaseContextProvider>
  )
}
