import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mortgages',
  description: 'Mortgage broker services to help you find the right deal',
}

export default async function MortgagesPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Mortgages</h1>
        <p className="text-lg text-gray-600 mb-8">
          Helping you find the mortgage deal that's just right for you
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Take the Hassle Out of Finding a Mortgage</h2>
            <p className="text-gray-700 mb-6">
              If you are looking for a mortgage, it can feel quite daunting and searching for the best 
              deal can be time-consuming. Why not let a broker do it for you?
            </p>
            <p className="text-gray-700 mb-6">
              {tenant.name} can refer you to an excellent independent mortgage broker who will get to know 
              you, understand how much you're looking to borrow and your personal requirements before 
              searching the markets to find you that perfect deal to help you make your move.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Why Use a Mortgage Broker?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Save Time:</strong> No need to search through hundreds of mortgage deals yourself</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Expert Advice:</strong> Professional guidance on the best mortgage products for your situation</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Access to Whole Market:</strong> Independent brokers have access to deals from multiple lenders</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Application Support:</strong> Help with paperwork and application process</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span><strong>Best Rates:</strong> Brokers can often secure better rates than going directly to lenders</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Mortgage Calculator</h2>
            <p className="text-gray-700 mb-6">
              If you're not sure how much you could borrow, our handy mortgage calculator is a great place to start. 
              Use it to get an estimate of your borrowing capacity and monthly repayments.
            </p>
            <Button asChild>
              <Link href="/services/calculators/mortgage">Try Our Mortgage Calculator</Link>
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Types of Mortgages We Can Help With</h3>
            <div className="grid md:grid-cols-2 gap-4 text-gray-700">
              <ul className="space-y-2 list-disc list-inside">
                <li>First-time buyer mortgages</li>
                <li>Buy-to-let mortgages</li>
                <li>Remortgages</li>
                <li>Commercial mortgages</li>
              </ul>
              <ul className="space-y-2 list-disc list-inside">
                <li>Help-to-buy schemes</li>
                <li>Shared ownership mortgages</li>
                <li>Self-employed mortgages</li>
                <li>Interest-only mortgages</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Get Started Today</h2>
          <p className="text-gray-700 mb-6">
            Contact us to be referred to our trusted independent mortgage broker and take the first 
            step towards finding your perfect mortgage deal.
          </p>
          <Button asChild>
            <Link href="/contact">Get in Touch</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

