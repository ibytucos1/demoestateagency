import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Landlords',
  description: 'Comprehensive landlord services',
}

export default async function LandlordsPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Landlords</h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to {tenant.name}'s landlord services. We provide comprehensive property management
          and rental services for property owners.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Link href="/landlords/let" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Let</h2>
            <p className="text-gray-700">
              Professional lettings service with three flexible plans to suit your needs. From 
              let-only to fully managed services.
            </p>
          </Link>

          <Link href="/landlords/fees" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Landlords Fees</h2>
            <p className="text-gray-700">
              Transparent fee structure with no hidden charges. Competitive rates for all service levels.
            </p>
          </Link>

          <Link href="/landlords/property-management" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Property Management</h2>
            <p className="text-gray-700">
              Comprehensive property management services including 24/7 maintenance support and 
              regular inspections.
            </p>
          </Link>

          <Link href="/landlords/refurbishment-projects" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Refurbishment Projects</h2>
            <p className="text-gray-700">
              Professional refurbishment services from minor updates to complete renovations. 
              Project management included.
            </p>
          </Link>

          <Link href="/landlords/block-management" className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-xl font-semibold mb-2 text-blue-600">Block Management</h2>
            <p className="text-gray-700">
              Comprehensive block management for residential and commercial properties. Financial 
              management and compliance included.
            </p>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
          <p className="text-gray-700 mb-6">
            Contact us to learn more about our landlord services and request a free valuation.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/landlords/let">Request a Valuation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

