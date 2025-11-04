import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Let Your Property',
  description: 'Professional lettings service for landlords',
}

export default async function LetPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Let</h1>
        <p className="text-lg text-gray-600 mb-8">
          Why choose {tenant.name}?
        </p>
        <p className="text-gray-700 mb-8">
          At {tenant.name} we pride ourselves in offering Landlords an exceptional Lettings and Management Service. 
          We will look after your interests and make letting your property as stress-free as possible by taking care 
          of everything – from the initial market appraisal to repairing a faulty boiler or fitting a new kitchen.
        </p>
        <p className="text-gray-700 mb-12">
          We take pride in earning the trust of our clients and having a wealth of experience to provide consistent 
          and reliable service at all times. Our ethical approach to business and genuine customer focus allows us to 
          build a relationship instead of settling for a one-off transaction.
        </p>

        <div className="bg-blue-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Why Choose Us</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Our service is based on extensive experience in letting and managing properties. Local experience 
              and professional expertise ensure you get the service you need.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>We offer flexible and cost-effective payment terms. No upfront fees – we get paid when you do. 
              We do not charge our commission upfront, but on a monthly basis.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Competitive fees with no hidden charges. Please refer to our three lettings plans below.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Exceptional property management service which delivers great service at a low price.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span>Regulated members of professional property associations.</span>
            </li>
          </ul>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Lettings Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-4 text-left">Our Lettings Plans</th>
                  <th className="border border-gray-300 p-4 text-center">Fully Managed</th>
                  <th className="border border-gray-300 p-4 text-center">Let & Rent Collection</th>
                  <th className="border border-gray-300 p-4 text-center">Let Only</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-4">Landlord advice and guidance on all legal obligations and compliance</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Professional market appraisal and comprehensive advertising</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Accompanied viewings six days a week, out of hours and Sundays</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Negotiation of offers and terms</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Comprehensive tenant referencing including credit check, employment references, Right to Rent check</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Bespoke tenancy agreements and service of documents, certificates and checklists</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Registration and management of tenancy deposits under government-approved scheme</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Arrangement of any pre-tenancy work and checks</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Secure key holding service throughout the tenancy</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Arranging independent inventory, check-in and check-out reports</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Collection and remittance of initial month's rent</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Non-resident landlord tax guidance, reporting and compliance</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Negotiating contract renewals and rent increases</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Pay as you go monthly fees</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Monthly rental statements, rent collection and action on late payments</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Annual statement of account</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">24/7 property management team, responding to maintenance requests</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">In-house contractors available at competitive rates</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Arranging repairs, maintenance and refurbishments</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Overseeing maintenance works and regular property inspections</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Arranging Gas safety checks, EPCs, Electrical safety inspections</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Management of your Property through any voids</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">Monthly maintenance reporting</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Notification to utility providers at start and end of tenancy</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr>
                  <td className="border border-gray-300 p-4">End of tenancy dilapidations management and deposit returns</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
                <tr className="bg-gray-50">
                  <td className="border border-gray-300 p-4">Assistance with property licensing regulations</td>
                  <td className="border border-gray-300 p-4 text-center">Yes</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                  <td className="border border-gray-300 p-4 text-center">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Let Your Property?</h2>
          <p className="text-gray-700 mb-6">
            We would appreciate it if you would let us know whether you have any properties currently 
            available for letting. You can send us your details by filling out our registration form 
            or simply contact us.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/landlords">Request a Valuation</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

