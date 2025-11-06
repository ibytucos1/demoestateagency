import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  Gavel, 
  ShoppingCart, 
  TrendingUp,
  FileCheck,
  Eye,
  HandCoins,
  Clock,
  Shield,
  Phone
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Property Auctions',
  description: 'Property auction services',
}

export default async function AuctionsPage() {
  const tenant = await getTenant()

  const buyingServices = [
    'Expert guidance on auction procedures and legal requirements',
    'Property viewing arrangements and inspections',
    'Assistance with legal documentation and searches',
    'Bidding strategy advice',
    'Post-auction completion support',
  ]

  const sellingServices = [
    'Property valuation and reserve price setting',
    'Professional marketing and promotion',
    'Legal pack preparation',
    'Viewing arrangements for potential buyers',
    'Auction day management and support',
    'Post-sale completion assistance',
  ]

  const buyerBenefits = [
    { icon: TrendingUp, title: 'Competitive Pricing', description: 'Access to properties at competitive prices' },
    { icon: Eye, title: 'Transparent Process', description: 'Clear, open bidding with no hidden surprises' },
    { icon: Clock, title: 'Quick Completion', description: 'Fast completion times, typically 28 days' },
    { icon: HandCoins, title: 'Unique Opportunities', description: 'Access to properties not on the open market' },
  ]

  const sellerBenefits = [
    { icon: Clock, title: 'Fast Sale', description: 'Achieve a sale in as little as 28 days' },
    { icon: Gavel, title: 'Competitive Bidding', description: 'Create competitive environment for best price' },
    { icon: Shield, title: 'Guaranteed Sale', description: 'Legal commitment from winning bidder' },
    { icon: FileCheck, title: 'Transparent Process', description: 'Clear, structured sales process' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Gavel className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Property Auctions
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional auction services to help you buy or sell properties through competitive bidding
            </p>
          </div>
        </div>
      </section>

      {/* Buying at Auction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Buying at Auction</h2>
                <p className="text-gray-600">Your guide to purchasing at property auctions</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Property auctions offer an exciting opportunity to purchase properties at competitive prices. 
              Our team guides you through the entire auction process, from viewing properties to successful bidding.
            </p>
            <div className="grid gap-4">
              {buyingServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Buying Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12">Benefits for Buyers</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {buyerBenefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="border-2 hover:border-emerald-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Selling at Auction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <HandCoins className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Selling at Auction</h2>
                <p className="text-gray-600">Achieve a quick sale at market value</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Selling your property at auction can be an effective way to achieve a quick sale at market value. 
              We handle all aspects of the auction process on your behalf.
            </p>
            <div className="grid gap-4">
              {sellingServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selling Benefits */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-12">Benefits for Sellers</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {sellerBenefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h4 className="text-lg font-bold mb-2 text-gray-900">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Whether you're looking to buy or sell at auction, our experienced team is here to help
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

