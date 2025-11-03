import { getTenant } from '@/lib/tenant'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenant()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            {tenant.name}
          </Link>
          <nav className="flex gap-4">
            <Link href="/search">Search</Link>
            <Link href="/admin">Admin</Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t mt-auto py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {tenant.name}. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

