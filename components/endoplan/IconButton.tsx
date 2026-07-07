import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type ButtonProps = React.ComponentProps<typeof Button>

export function IconButton({ className, size = 'icon-sm', ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      size={size}
      className={cn(
        'size-7 rounded-sm text-muted-foreground hover:bg-surface-container-high hover:text-foreground',
        className
      )}
      {...props}
    />
  )
}
