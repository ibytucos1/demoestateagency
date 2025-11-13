import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'
import { LandlordsDropdown } from '@/components/landlords-dropdown'
import { ServicesDropdown } from '@/components/services-dropdown'
import { NavigationProgress } from '@/components/navigation-progress'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const tenant = await getTenant()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavigationProgress />
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 relative">
            <Link href="/" className="flex items-center gap-2 group md:absolute md:left-4">
              <div className="bg-primary text-primary-foreground p-2 rounded-lg group-hover:scale-105 transition-transform">
                <Home className="h-5 w-5" />
              </div>
              <span className="text-2xl font-bold text-gray-900">{BRAND_NAME}</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
              <Link
                href="/search?type=sale"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Sell
              </Link>
              <Link
                href="/search?type=sale"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Buy
              </Link>
              <Link
                href="/search?type=rent"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Rent
              </Link>
              <LandlordsDropdown />
              <ServicesDropdown />
              <Link
                href="/contact"
                className="text-gray-700 hover:text-primary font-medium transition-colors"
              >
                Contact Us
              </Link>
            </nav>
            <div className="hidden md:block md:absolute md:right-4">
              <Button asChild>
                <Link href="/valuation">
                  Get a Free Valuation
                </Link>
              </Button>
            </div>
            <div className="md:hidden">
              <Button asChild variant="ghost" size="sm">
                <Link href="/search">
                  <Search className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{BRAND_NAME}</h3>
              <p className="text-sm">
                Your trusted partner in finding the perfect property.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/search" className="hover:text-white transition-colors">
                    Search Properties
                  </Link>
                </li>
                <li>
                  <Link href="/search?type=sale" className="hover:text-white transition-colors">
                    Properties for Sale
                  </Link>
                </li>
                <li>
                  <Link href="/search?type=rent" className="hover:text-white transition-colors">
                    Properties to Rent
                  </Link>
                </li>
                <li>
                  <Link href="/search?type=commercial" className="hover:text-white transition-colors">
                    Commercial Properties
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/admin" className="hover:text-white transition-colors">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <p className="text-sm">
                Get in touch for property enquiries and support.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

