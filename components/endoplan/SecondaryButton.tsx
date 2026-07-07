import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<typeof Button>

export function SecondaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        'h-8 rounded-sm border-outline-variant bg-surface-container-high px-3 text-xs font-medium text-foreground hover:bg-surface-container',
        className
      )}
      {...props}
    />
  )
}
