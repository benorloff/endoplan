'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

export interface SidebarSlot {
  title?: string
  children: ReactNode
}

interface ShellContextState {
  sidebar: SidebarSlot | null
  setSidebar: (slot: SidebarSlot | null) => void
}

const ShellContext = createContext<ShellContextState | null>(null)

export function ShellProvider({ children }: { children: ReactNode }) {
  const [sidebar, setSidebarState] = useState<SidebarSlot | null>(null)

  const setSidebar = useCallback((slot: SidebarSlot | null) => {
    setSidebarState(slot)
  }, [])

  return (
    <ShellContext.Provider value={{ sidebar, setSidebar }}>
      {children}
    </ShellContext.Provider>
  )
}

export function useShell() {
  const ctx = useContext(ShellContext)
  if (!ctx) {
    throw new Error('useShell must be used within ShellProvider')
  }
  return ctx
}

/**
 * Register page-specific sidebar content with the workstation shell.
 * Renders nothing — content is displayed in RightSidebar via AppShell.
 */
export function ShellSidebar({
  title,
  children,
}: {
  title?: string
  children: ReactNode
}) {
  const { setSidebar } = useShell()

  useEffect(() => {
    setSidebar({ title, children })
    return () => setSidebar(null)
  }, [title, children, setSidebar])

  return null
}
