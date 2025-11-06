import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  ClipboardList, 
  Users, 
  Shield,
  Wrench,
  ChefHat,
  Bath,
  Paintbrush,
  Zap,
  Phone,
  Home
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Refurbishment Projects',
  description: 'Professional property refurbishment services',
}

export default async function RefurbishmentProjectsPage() {
  const tenant = await getTenant()

  const services = [
    {
      icon: ClipboardList,
      title: 'Project Planning',
      description: 'Comprehensive project planning including cost assessments, timelines, and specification of works. We ensure your project stays on budget and on schedule.',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: Users,
      title: 'Contractor Management',
      description: 'Arranging access and assessing costs with contractors. We work with trusted professionals to ensure quality workmanship at competitive rates.',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Shield,
      title: 'Quality Assurance',
      description: 'Ensuring work has been carried out in accordance with the Specification of Works. We conduct regular inspections throughout the project.',
      gradient: 'from-purple-500 to-pink-600',
    },
    {
      icon: CheckCircle,
      title: 'Warranty Management',
      description: 'Retaining any resulting warranty or guarantee documentation. We ensure you\'re protected long after the project is complete.',
      gradient: 'from-indigo-500 to-purple-600',
    },
    {
      icon: ChefHat,
      title: 'Kitchen Refurbishments',
      description: 'Complete kitchen renovations including design, fitting, and installation. Modern, functional kitchens that add value to your property.',
      gradient: 'from-orange-500 to-red-600',
    },
    {
      icon: Bath,
      title: 'Bathroom Refurbishments',
      description: 'Full bathroom renovations from tiling to plumbing. We create modern, water-efficient bathrooms that tenants love.',
      gradient: 'from-cyan-500 to-blue-600',
    },
    {
      icon: Paintbrush,
      title: 'Decoration & Finishing',
      description: 'Professional painting, decorating, and finishing touches. We ensure a high-quality finish throughout your property.',
      gradient: 'from-pink-500 to-rose-600',
    },
    {
      icon: Zap,
      title: 'Electrical & Plumbing',
      description: 'Electrical rewires, plumbing upgrades, and heating installations. All work carried out by qualified, certified professionals.',
      gradient: 'from-yellow-500 to-amber-600',
    },
  ]

  const benefits = [
    'Experienced project managers overseeing every aspect',
    'Access to trusted contractors at competitive rates',
    'Quality assurance and regular inspections',
    'Warranty and guarantee management',
    'Projects completed on time and on budget',
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Wrench className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Refurbishment Projects
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Transform your property with professional refurbishment services
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Refurbishment Services</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Whether you're preparing a property for let, increasing rental value, or updating 
              an existing property, our refurbishment team can help. We handle projects of all 
              sizes with the same attention to detail and professional standards.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2 border-blue-500">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Arrangement Fees</h3>
                  <p className="text-5xl font-bold text-blue-600">14%</p>
                  <p className="text-gray-600 mt-2">of net cost for projects over £1,000</p>
                </div>
                <p className="text-gray-700 text-center">
                  This covers arranging access, assessing costs with contractors, ensuring work 
                  compliance, and retaining warranties. We work with multiple contractors to ensure 
                  you get the best value.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Our Refurbishment Service?</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Property?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Get a quote for your refurbishment project today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Get a Quote
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

