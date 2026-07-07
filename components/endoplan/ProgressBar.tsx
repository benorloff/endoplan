import { cn } from '@/lib/utils'

export interface ProgressBarProps extends React.ComponentProps<'div'> {
  value: number
  max?: number
}

export function ProgressBar({
  value,
  max = 100,
  className,
  ...props
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      className={cn(
        'h-1 w-full overflow-hidden rounded-full bg-surface-container-high',
        className
      )}
      {...props}
    >
      <div
        className="h-full rounded-full bg-primary transition-all"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
