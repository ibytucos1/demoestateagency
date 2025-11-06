import { getTenant } from '@/lib/tenant'
import { getCurrentUser } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'
import {
  Home,
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  ExternalLink,
  Building,
  ClipboardList,
} from 'lucide-react'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get user first to determine their tenant
  const authId = await getCurrentUserId()
  
  if (!authId) {
    redirect('/sign-in?redirect_url=/admin')
  }

  // Get user from DB to find their tenant
  const userRecord = await db.user.findUnique({
    where: { authId },
    include: { Tenant: true },
  })

  if (!userRecord) {
    redirect('/sign-in?redirect_url=/admin')
  }

  // Use the user's actual tenant
  const tenant = userRecord.Tenant
  const tenantId = tenant.id
  const user = await getCurrentUser(tenantId)

  if (!user) {
    redirect('/sign-in?redirect_url=/admin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed inset-y-0 left-0 z-50 flex flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Building className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900">{tenant.name}</div>
              <div className="text-xs text-gray-500">Admin Portal</div>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
          <Link 
            href="/admin/listings" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Listings
          </Link>
          <Link
            href="/admin/property-management"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <ClipboardList className="h-5 w-5" />
            Property Management
          </Link>
          <Link 
            href="/admin/leads" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <FileText className="h-5 w-5" />
            Leads
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900 rounded-lg transition-colors"
          >
            <Settings className="h-5 w-5" />
            Settings
          </Link>
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-200 space-y-2">
          <Button variant="outline" size="sm" asChild className="w-full justify-start gap-2">
            <Link href="/">
              <ExternalLink className="h-4 w-4" />
              View Site
            </Link>
          </Button>
          <div className="px-3 py-2">
            <UserMenu user={user} />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="h-full px-6 flex items-center justify-between">
            <div className="flex-1" />
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                Welcome back, <span className="font-medium text-gray-900">{user.name || user.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="px-6 py-8 max-w-[1600px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
