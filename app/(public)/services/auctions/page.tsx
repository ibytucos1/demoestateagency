import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Property Auctions',
  description: 'Property auction services',
}

export default async function AuctionsPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Property Auctions</h1>
        <p className="text-lg text-gray-600 mb-8">
          Professional property auction services to help you buy or sell properties through competitive bidding.
        </p>

        <div className="space-y-8 mb-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Buying at Auction</h2>
            <p className="text-gray-700 mb-6">
              Property auctions offer an exciting opportunity to purchase properties at competitive prices. 
              Our team guides you through the entire auction process, from viewing properties to successful bidding.
            </p>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>Expert guidance on auction procedures and legal requirements</li>
              <li>Property viewing arrangements and inspections</li>
              <li>Assistance with legal documentation and searches</li>
              <li>Bidding strategy advice</li>
              <li>Post-auction completion support</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Selling at Auction</h2>
            <p className="text-gray-700 mb-6">
              Selling your property at auction can be an effective way to achieve a quick sale at market value. 
              We handle all aspects of the auction process on your behalf.
            </p>
            <ul className="space-y-3 text-gray-700 list-disc list-inside">
              <li>Property valuation and reserve price setting</li>
              <li>Professional marketing and promotion</li>
              <li>Legal pack preparation</li>
              <li>Viewing arrangements for potential buyers</li>
              <li>Auction day management and support</li>
              <li>Post-sale completion assistance</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Why Choose Auction?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2 text-blue-600">For Buyers</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Competitive pricing opportunities</li>
                  <li>• Transparent bidding process</li>
                  <li>• Quick completion times</li>
                  <li>• Unique property opportunities</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2 text-blue-600">For Sellers</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Fast sale completion</li>
                  <li>• Competitive bidding environment</li>
                  <li>• Transparent process</li>
                  <li>• Guaranteed completion dates</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="text-gray-700 mb-6">
            Whether you're looking to buy or sell at auction, our experienced team is here to help.
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

