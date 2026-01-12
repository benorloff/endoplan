'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Heart, Settings, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * Navigation bar component for the application header
 */
export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center justify-between border-b bg-white px-6 py-4">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" />
        <span className="text-xl font-semibold">EndoPlan</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className={`text-sm font-medium transition-colors ${
              pathname === '/dashboard'
                ? 'border-b-2 border-primary pb-1 text-foreground'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/cases"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            My Cases
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User menu">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
