import { getTenant } from '@/lib/tenant'
import { BRAND_NAME } from '@/lib/constants'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  Shield, 
  Users, 
  FileCheck, 
  Home,
  Phone,
  Calculator,
  ArrowRight,
  TrendingUp,
  Clock,
  Award
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Let Your Property',
  description: 'Professional lettings service for landlords',
}

export default async function LetPage() {
  const tenant = await getTenant()

  const benefits = [
    {
      icon: Award,
      title: 'Expert Local Knowledge',
      description: 'Extensive experience in letting and managing properties with professional expertise tailored to your needs.',
    },
    {
      icon: TrendingUp,
      title: 'No Upfront Fees',
      description: 'Flexible payment terms - we get paid when you do. Monthly commission, no upfront charges.',
    },
    {
      icon: Shield,
      title: 'Transparent Pricing',
      description: 'Competitive fees with no hidden charges. Choose from three clear lettings plans.',
    },
    {
      icon: Clock,
      title: 'Exceptional Service',
      description: 'Great property management at low prices with 24/7 support for maintenance requests.',
    },
    {
      icon: FileCheck,
      title: 'Fully Regulated',
      description: 'Members of professional property associations, ensuring compliance and peace of mind.',
    },
    {
      icon: Users,
      title: 'Relationship Focus',
      description: 'Ethical approach to business with genuine customer focus, building lasting relationships.',
    },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Let Your Property with Confidence
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Professional lettings service tailored for landlords
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/valuation" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Get Free Valuation
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="bg-white text-blue-700 hover:bg-blue-50">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose {BRAND_NAME}?</h2>
            <p className="text-lg text-gray-700 mb-6 leading-relaxed">
              At {BRAND_NAME} we pride ourselves in offering Landlords an exceptional Lettings and Management Service. 
              We will look after your interests and make letting your property as stress-free as possible by taking care 
              of everything – from the initial market appraisal to repairing a faulty boiler or fitting a new kitchen.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              We take pride in earning the trust of our clients and having a wealth of experience to provide consistent 
              and reliable service at all times. Our ethical approach to business and genuine customer focus allows us to 
              build a relationship instead of settling for a one-off transaction.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Choose Us</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, idx) => {
                const Icon = benefit.icon
                return (
                  <Card key={idx} className="border-2 hover:border-blue-500 hover:shadow-lg transition-all duration-300">
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

      {/* Lettings Plans */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Lettings Plans</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include comprehensive tenant vetting and legal compliance.
            </p>
            <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
              <table className="w-full border-collapse bg-white">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600">
                  <th className="border-r border-blue-400 p-4 text-left text-white font-bold">Our Lettings Plans</th>
                  <th className="border-r border-blue-400 p-4 text-center text-white font-bold">Fully Managed</th>
                  <th className="border-r border-blue-400 p-4 text-center text-white font-bold">Let & Rent Collection</th>
                  <th className="p-4 text-center text-white font-bold">Let Only</th>
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Landlord advice and guidance on all legal obligations and compliance</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Professional market appraisal and comprehensive advertising</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Accompanied viewings six days a week, out of hours and Sundays</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Negotiation of offers and terms</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Comprehensive tenant referencing including credit check, employment references, Right to Rent check</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Bespoke tenancy agreements and service of documents, certificates and checklists</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Registration and management of tenancy deposits under government-approved scheme</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Arrangement of any pre-tenancy work and checks</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Secure key holding service throughout the tenancy</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Arranging independent inventory, check-in and check-out reports</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Collection and remittance of initial month's rent</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Non-resident landlord tax guidance, reporting and compliance</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Negotiating contract renewals and rent increases</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Pay as you go monthly fees</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Monthly rental statements, rent collection and action on late payments</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Annual statement of account</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">24/7 property management team, responding to maintenance requests</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">In-house contractors available at competitive rates</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Arranging repairs, maintenance and refurbishments</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Overseeing maintenance works and regular property inspections</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Arranging Gas safety checks, EPCs, Electrical safety inspections</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Management of your Property through any voids</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Monthly maintenance reporting</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Notification to utility providers at start and end of tenancy</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">End of tenancy dilapidations management and deposit returns</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
                <tr className="bg-gray-50 hover:bg-blue-50 transition-colors">
                  <td className="border-r border-gray-200 p-4 text-gray-700">Assistance with property licensing regulations</td>
                  <td className="border-r border-gray-200 p-4 text-center"><CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" /></td>
                  <td className="border-r border-gray-200 p-4 text-center text-gray-400">—</td>
                  <td className="p-4 text-center text-gray-400">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Let Your Property?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              We would appreciate it if you would let us know whether you have any properties currently 
              available for letting. You can send us your details by filling out our registration form 
              or simply contact us.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700">
                <Link href="/contact" className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Us
                </Link>
              </Button>
              <Button size="lg" asChild variant="outline" className="border-blue-600 text-blue-700 hover:bg-blue-50">
                <Link href="/valuation" className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Request a Valuation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

