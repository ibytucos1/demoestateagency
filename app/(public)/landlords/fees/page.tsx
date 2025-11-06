import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { 
  CheckCircle, 
  DollarSign, 
  FileText, 
  Home,
  Phone,
  Calculator,
  Shield,
  Clock,
  Key
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Landlords Fees',
  description: 'Transparent fee structure for landlords',
}

export default async function LandlordsFeesPage() {
  const tenant = await getTenant()

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <DollarSign className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Transparent Landlord Fees
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Clear, competitive pricing with no hidden charges
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Our Service Plans</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the plan that best suits your property management needs
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <Card className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <Shield className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Fully Managed</h3>
                  <div className="mb-4">
                    <p className="text-5xl font-bold text-blue-600 mb-2">12.5%</p>
                    <p className="text-sm text-gray-600 mb-1">+ VAT</p>
                    <p className="text-lg text-gray-500">(15% inc VAT)</p>
                  </div>
                  <p className="text-gray-700">All-inclusive letting and management plan</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <Clock className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Let & Rent Collection</h3>
                  <div className="mb-4">
                    <p className="text-5xl font-bold text-blue-600 mb-2">10%</p>
                    <p className="text-sm text-gray-600 mb-1">+ VAT</p>
                    <p className="text-lg text-gray-500">(12% inc VAT)</p>
                  </div>
                  <p className="text-gray-700">Letting service with rent collection</p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-blue-500 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
                <CardContent className="p-8 text-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
                    <Key className="h-7 w-7 text-white" strokeWidth={2} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Let Only</h3>
                  <div className="mb-4">
                    <p className="text-5xl font-bold text-blue-600 mb-2">9%</p>
                    <p className="text-sm text-gray-600 mb-1">+ VAT</p>
                    <p className="text-lg text-gray-500">(10.8% inc VAT)</p>
                  </div>
                  <p className="text-gray-700">One-time letting service</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Fees */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Additional Fees & Charges</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              All fees are inclusive of VAT
            </p>
            
            <div className="grid gap-8">
              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/30">
                      <FileText className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">1. Pre-Tenancy Fees</h3>
                      <p className="text-gray-600">All Service Levels</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Energy Performance Certificate (EPC)</span>
                      <span className="font-bold text-blue-600 text-lg">£60</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">EPC with a Floor Plan</span>
                      <span className="font-bold text-blue-600 text-lg">£95</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Gas Safety Certificate (GSR)</span>
                      <span className="font-bold text-blue-600 text-lg">£68</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Electrical Installation Condition Report (EICR)</span>
                      <span className="font-bold text-blue-600 text-lg">£150</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Testing Smoke alarms and Carbon Monoxide detectors</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Visual check in compliance with the Homes Act 2018</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/30">
                      <Key className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">2. Start of Tenancy Fees</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Set-up Fees</span>
                      <span className="font-bold text-blue-600 text-lg">£360</span>
                    </div>
                    <p className="text-sm text-gray-600 italic px-3">
                      Per tenancy. Includes reference checks, Right to Rent verification, 
                      tenancy agreement preparation, deposit registration, and initial documentation.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                      <Clock className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">3. During Tenancy Fees</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Tenancy Renewal Fee</span>
                      <span className="font-bold text-blue-600 text-lg">£150</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Right-to-Rent Follow-Up Check</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Landlord Withdrawal Fees (during tenancy)</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Arrangement Fees for works over £1,000</span>
                      <span className="font-bold text-blue-600 text-lg">12% of net cost</span>
                    </div>
                    <p className="text-sm text-gray-600 italic px-3 pt-2">
                      Fully Managed service only. Arranging access, assessing costs with contractors, 
                      ensuring work compliance, and retaining warranties.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
                      <Home className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">4. End of Tenancy Fees</h3>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                        <span className="text-gray-700">Check-out Fees</span>
                        <span className="font-bold text-blue-600 text-lg">£70 - £255</span>
                      </div>
                      <p className="text-sm text-gray-600 italic px-3 pt-2 pb-3">
                        Dependent on the number of bedrooms and/or size of the property. Includes updated 
                        Schedule of Condition and deposit negotiation.
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                        <span className="text-gray-700">Tenancy Dispute Fee</span>
                        <span className="font-bold text-blue-600 text-lg">£120</span>
                      </div>
                      <p className="text-sm text-gray-600 italic px-3 pt-2 pb-3">
                        Preparation of evidence and submission to tenancy deposit scheme. Only applies 
                        where the agent has protected the deposit.
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-3 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Fees for service of Legal Notices (Section 8 or Section 21)</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2">
                <CardContent className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30">
                      <DollarSign className="h-6 w-6 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Other Fees and Charges</h3>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Arrangement Fees for refurbishments over £1000</span>
                      <span className="font-bold text-blue-600 text-lg">14% of net cost</span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Obtaining more than three contractor quotes</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Vacant Property Management Fees</span>
                      <span className="font-bold text-emerald-600 text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        FREE per visit
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-3 border-b border-gray-200 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Management Take-over Fees</span>
                      <span className="font-bold text-blue-600 text-lg">£150</span>
                    </div>
                    <div className="flex justify-between items-center py-3 hover:bg-gray-50 px-3 rounded transition-colors">
                      <span className="text-gray-700">Deposit Transfer Fees</span>
                      <span className="font-bold text-blue-600 text-lg">£96</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Questions About Our Fees?</h2>
            <p className="text-lg text-gray-700 mb-8">
              Please ask a member of staff if you have any questions about our fees. We're here to help!
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

