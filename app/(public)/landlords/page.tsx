import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  Home, 
  DollarSign, 
  Shield, 
  Wrench, 
  Building2,
  ArrowRight,
  CheckCircle2,
  Phone,
  Calculator
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Landlords',
  description: 'Comprehensive landlord services',
}

export default async function LandlordsPage() {
  const tenant = await getTenant()

  const services = [
    {
      title: 'Let Your Property',
      description: 'Professional lettings service with three flexible plans to suit your needs. From let-only to fully managed services.',
      icon: Home,
      href: '/landlords/let',
      gradient: 'from-blue-500 to-blue-600',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      shadowColor: 'shadow-blue-500/20',
    },
    {
      title: 'Landlord Fees',
      description: 'Transparent fee structure with no hidden charges. Competitive rates for all service levels.',
      icon: DollarSign,
      href: '/landlords/fees',
      gradient: 'from-emerald-500 to-emerald-600',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      shadowColor: 'shadow-emerald-500/20',
    },
    {
      title: 'Property Management',
      description: 'Comprehensive property management services including 24/7 maintenance support and regular inspections.',
      icon: Shield,
      href: '/landlords/property-management',
      gradient: 'from-purple-500 to-purple-600',
      lightColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      shadowColor: 'shadow-purple-500/20',
    },
    {
      title: 'Refurbishment Projects',
      description: 'Professional refurbishment services from minor updates to complete renovations. Project management included.',
      icon: Wrench,
      href: '/landlords/refurbishment-projects',
      gradient: 'from-amber-500 to-amber-600',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      shadowColor: 'shadow-amber-500/20',
    },
    {
      title: 'Block Management',
      description: 'Comprehensive block management for residential and commercial properties. Financial management and compliance included.',
      icon: Building2,
      href: '/landlords/block-management',
      gradient: 'from-indigo-500 to-indigo-600',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      shadowColor: 'shadow-indigo-500/20',
    },
  ]

  const benefits = [
    'Expert local market knowledge',
    'Comprehensive tenant screening',
    '24/7 maintenance support',
    'Regular property inspections',
    'Rent collection & accounting',
    'Legal compliance assured',
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Landlord Services
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Comprehensive property management solutions tailored to your needs. 
              Let us handle the hassle while you enjoy the returns.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/valuation" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Get Free Valuation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Landlord Services
              </h2>
              <p className="text-lg text-gray-600">
                Choose from our range of professional services designed to make property ownership stress-free
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <Link key={service.href} href={service.href}>
                    <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary group">
                      <CardContent className="p-6">
                        <div className="relative mb-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center shadow-lg ${service.shadowColor} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                            <Icon className="h-8 w-8 text-white" strokeWidth={2} />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                          Learn more
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose {BRAND_NAME}?
              </h2>
              <p className="text-lg text-gray-600">
                We're committed to delivering exceptional service and maximizing your rental returns
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  </div>
                  <p className="text-gray-700 font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-100 shadow-xl">
              <CardContent className="p-8 md:p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Ready to Get Started?
                </h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Contact us today to learn more about our landlord services and request a free property valuation. 
                  Our expert team is here to help you maximize your investment.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link href="/contact" className="gap-2">
                      <Phone className="h-5 w-5" />
                      Contact Us Today
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/valuation" className="gap-2">
                      <Calculator className="h-5 w-5" />
                      Request Valuation
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
