'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface AdminLayoutWrapperProps {
  children: React.ReactNode
}

export function AdminLayoutWrapper({ children }: AdminLayoutWrapperProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    // Check initial state
    const saved = localStorage.getItem('admin-sidebar-collapsed')
    if (saved !== null) {
      setIsCollapsed(saved === 'true')
    }

    // Listen for sidebar state changes
    const handleStorageChange = () => {
      const saved = localStorage.getItem('admin-sidebar-collapsed')
      setIsCollapsed(saved === 'true')
    }

    // Listen to storage events (for changes from other tabs)
    window.addEventListener('storage', handleStorageChange)
    
    // Custom event for same-tab changes
    window.addEventListener('sidebar-toggle', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('sidebar-toggle', handleStorageChange)
    }
  }, [])

  return (
    <div
      className={cn(
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'ml-20' : 'ml-64'
      )}
    >
      {children}
    </div>
  )
}

