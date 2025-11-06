import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { ValuationForm } from '@/components/valuation-form'

export const metadata: Metadata = {
  title: 'Get a Free Valuation',
  description: 'Get a free, no-obligation property valuation from our expert team',
}

interface ValuationPageProps {
  searchParams: { postcode?: string }
}

export default async function ValuationPage({ searchParams }: ValuationPageProps) {
  const tenant = await getTenant()
  const postcode = searchParams.postcode || ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get Your Free Property Valuation
            </h1>
            <p className="text-xl text-gray-600 mb-2">
              Discover what your property is worth in today's market
            </p>
            <p className="text-lg text-gray-500">
              No obligation • Expert advice • Quick response
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Benefits */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Why Get a Valuation?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Accurate Market Price</strong>
                      <p className="text-gray-600 text-sm">Know your property's true value based on current market conditions</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Expert Analysis</strong>
                      <p className="text-gray-600 text-sm">Professional assessment from {BRAND_NAME}'s experienced team</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Free & No Obligation</strong>
                      <p className="text-gray-600 text-sm">Completely free with no commitment required</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-white text-sm font-bold">✓</span>
                    </div>
                    <div>
                      <strong className="text-gray-900">Quick Response</strong>
                      <p className="text-gray-600 text-sm">We'll get back to you within 24 hours</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-900">What Happens Next?</h3>
                <ol className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-blue-600">1.</span>
                    <span>Submit your details using the form</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-blue-600">2.</span>
                    <span>Our team will contact you to arrange a convenient time</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-blue-600">3.</span>
                    <span>We'll visit your property and provide a detailed valuation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-bold mr-2 text-blue-600">4.</span>
                    <span>Receive your free valuation report with expert recommendations</span>
                  </li>
                </ol>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <ValuationForm initialPostcode={postcode} />
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">Trusted by Homeowners</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
                <div className="text-gray-600">Free Valuations</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">24hr</div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">Expert</div>
                <div className="text-gray-600">Local Knowledge</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

