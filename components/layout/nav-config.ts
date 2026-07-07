import {
  LayoutDashboard,
  FolderOpen,
  CirclePlus,
  Ruler,
  Compass,
  ClipboardCheck,
  Package,
  Factory,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  id: string
  label: string
  href: string
  icon: LucideIcon
  /** Path prefixes that mark this item active */
  matchPrefixes: string[]
}

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    matchPrefixes: ['/dashboard'],
  },
  {
    id: 'cases',
    label: 'Cases',
    href: '/cases',
    icon: FolderOpen,
    matchPrefixes: ['/cases'],
  },
  {
    id: 'new-case',
    label: 'New Case',
    href: '/wizard',
    icon: CirclePlus,
    matchPrefixes: ['/wizard'],
  },
  {
    id: 'measurements',
    label: 'Measurements',
    href: '/wizard',
    icon: Ruler,
    matchPrefixes: ['/wizard/measurements'],
  },
  {
    id: 'procedure-planner',
    label: 'Procedure Planner',
    href: '/wizard',
    icon: Compass,
    matchPrefixes: ['/wizard/planner'],
  },
  {
    id: 'case-summary',
    label: 'Case Summary',
    href: '/wizard',
    icon: ClipboardCheck,
    matchPrefixes: ['/wizard/summary'],
  },
  {
    id: 'device-library',
    label: 'Device Library',
    href: '/catalog',
    icon: Package,
    matchPrefixes: ['/catalog'],
  },
  {
    id: 'manufacturers',
    label: 'Manufacturers',
    href: '/locations',
    icon: Factory,
    matchPrefixes: ['/locations'],
  },
]

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard',
    icon: Settings,
    matchPrefixes: [],
  },
]

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.id === 'new-case') {
    return pathname === '/wizard' || pathname.startsWith('/wizard/')
  }
  return item.matchPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}
