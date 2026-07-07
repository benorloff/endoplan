import { MoreVertical } from 'lucide-react'
import { IconButton } from '@/components/endoplan/IconButton'
import { cn } from '@/lib/utils'

export interface RightSidebarProps {
  title?: string
  children: React.ReactNode
  className?: string
}

export function RightSidebar({ title, children, className }: RightSidebarProps) {
  return (
    <aside
      className={cn(
        'flex w-[var(--spacing-sidebar-width)] shrink-0 flex-col border-l border-outline-variant bg-surface-container-low',
        className
      )}
    >
      {title && (
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-outline-variant px-3">
          <h2 className="text-label-caps text-muted-foreground">{title}</h2>
          <IconButton aria-label="Sidebar menu" size="sm">
            <MoreVertical className="size-4" />
          </IconButton>
        </div>
      )}
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
    </aside>
  )
}
