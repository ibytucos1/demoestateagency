import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  Clock, 
  Wrench, 
  Shield,
  FileCheck,
  ClipboardList,
  Key,
  Home,
  AlertCircle,
  Zap,
  Phone,
  Calculator
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Property Management',
  description: 'Comprehensive property management services for landlords',
}

export default async function PropertyManagementPage() {
  const tenant = await getTenant()

  const services = [
    {
      icon: Clock,
      title: '24/7 Maintenance Support',
      description: 'Direct access to our property management team, responding to and handling tenants\' maintenance requests 24 hours a day. We ensure issues are resolved quickly and efficiently.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Wrench,
      title: 'In-House Contractors',
      description: 'Provision of our in-house contractors available at short notice and very competitive rates. Quality workmanship guaranteed.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Wrench,
      title: 'Repairs & Maintenance',
      description: 'Arranging repairs, maintenance and refurbishments as required. We work with trusted third-party contractors based on best value prices, giving access and settling invoices.',
      gradient: 'from-orange-500 to-amber-600',
    },
    {
      icon: ClipboardList,
      title: 'Property Inspections',
      description: 'Overseeing maintenance works and regular property inspections to ensure your property is well-maintained and tenants are complying with their obligations.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Shield,
      title: 'Safety Certificates',
      description: 'Arranging Gas safety checks, EPCs, Electrical safety inspections, Floor plans, etc. as and when required to ensure full compliance.',
      gradient: 'from-red-500 to-rose-600',
    },
    {
      icon: Key,
      title: 'Void Management',
      description: 'Management of your Property through any voids. We minimize void periods and ensure quick turnaround between tenancies.',
      gradient: 'from-indigo-500 to-blue-600',
    },
    {
      icon: FileCheck,
      title: 'Monthly Reporting',
      description: 'Monthly maintenance reporting so you\'re always informed about the condition and any issues with your property.',
      gradient: 'from-teal-500 to-cyan-600',
    },
    {
      icon: Zap,
      title: 'Utility Management',
      description: 'Notification to utility providers at the start and end of tenancy, ensuring smooth transitions and proper billing.',
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      icon: AlertCircle,
      title: 'Deposit Management',
      description: 'End of tenancy dilapidations management and deposit returns. We handle negotiations and ensure fair resolution of any disputes.',
      gradient: 'from-pink-500 to-purple-600',
    },
    {
      icon: FileCheck,
      title: 'Licensing Compliance',
      description: 'Assistance with property licensing regulations. We keep you compliant with all local authority requirements.',
      gradient: 'from-violet-500 to-indigo-600',
    },
  ]

  const benefits = [
    'Experienced team with extensive knowledge of property management',
    'Competitive fees with transparent pricing',
    '24/7 support for urgent maintenance issues',
    'Regular property inspections to protect your investment',
    'Full compliance with all legal and safety requirements',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Home className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Property Management
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Comprehensive services designed to give you peace of mind while maximizing your rental income
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">What We Offer</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Our property management service is designed to handle all aspects of your rental 
              property, allowing you to enjoy passive income without the day-to-day hassles. 
              <span className="font-bold text-blue-600"> Over 95%</span> of our landlords employ our full management service.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => {
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

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Property Management Service?</h2>
            <div className="grid gap-4 mb-12">
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Let us handle your property management needs while you enjoy passive income
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                <Link href="/landlords/fees" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  View Fees
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

