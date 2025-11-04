import { getTenant } from '@/lib/tenant'
import { getCurrentUser } from '@/lib/rbac'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserMenu } from '@/components/user-menu'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenant()
  const tenantId = tenant.id
  console.log(`[AdminLayout] Tenant: id=${tenantId}, slug=${tenant.slug}`)
  
  const user = await getCurrentUser(tenantId)
  console.log(`[AdminLayout] User check result: ${user ? `Found user ${user.email}` : 'No user found'}`)

  if (!user) {
    console.log('[AdminLayout] Redirecting to sign-in - no user found')
    redirect('/sign-in?redirect_url=/admin')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="text-2xl font-bold">
              {tenant.name} Admin
            </Link>
            <nav className="flex gap-4">
              <Link href="/admin/listings">Listings</Link>
              <Link href="/admin/leads">Leads</Link>
              <Link href="/admin/settings">Settings</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost">View Site</Button>
            </Link>
            <UserMenu user={user} />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
