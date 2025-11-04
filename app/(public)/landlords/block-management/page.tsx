import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Block Management',
  description: 'Professional block management services for residential and commercial properties',
}

export default async function BlockManagementPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Block Management</h1>
        <p className="text-lg text-gray-600 mb-8">
          Comprehensive block management services for residential and commercial properties. 
          We handle all aspects of managing multi-unit developments, ensuring smooth operations 
          and satisfied residents.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Block Management Services</h2>
            <p className="text-gray-700 mb-6">
              Whether you manage a residential block, commercial building, or mixed-use development, 
              our experienced team provides comprehensive management services tailored to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Financial Management</h3>
              <p className="text-gray-700">
                Complete financial management including service charge collection, budgeting, 
                annual accounts, and financial reporting. Transparent and accurate financial records.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Maintenance & Repairs</h3>
              <p className="text-gray-700">
                Coordinating maintenance and repairs for common areas, building fabric, and 
                shared facilities. Regular inspections and proactive maintenance planning.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Contractor Management</h3>
              <p className="text-gray-700">
                Managing relationships with contractors, obtaining quotes, and overseeing works. 
                We ensure quality workmanship and value for money.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Health & Safety Compliance</h3>
              <p className="text-gray-700">
                Ensuring full compliance with health and safety regulations, fire safety, 
                risk assessments, and building regulations. Regular safety audits and documentation.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Insurance Management</h3>
              <p className="text-gray-700">
                Arranging and managing block insurance, ensuring adequate cover and competitive 
                premiums. Handling claims and liaising with insurers.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Resident Communication</h3>
              <p className="text-gray-700">
                Regular communication with residents, handling enquiries, complaints, and 
                maintenance requests. Professional and responsive service.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Grounds & Common Areas</h3>
              <p className="text-gray-700">
                Management of gardens, car parks, corridors, lifts, and all common areas. 
                Ensuring clean, safe, and well-maintained shared spaces.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Lease Administration</h3>
              <p className="text-gray-700">
                Managing lease compliance, leaseholder consultations, and enforcement of 
                lease terms. Supporting leaseholders and freeholders.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Major Works Projects</h3>
              <p className="text-gray-700">
                Planning and managing major works projects including roof replacements, 
                external decorations, and structural repairs. Section 20 consultations and 
                contractor management.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Emergency Response</h3>
              <p className="text-gray-700">
                24/7 emergency response for urgent issues. We ensure rapid response to 
                emergencies to minimize disruption and damage.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Our Block Management Service?</h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Experienced team with extensive knowledge of block management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Transparent financial management and reporting</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Proactive maintenance planning to prevent costly repairs</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Full compliance with all legal and regulatory requirements</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>24/7 emergency support for peace of mind</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Competitive fees with no hidden charges</span>
            </li>
          </ul>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Get Started</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/landlords">View All Services</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

