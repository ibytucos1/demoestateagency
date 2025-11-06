import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  TrendingUp, 
  Building2, 
  BarChart3,
  Landmark,
  Search,
  FileText,
  Phone,
  Home
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Investing & Land',
  description: 'Property investment and land development services',
}

export default async function InvestingLandPage() {
  const tenant = await getTenant()

  const investmentServices = [
    {
      icon: Search,
      title: 'Investment Opportunities',
      description: 'Access to exclusive investment properties with strong rental yields and capital growth potential. We identify properties that match your investment criteria.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Building2,
      title: 'Portfolio Management',
      description: 'Comprehensive portfolio management services including property acquisition, tenant management, and strategic planning for growth.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: BarChart3,
      title: 'Yield Analysis',
      description: 'Detailed rental yield calculations and investment return analysis to help you make informed decisions about your property investments.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Expert market analysis and insights into emerging investment areas, rental trends, and capital growth opportunities.',
      gradient: 'from-orange-500 to-amber-600',
    },
  ]

  const landServices = [
    'Land identification and site assessment',
    'Planning permission guidance and applications',
    'Development feasibility studies',
    'Land acquisition and negotiation',
    'Project management and coordination',
    'Sales and marketing of completed developments',
  ]

  const benefits = [
    'Extensive local market knowledge and experience',
    'Strong network of developers, contractors, and investors',
    'Proven track record in successful property investments',
    'Comprehensive support from acquisition to completion',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Investing & Land
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Expert guidance for property investors and land developers to maximize your returns
            </p>
          </div>
        </div>
      </section>

      {/* Investment Services Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Property Investment Services</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Whether you're a seasoned investor or new to property investment, our team provides 
              comprehensive support to help you build and manage a successful portfolio
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {investmentServices.map((service, idx) => {
                const Icon = service.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="h-7 w-7 text-white" strokeWidth={2} />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-gray-900">{service.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{service.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Land Development Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Building2 className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold">Land Development Services</h2>
                <p className="text-gray-600">From identification to completion</p>
              </div>
            </div>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Our land development services help you identify, acquire, and develop land for residential 
              or commercial purposes. We guide you through the entire development process.
            </p>
            <div className="grid gap-4">
              {landServices.map((service, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="h-6 w-6 text-indigo-500 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Work With Us?</h2>
            <div className="grid gap-4">
              {benefits.map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="h-6 w-6 text-emerald-500 flex-shrink-0 mt-1" />
                  <span className="text-lg text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Explore Investment Opportunities</h2>
            <p className="text-lg text-gray-700 mb-8">
              Contact us to discuss your investment goals and discover how we can help you achieve them
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                <Link href="/search" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  View Properties
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

