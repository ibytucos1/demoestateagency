import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  DollarSign, 
  Wrench, 
  Shield,
  FileText,
  MessageCircle,
  Trees,
  ClipboardList,
  Building2,
  AlertCircle,
  Phone,
  Home
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Block Management',
  description: 'Professional block management services for residential and commercial properties',
}

export default async function BlockManagementPage() {
  const tenant = await getTenant()

  const services = [
    {
      icon: DollarSign,
      title: 'Financial Management',
      description: 'Complete financial management including service charge collection, budgeting, annual accounts, and financial reporting. Transparent and accurate financial records.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Wrench,
      title: 'Maintenance & Repairs',
      description: 'Coordinating maintenance and repairs for common areas, building fabric, and shared facilities. Regular inspections and proactive maintenance planning.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: ClipboardList,
      title: 'Contractor Management',
      description: 'Managing relationships with contractors, obtaining quotes, and overseeing works. We ensure quality workmanship and value for money.',
      gradient: 'from-orange-500 to-amber-600',
    },
    {
      icon: Shield,
      title: 'Health & Safety Compliance',
      description: 'Ensuring full compliance with health and safety regulations, fire safety, risk assessments, and building regulations. Regular safety audits and documentation.',
      gradient: 'from-red-500 to-rose-600',
    },
    {
      icon: Shield,
      title: 'Insurance Management',
      description: 'Arranging and managing block insurance, ensuring adequate cover and competitive premiums. Handling claims and liaising with insurers.',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: MessageCircle,
      title: 'Resident Communication',
      description: 'Regular communication with residents, handling enquiries, complaints, and maintenance requests. Professional and responsive service.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: Trees,
      title: 'Grounds & Common Areas',
      description: 'Management of gardens, car parks, corridors, lifts, and all common areas. Ensuring clean, safe, and well-maintained shared spaces.',
      gradient: 'from-teal-500 to-emerald-600',
    },
    {
      icon: FileText,
      title: 'Lease Administration',
      description: 'Managing lease compliance, leaseholder consultations, and enforcement of lease terms. Supporting leaseholders and freeholders.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Building2,
      title: 'Major Works Projects',
      description: 'Planning and managing major works projects including roof replacements, external decorations, and structural repairs. Section 20 consultations and contractor management.',
      gradient: 'from-yellow-500 to-orange-600',
    },
    {
      icon: AlertCircle,
      title: 'Emergency Response',
      description: '24/7 emergency response for urgent issues. We ensure rapid response to emergencies to minimize disruption and damage.',
      gradient: 'from-pink-500 to-rose-600',
    },
  ]

  const benefits = [
    'Experienced team with extensive knowledge of block management',
    'Transparent financial management and reporting',
    'Proactive maintenance planning to prevent costly repairs',
    'Full compliance with all legal and regulatory requirements',
    '24/7 emergency support for peace of mind',
    'Competitive fees with no hidden charges',
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
              Block Management
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Comprehensive services for residential and commercial multi-unit developments
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Block Management Services</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you manage a residential block, commercial building, or mixed-use development, 
              our experienced team provides comprehensive management services tailored to your needs.
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
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Block Management Service?</h2>
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
              Let us handle your block management needs with professional care
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Get Started
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                <Link href="/landlords" className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  View All Services
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

