import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<typeof Button>

export function PrimaryButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        'h-8 rounded-sm bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90',
        className
      )}
      {...props}
    />
  )
}
