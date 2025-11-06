import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  Building2, 
  Clock, 
  Shield,
  FileCheck,
  TrendingDown,
  Calculator,
  Phone,
  ArrowRight
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Mortgages',
  description: 'Mortgage broker services to help you find the right deal',
}

export default async function MortgagesPage() {
  const tenant = await getTenant()

  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'No need to search through hundreds of mortgage deals yourself',
    },
    {
      icon: Shield,
      title: 'Expert Advice',
      description: 'Professional guidance on the best mortgage products for your situation',
    },
    {
      icon: Building2,
      title: 'Access to Whole Market',
      description: 'Independent brokers have access to deals from multiple lenders',
    },
    {
      icon: FileCheck,
      title: 'Application Support',
      description: 'Help with paperwork and application process',
    },
    {
      icon: TrendingDown,
      title: 'Best Rates',
      description: 'Brokers can often secure better rates than going directly to lenders',
    },
  ]

  const mortgageTypes = [
    'First-time buyer mortgages',
    'Buy-to-let mortgages',
    'Remortgages',
    'Commercial mortgages',
    'Help-to-buy schemes',
    'Shared ownership mortgages',
    'Self-employed mortgages',
    'Interest-only mortgages',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Mortgages
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Helping you find the mortgage deal that's just right for you
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Take the Hassle Out of Finding a Mortgage</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              If you are looking for a mortgage, it can feel quite daunting and searching for the best 
              deal can be time-consuming. Why not let a broker do it for you?
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              {BRAND_NAME} can refer you to an excellent independent mortgage broker who will get to know 
              you, understand how much you're looking to borrow and your personal requirements before 
              searching the markets to find you that perfect deal to help you make your move.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Use a Mortgage Broker?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
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

      {/* Calculator CTA */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-500 overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-8 flex items-center justify-center">
                    <Calculator className="h-24 w-24 text-white" strokeWidth={1.5} />
                  </div>
                  <div className="p-8 flex flex-col justify-center">
                    <h3 className="text-2xl font-bold mb-4">Mortgage Calculator</h3>
                    <p className="text-gray-700 mb-6">
                      If you're not sure how much you could borrow, our handy mortgage calculator is a great place to start. 
                      Get an estimate of your borrowing capacity and monthly repayments.
                    </p>
                    <Button asChild className="w-fit">
                      <Link href="/services/calculators/mortgage" className="flex items-center gap-2">
                        Try Calculator
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Mortgage Types */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Types of Mortgages We Can Help With</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {mortgageTypes.map((type, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-xl border-2 border-gray-200 bg-white hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                  <CheckCircle className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <span className="text-lg text-gray-700">{type}</span>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-gray-700 mb-8">
              Contact us to be referred to our trusted independent mortgage broker and take the first 
              step towards finding your perfect mortgage deal
            </p>
            <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/contact" className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Get in Touch
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  )
}

