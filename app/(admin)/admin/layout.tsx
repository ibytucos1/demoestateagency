import { getTenant } from '@/lib/tenant'
import { getCurrentUser } from '@/lib/rbac'
import { getCurrentUserId } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin-sidebar'
import { AdminLayoutWrapper } from '@/components/admin-layout-wrapper'
import { NavigationProgress } from '@/components/navigation-progress'

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
    <div className="min-h-screen bg-gray-50">
      <NavigationProgress />
      
      {/* Collapsible Sidebar */}
      <AdminSidebar 
        tenant={{ id: tenant.id, name: tenant.name }} 
        user={{ name: user.name, email: user.email, role: user.role }}
      />

      {/* Main Content - dynamically adjusts based on sidebar state */}
      <AdminLayoutWrapper>
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
      </AdminLayoutWrapper>
    </div>
  )
}
