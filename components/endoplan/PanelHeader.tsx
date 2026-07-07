import { cn } from '@/lib/utils'

export interface PanelHeaderProps extends React.ComponentProps<'div'> {
  title: string
  subtitle?: string
  action?: React.ReactNode
  step?: number
}

export function PanelHeader({
  title,
  subtitle,
  action,
  step,
  className,
  ...props
}: PanelHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b border-outline-variant px-3 py-2',
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {step !== undefined && (
          <span className="text-label-caps text-primary">{step}.</span>
        )}
        <div>
          <h3 className="text-label-caps text-foreground">{title}</h3>
          {subtitle && (
            <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  )
}
