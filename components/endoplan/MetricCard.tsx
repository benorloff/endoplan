import { cn } from '@/lib/utils'

export interface MetricCardProps extends React.ComponentProps<'div'> {
  label: string
  value: string
  unit?: string
}

export function MetricCard({ label, value, unit, className, ...props }: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-sm border border-outline-variant bg-surface-container-low px-3 py-2',
        className
      )}
      {...props}
    >
      <p className="text-label-caps text-primary">{label}</p>
      <p className="mt-1 text-lg font-semibold tracking-tight text-foreground">
        {value}
        {unit && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            {unit}
          </span>
        )}
      </p>
    </div>
  )
}
