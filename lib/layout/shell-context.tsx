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
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

const ShellContext = createContext<ShellContextState | null>(null)

const WORKSTATION_BREAKPOINT = 1280

export function ShellProvider({ children }: { children: ReactNode }) {
  const [sidebar, setSidebarState] = useState<SidebarSlot | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const setSidebar = useCallback((slot: SidebarSlot | null) => {
    setSidebarState(slot)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${WORKSTATION_BREAKPOINT}px)`)
    const onChange = () => {
      if (mq.matches) setSidebarOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <ShellContext.Provider
      value={{ sidebar, setSidebar, sidebarOpen, setSidebarOpen }}
    >
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
