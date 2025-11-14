'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  FileText,
  Settings,
  ExternalLink,
  Building,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

interface AdminSidebarProps {
  tenant: {
    id: string
    name: string
  }
  user: {
    name: string | null
    email: string
    role: string
  }
}

export function AdminSidebar({ tenant, user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Load collapsed state from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }
  }, [])

  // Save collapsed state to localStorage and dispatch event
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('admin-sidebar-collapsed', String(newState))
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

  const navItems = [
    {
      href: '/admin/listings',
      icon: LayoutDashboard,
      label: 'Listings',
    },
    {
      href: '/admin/property-management',
      icon: ClipboardList,
      label: 'Property Management',
    },
    {
      href: '/admin/leads',
      icon: FileText,
      label: 'Leads',
    },
    {
      href: '/admin/settings',
      icon: Settings,
      label: 'Settings',
    },
  ]

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Logo and Toggle */}
      <div className={cn(
        "h-16 border-b border-gray-200 transition-all duration-300",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {isCollapsed ? (
          // Collapsed State - Stacked Layout
          <div className="h-full flex flex-col items-center justify-center gap-1">
            <Link href="/admin" className="flex items-center justify-center">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-sm">
                <Building className="h-5 w-5 text-white" />
              </div>
            </Link>
          </div>
        ) : (
          // Expanded State - Horizontal Layout
          <div className="h-full flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3 min-w-0 flex-1">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                <Building className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-base font-bold text-gray-900 whitespace-nowrap">
                  {tenant.name}
                </div>
                <div className="text-xs text-gray-500 whitespace-nowrap">Admin Portal</div>
              </div>
            </Link>
            
            {/* Toggle Button - Only visible when expanded */}
            <button
              onClick={toggleCollapse}
              className="flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all duration-200 flex-shrink-0"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Toggle Button - Collapsed State (Below Logo) */}
      {isCollapsed && (
        <div className="px-2 pt-2 pb-4 border-b border-gray-100">
          <button
            onClick={toggleCollapse}
            className="w-full flex items-center justify-center p-2.5 text-gray-600 hover:text-primary hover:bg-blue-50 rounded-lg transition-all duration-200"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname?.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 group relative',
                isActive
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
                isCollapsed && 'justify-center px-2'
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span
                className={cn(
                  'transition-all duration-300 whitespace-nowrap',
                  isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
                )}
              >
                {item.label}
              </span>

              {/* Tooltip on hover when collapsed */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 shadow-lg">
                  {item.label}
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900" />
                </div>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Bottom Section */}
      <div className="p-3 border-t border-gray-200 space-y-2">
        <Button
          variant="outline"
          size="sm"
          asChild
          className={cn(
            'w-full gap-2 transition-all duration-200',
            isCollapsed ? 'justify-center px-2' : 'justify-start'
          )}
        >
          <Link href="/">
            <ExternalLink className="h-4 w-4 flex-shrink-0" />
            <span
              className={cn(
                'transition-all duration-300',
                isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
              )}
            >
              View Site
            </span>
          </Link>
        </Button>

        {/* User Info */}
        <div
          className={cn(
            'px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 transition-all duration-200',
            isCollapsed && 'px-2 py-3'
          )}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 text-white text-sm font-bold shadow-sm">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <div
              className={cn(
                'flex-1 min-w-0 transition-all duration-300',
                isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'
              )}
            >
              <div className="text-sm font-semibold text-gray-900 truncate">
                {user.name || user.email.split('@')[0]}
              </div>
              <div className="text-xs text-gray-500 capitalize">{user.role}</div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

