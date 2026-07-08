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
    href: '/case/create',
    icon: CirclePlus,
    matchPrefixes: ['/case/create'],
  },
  {
    id: 'measurements',
    label: 'Measurements',
    href: '/case/measurements',
    icon: Ruler,
    matchPrefixes: ['/case/measurements'],
  },
  {
    id: 'procedure-planner',
    label: 'Procedure Planner',
    href: '/case/planner',
    icon: Compass,
    matchPrefixes: ['/case/planner'],
  },
  {
    id: 'case-summary',
    label: 'Case Summary',
    href: '/case/summary',
    icon: ClipboardCheck,
    matchPrefixes: ['/case/summary'],
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
    href: '/manufacturers',
    icon: Factory,
    matchPrefixes: ['/manufacturers'],
  },
]

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    matchPrefixes: ['/settings'],
  },
]

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.id === 'new-case') {
    return pathname === '/case/create'
  }
  return item.matchPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )
}
