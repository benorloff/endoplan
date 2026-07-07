import { cn } from '@/lib/utils'

export interface PanelProps extends React.ComponentProps<'div'> {
  /** When true, panel has no outer border (nested inside another panel) */
  nested?: boolean
}

export function Panel({ className, nested, ...props }: PanelProps) {
  return (
    <div
      data-slot="panel"
      className={cn(
        'rounded-sm bg-surface-container',
        !nested && 'border border-outline-variant',
        className
      )}
      {...props}
    />
  )
}
