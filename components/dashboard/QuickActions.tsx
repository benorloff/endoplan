'use client'

import Link from 'next/link'
import { FolderOpen, Bookmark, Settings, HelpCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

/**
 * Quick actions panel component
 */
export function QuickActions() {
  const actions = [
    {
      icon: FolderOpen,
      label: 'My Cases',
      href: '/cases',
    },
    {
      icon: Bookmark,
      label: 'Saved Templates',
      href: '/templates',
    },
    {
      icon: Settings,
      label: 'User Preferences',
      href: '/preferences',
    },
    {
      icon: HelpCircle,
      label: 'Help / About',
      href: '/help',
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Button
                key={action.href}
                asChild
                variant="outline"
                className="flex h-20 flex-col items-center justify-center gap-2"
              >
                <Link href={action.href}>
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{action.label}</span>
                </Link>
              </Button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
