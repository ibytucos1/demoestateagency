import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Property Management',
  description: 'Comprehensive property management services for landlords',
}

export default async function PropertyManagementPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Property Management</h1>
        <p className="text-lg text-gray-600 mb-8">
          Comprehensive property management services designed to give you peace of mind while 
          maximizing your rental income.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
            <p className="text-gray-700 mb-6">
              Our property management service is designed to handle all aspects of your rental 
              property, allowing you to enjoy passive income without the day-to-day hassles. 
              Over 95% of our landlords employ our full management service.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">24/7 Maintenance Support</h3>
              <p className="text-gray-700">
                Direct access to our property management team, responding to and handling tenants' 
                maintenance requests 24 hours a day. We ensure issues are resolved quickly and efficiently.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">In-House Contractors</h3>
              <p className="text-gray-700">
                Provision of our in-house contractors available at short notice and very competitive 
                rates. Quality workmanship guaranteed.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Repairs & Maintenance</h3>
              <p className="text-gray-700">
                Arranging repairs, maintenance and refurbishments as required. We work with trusted 
                third-party contractors based on best value prices, giving access and settling invoices.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Property Inspections</h3>
              <p className="text-gray-700">
                Overseeing maintenance works and regular property inspections to ensure your property 
                is well-maintained and tenants are complying with their obligations.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Safety Certificates</h3>
              <p className="text-gray-700">
                Arranging Gas safety checks, EPCs, Electrical safety inspections, Floor plans, etc. 
                as and when required to ensure full compliance.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Void Management</h3>
              <p className="text-gray-700">
                Management of your Property through any voids. We minimize void periods and ensure 
                quick turnaround between tenancies.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Monthly Reporting</h3>
              <p className="text-gray-700">
                Monthly maintenance reporting so you're always informed about the condition and 
                any issues with your property.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Utility Management</h3>
              <p className="text-gray-700">
                Notification to utility providers at the start and end of tenancy, ensuring smooth 
                transitions and proper billing.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Deposit Management</h3>
              <p className="text-gray-700">
                End of tenancy dilapidations management and deposit returns. We handle negotiations 
                and ensure fair resolution of any disputes.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Licensing Compliance</h3>
              <p className="text-gray-700">
                Assistance with property licensing regulations. We keep you compliant with all 
                local authority requirements.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Our Property Management Service?</h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Experienced team with extensive knowledge of property management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Competitive fees with transparent pricing</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>24/7 support for urgent maintenance issues</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Regular property inspections to protect your investment</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Full compliance with all legal and safety requirements</span>
            </li>
          </ul>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/landlords/fees">View Fees</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

