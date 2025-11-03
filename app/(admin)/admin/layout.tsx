import { getTenant } from '@/lib/tenant'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenant()

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
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">{children}</main>
    </div>
  )
}

