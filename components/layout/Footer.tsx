import Link from 'next/link'
import { Headphones } from 'lucide-react'

/**
 * Footer component
 */
export function Footer() {
  return (
    <footer className="mt-auto border-t bg-white px-6 py-6">
      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© 2025 EndoPlanner Pro</div>
        <div className="flex items-center gap-4">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            Terms of Service
          </Link>
          <span>Version 2.1.0</span>
          <Link href="/support" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <Headphones className="h-4 w-4" />
            Support
          </Link>
        </div>
      </div>
    </footer>
  )
}
