import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  Search, 
  BarChart3, 
  FileText,
  Users,
  TrendingUp,
  Award,
  Phone
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Market Appraisals',
  description: 'Free property valuations and market appraisals',
}

export default async function MarketAppraisalsPage() {
  const tenant = await getTenant()

  const included = [
    {
      icon: Search,
      title: 'Property Inspection',
      description: 'One of our experienced valuers will visit your property to assess its condition, size, and features',
    },
    {
      icon: BarChart3,
      title: 'Market Analysis',
      description: 'We compare your property with similar properties that have recently sold or are currently on the market in your area',
    },
    {
      icon: FileText,
      title: 'Valuation Report',
      description: 'You\'ll receive a detailed valuation report with our recommended asking price and marketing strategy',
    },
    {
      icon: Award,
      title: 'Expert Advice',
      description: 'Guidance on how to maximize your property\'s value and appeal to potential buyers',
    },
    {
      icon: TrendingUp,
      title: 'Marketing Strategy',
      description: 'Recommendations on how to market your property effectively to achieve the best price',
    },
  ]

  const benefits = [
    {
      icon: Users,
      title: 'Local Expertise',
      description: 'Our team has extensive knowledge of the local property market, ensuring accurate valuations based on current market conditions.',
    },
    {
      icon: CheckCircle,
      title: 'No Obligation',
      description: 'Our market appraisals are completely free and come with no obligation to use our services. We\'re here to help you make informed decisions.',
    },
    {
      icon: FileText,
      title: 'Transparent Process',
      description: 'We explain our valuation process clearly and provide detailed reasoning for our recommended asking price.',
    },
    {
      icon: Award,
      title: 'Personalized Service',
      description: 'We take the time to understand your goals and circumstances, ensuring our advice is tailored to your specific needs.',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Market Appraisals
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Tap into decades of experience in the property market with a free, no-obligation valuation
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Much Is Your Property Worth?</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              The first step in making that property move is to find out what your current property 
              is worth. Our friendly team is ready and waiting to provide you with a free, 
              no-obligation market valuation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {BRAND_NAME} has a team of extremely experienced property experts with detailed knowledge 
              of the local property market. We'll take time to listen to what you want or need to achieve 
              from your property sale and then compare your property with similar properties in the area 
              to find an accurate valuation of your home.
            </p>
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What's Included in Our Market Appraisal</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {included.slice(0, 3).map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              {included.slice(3).map((item, idx) => {
                const Icon = item.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Market Appraisals?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Arrange Your Free Valuation</h2>
            <p className="text-lg text-gray-700 mb-8">
              Contact us to arrange a convenient time for one of our property experts to visit your 
              property and provide a comprehensive market appraisal
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Request a Valuation
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}
