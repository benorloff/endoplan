import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center rounded-sm px-1.5 py-0.5 text-label-caps',
  {
    variants: {
      variant: {
        default: 'bg-surface-container-high text-muted-foreground',
        draft: 'bg-surface-container-high text-muted-foreground',
        success: 'bg-clinical-success/15 text-clinical-success',
        warning: 'bg-clinical-warning/15 text-clinical-warning',
        critical: 'bg-clinical-critical/15 text-clinical-critical',
        primary: 'bg-primary/15 text-primary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface StatusBadgeProps
  extends React.ComponentProps<'span'>,
    VariantProps<typeof statusBadgeVariants> {}

export function StatusBadge({
  className,
  variant,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant }), className)}
      {...props}
    />
  )
}
