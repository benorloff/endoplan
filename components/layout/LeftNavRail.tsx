'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  PRIMARY_NAV_ITEMS,
  SECONDARY_NAV_ITEMS,
  isNavItemActive,
} from '@/components/layout/nav-config'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

function NavLink({
  item,
  active,
}: {
  item: (typeof PRIMARY_NAV_ITEMS)[number]
  active: boolean
}) {
  const Icon = item.icon

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.href}
          className={cn(
            'relative mx-1.5 flex size-9 items-center justify-center rounded-sm transition-colors',
            active
              ? 'bg-surface-container-high text-primary'
              : 'text-muted-foreground hover:bg-surface-container-high hover:text-foreground'
          )}
          aria-label={item.label}
          aria-current={active ? 'page' : undefined}
        >
          {active && (
            <span className="absolute bottom-1 left-0 top-1 w-0.5 rounded-r bg-primary" />
          )}
          <Icon className="size-4" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  )
}

export function LeftNavRail() {
  const pathname = usePathname()

  return (
    <nav
      className="flex w-[var(--spacing-toolbar-width)] shrink-0 flex-col border-r border-outline-variant bg-surface-container-lowest"
      aria-label="Primary navigation"
    >
      <div className="flex flex-1 flex-col gap-0.5 py-2">
        {PRIMARY_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            item={item}
            active={isNavItemActive(pathname, item)}
          />
        ))}
      </div>

      <div className="border-t border-outline-variant py-2">
        {SECONDARY_NAV_ITEMS.map((item) => {
          const active = isNavItemActive(pathname, item)
          return (
            <NavLink key={item.id} item={item} active={active} />
          )
        })}
      </div>
    </nav>
  )
}
