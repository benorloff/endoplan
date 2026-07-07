'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  isNavItemActive,
} from '@/components/layout/nav-config'
import { cn } from '@/lib/utils'

export function LeftNavRail() {
  const pathname = usePathname()

  return (
    <nav
      className="flex w-[var(--spacing-toolbar-width)] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest"
      aria-label="Primary navigation"
    >
      <div className="flex flex-1 flex-col gap-0.5 py-2">
        {PRIMARY_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item)
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'group relative mx-1.5 flex size-9 items-center justify-center rounded-sm transition-colors',
                active
                  ? 'bg-surface-container-high text-primary'
                  : 'text-muted-foreground hover:bg-surface-container-high hover:text-foreground'
              )}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <span className="absolute left-0 top-1 bottom-1 w-0.5 rounded-r bg-primary" />
              )}
              <Icon className="size-4" />
              <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-sm border border-outline-variant bg-surface-container px-2 py-1 text-xs text-foreground group-hover:block">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>

      <div className="border-t border-outline-variant py-2">
        {SECONDARY_NAV_ITEMS.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.id}
              href={item.href}
              className="group relative mx-1.5 flex size-9 items-center justify-center rounded-sm text-muted-foreground transition-colors hover:bg-surface-container-high hover:text-foreground"
              aria-label={item.label}
            >
              <Icon className="size-4" />
              <span className="pointer-events-none absolute left-full z-50 ml-2 hidden whitespace-nowrap rounded-sm border border-outline-variant bg-surface-container px-2 py-1 text-xs text-foreground group-hover:block">
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
