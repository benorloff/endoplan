'use client'

import Link from 'next/link'
import { FolderOpen, Bookmark, Settings, HelpCircle } from 'lucide-react'
import { Panel, PanelHeader } from '@/components/endoplan'
import { SecondaryButton } from '@/components/endoplan/SecondaryButton'

/**
 * Quick actions panel component
 */
export function QuickActions() {
  const actions = [
    { icon: FolderOpen, label: 'My Cases', href: '/cases' },
    { icon: Bookmark, label: 'Saved Templates', href: '/templates' },
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: HelpCircle, label: 'Help / About', href: '/help' },
  ]

  return (
    <Panel>
      <PanelHeader title="Quick Actions" />
      <div className="grid grid-cols-2 gap-2 p-3">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <SecondaryButton
              key={action.href}
              asChild
              className="flex h-16 flex-col items-center justify-center gap-1.5"
            >
              <Link href={action.href}>
                <Icon className="size-4" />
                <span className="text-label-caps">{action.label}</span>
              </Link>
            </SecondaryButton>
          )
        })}
      </div>
    </Panel>
  )
}
