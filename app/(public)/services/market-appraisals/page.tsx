import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Market Appraisals',
  description: 'Free property valuations and market appraisals',
}

export default async function MarketAppraisalsPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Market Appraisals</h1>
        <p className="text-lg text-gray-600 mb-8">
          Tap into decades of experience in the property market. Get a free, no-obligation valuation 
          of your property.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">How Much Is Your Property Worth?</h2>
            <p className="text-gray-700 mb-6">
              The first step in making that property move is to find out what your current property 
              is worth. Our friendly team is ready and waiting to provide you with a free, 
              no-obligation market valuation.
            </p>
            <p className="text-gray-700 mb-6">
              {tenant.name} has a team of extremely experienced property experts with detailed knowledge 
              of the local property market. We'll take time to listen to what you want or need to achieve 
              from your property sale and then compare your property with similar properties in the area 
              to find an accurate valuation of your home.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">What's Included in Our Market Appraisal</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Property Inspection:</strong> One of our experienced valuers will visit your property 
                to assess its condition, size, and features</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Market Analysis:</strong> We compare your property with similar properties that have 
                recently sold or are currently on the market in your area</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Valuation Report:</strong> You'll receive a detailed valuation report with our 
                recommended asking price and marketing strategy</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Expert Advice:</strong> Guidance on how to maximize your property's value and 
                appeal to potential buyers</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Marketing Strategy:</strong> Recommendations on how to market your property 
                effectively to achieve the best price</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Why Choose Our Market Appraisals?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Local Expertise</h3>
                <p className="text-gray-700">
                  Our team has extensive knowledge of the local property market, ensuring accurate 
                  valuations based on current market conditions.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">No Obligation</h3>
                <p className="text-gray-700">
                  Our market appraisals are completely free and come with no obligation to use our 
                  services. We're here to help you make informed decisions.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Transparent Process</h3>
                <p className="text-gray-700">
                  We explain our valuation process clearly and provide detailed reasoning for our 
                  recommended asking price.
                </p>
              </div>

              <div className="bg-white border rounded-lg p-6 shadow-sm">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Personalized Service</h3>
                <p className="text-gray-700">
                  We take the time to understand your goals and circumstances, ensuring our advice 
                  is tailored to your specific needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Arrange Your Free Valuation</h2>
          <p className="text-gray-700 mb-6">
            Contact us to arrange a convenient time for one of our property experts to visit your 
            property and provide a comprehensive market appraisal.
          </p>
          <Button asChild>
            <Link href="/contact">Request a Valuation</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

