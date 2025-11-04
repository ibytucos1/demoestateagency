import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Investing & Land',
  description: 'Property investment and land development services',
}

export default async function InvestingLandPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Investing & Land</h1>
        <p className="text-lg text-gray-600 mb-8">
          Expert guidance for property investors and land developers. We help you identify opportunities 
          and maximize returns on your investments.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Property Investment Services</h2>
            <p className="text-gray-700 mb-6">
              Whether you're a seasoned investor or new to property investment, our team provides 
              comprehensive support to help you build and manage a successful portfolio.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Investment Opportunities</h3>
                <p className="text-gray-700">
                  Access to exclusive investment properties with strong rental yields and capital growth potential. 
                  We identify properties that match your investment criteria.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Portfolio Management</h3>
                <p className="text-gray-700">
                  Comprehensive portfolio management services including property acquisition, tenant management, 
                  and strategic planning for growth.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Yield Analysis</h3>
                <p className="text-gray-700">
                  Detailed rental yield calculations and investment return analysis to help you make 
                  informed decisions about your property investments.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Market Insights</h3>
                <p className="text-gray-700">
                  Expert market analysis and insights into emerging investment areas, rental trends, 
                  and capital growth opportunities.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Land Development Services</h2>
            <p className="text-gray-700 mb-6">
              Our land development services help you identify, acquire, and develop land for residential 
              or commercial purposes. We guide you through the entire development process.
            </p>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>Land identification and site assessment</li>
              <li>Planning permission guidance and applications</li>
              <li>Development feasibility studies</li>
              <li>Land acquisition and negotiation</li>
              <li>Project management and coordination</li>
              <li>Sales and marketing of completed developments</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Why Work With Us?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Extensive local market knowledge and experience</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Strong network of developers, contractors, and investors</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Proven track record in successful property investments</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Comprehensive support from acquisition to completion</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Explore Investment Opportunities</h2>
          <p className="text-gray-700 mb-6">
            Contact us to discuss your investment goals and discover how we can help you achieve them.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/search">View Properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

