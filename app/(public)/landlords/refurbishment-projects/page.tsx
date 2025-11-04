import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Refurbishment Projects',
  description: 'Professional property refurbishment services',
}

export default async function RefurbishmentProjectsPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Refurbishment Projects</h1>
        <p className="text-lg text-gray-600 mb-8">
          Transform your property with our professional refurbishment services. From minor updates 
          to complete renovations, we manage every aspect of your project.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Refurbishment Services</h2>
            <p className="text-gray-700 mb-6">
              Whether you're preparing a property for let, increasing rental value, or updating 
              an existing property, our refurbishment team can help. We handle projects of all 
              sizes with the same attention to detail and professional standards.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Project Planning</h3>
              <p className="text-gray-700">
                Comprehensive project planning including cost assessments, timelines, and 
                specification of works. We ensure your project stays on budget and on schedule.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Contractor Management</h3>
              <p className="text-gray-700">
                Arranging access and assessing costs with contractors. We work with trusted 
                professionals to ensure quality workmanship at competitive rates.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Quality Assurance</h3>
              <p className="text-gray-700">
                Ensuring work has been carried out in accordance with the Specification of Works. 
                We conduct regular inspections throughout the project.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Warranty Management</h3>
              <p className="text-gray-700">
                Retaining any resulting warranty or guarantee documentation. We ensure you're 
                protected long after the project is complete.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Kitchen Refurbishments</h3>
              <p className="text-gray-700">
                Complete kitchen renovations including design, fitting, and installation. Modern, 
                functional kitchens that add value to your property.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Bathroom Refurbishments</h3>
              <p className="text-gray-700">
                Full bathroom renovations from tiling to plumbing. We create modern, 
                water-efficient bathrooms that tenants love.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Decoration & Finishing</h3>
              <p className="text-gray-700">
                Professional painting, decorating, and finishing touches. We ensure a high-quality 
                finish throughout your property.
              </p>
            </div>

            <div className="bg-white border rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Electrical & Plumbing</h3>
              <p className="text-gray-700">
                Electrical rewires, plumbing upgrades, and heating installations. All work 
                carried out by qualified, certified professionals.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold mb-4">Arrangement Fees</h3>
          <p className="text-gray-700 mb-2">
            For refurbishment projects over £1,000, we charge an arrangement fee of 
            <strong> 14% of net cost</strong>.
          </p>
          <p className="text-sm text-gray-600">
            This covers arranging access, assessing costs with contractors, ensuring work 
            compliance, and retaining warranties. We work with multiple contractors to ensure 
            you get the best value.
          </p>
        </div>

        <div className="bg-blue-50 rounded-lg p-8">
          <h2 className="text-2xl font-semibold mb-4">Why Choose Our Refurbishment Service?</h2>
          <ul className="space-y-3 text-gray-700 mb-6">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Experienced project managers overseeing every aspect</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Access to trusted contractors at competitive rates</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Quality assurance and regular inspections</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Warranty and guarantee management</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Projects completed on time and on budget</span>
            </li>
          </ul>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Get a Quote</Link>
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

