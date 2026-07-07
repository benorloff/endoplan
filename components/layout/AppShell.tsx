'use client'

import { PanelLeft } from 'lucide-react'
import { GlobalHeader } from '@/components/layout/GlobalHeader'
import { LeftNavRail } from '@/components/layout/LeftNavRail'
import { RightSidebar } from '@/components/layout/RightSidebar'
import { StatusBar } from '@/components/layout/StatusBar'
import { IconButton } from '@/components/endoplan/IconButton'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { CaseContextProvider } from '@/lib/layout/case-context'
import { CaseContextSync } from '@/lib/layout/case-context-sync'
import { ShellProvider, useShell } from '@/lib/layout/shell-context'
import { TooltipProvider } from '@/components/ui/tooltip'

interface AppShellProps {
  children: React.ReactNode
  userInitials: string
}

function AppShellInner({ children, userInitials }: AppShellProps) {
  const { sidebar, sidebarOpen, setSidebarOpen } = useShell()

  return (
    <div className="clinical-workspace flex h-screen flex-col overflow-hidden">
      <GlobalHeader />
      <div className="flex min-h-0 flex-1">
        <LeftNavRail />
        <main className="relative min-w-0 flex-1 overflow-y-auto p-3">
          {sidebar && (
            <div className="absolute right-3 top-3 z-10 xl:hidden">
              <IconButton
                aria-label="Open case panel"
                onClick={() => setSidebarOpen(true)}
              >
                <PanelLeft className="size-4" />
              </IconButton>
            </div>
          )}
          {children}
        </main>
        {sidebar && (
          <RightSidebar
            title={sidebar.title}
            className="hidden xl:flex"
          >
            {sidebar.children}
          </RightSidebar>
        )}
      </div>
      <StatusBar />

      {sidebar && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent
            side="right"
            className="w-[var(--spacing-sidebar-width)] border-outline-variant bg-surface-container-low p-0"
          >
            <SheetHeader className="border-b border-outline-variant px-3 py-2">
              <SheetTitle className="text-label-caps text-muted-foreground">
                {sidebar.title ?? 'Panel'}
              </SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto p-3">{sidebar.children}</div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  )
}

export function AppShell({ children, userInitials }: AppShellProps) {
  return (
    <CaseContextProvider>
      <ShellProvider>
        <TooltipProvider>
          <CaseContextSync userInitials={userInitials} />
          <AppShellInner userInitials={userInitials}>{children}</AppShellInner>
        </TooltipProvider>
      </ShellProvider>
    </CaseContextProvider>
  )
}
