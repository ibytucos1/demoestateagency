import { getTenant } from '@/lib/tenant'
import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Landlords Fees',
  description: 'Transparent fee structure for landlords',
}

export default async function LandlordsFeesPage() {
  const tenant = await getTenant()

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Landlords Fees</h1>
        <p className="text-lg text-gray-600 mb-12">
          Our standard fees for landlords are as follows:
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Fully Managed</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">12.5% + VAT</p>
            <p className="text-sm text-gray-600 mb-4">(15% inc VAT)</p>
            <p className="text-sm text-gray-700">All-inclusive letting and management plan</p>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Let & Rent Collection</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">10% + VAT</p>
            <p className="text-sm text-gray-600 mb-4">(12% inc VAT)</p>
            <p className="text-sm text-gray-700">Letting service with rent collection</p>
          </div>
          <div className="border rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-xl font-semibold mb-2">Let Only</h3>
            <p className="text-3xl font-bold text-blue-600 mb-2">9% + VAT</p>
            <p className="text-sm text-gray-600 mb-4">(10.8% inc VAT)</p>
            <p className="text-sm text-gray-700">One-time letting service</p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Additional Non-Optional Fees and Charges (inclusive of VAT)</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">1. Pre-Tenancy Fees (All Service Levels)</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Energy Performance Certificate (EPC)</span>
                  <span className="font-semibold">£60</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>EPC with a Floor Plan</span>
                  <span className="font-semibold">£95</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Gas Safety Certificate (GSR)</span>
                  <span className="font-semibold">£68</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Electrical Installation Condition Report (EICR)</span>
                  <span className="font-semibold">£150</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Testing Smoke alarms and Carbon Monoxide detectors</span>
                  <span className="font-semibold">£0</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Visual check in compliance with the Homes Act 2018</span>
                  <span className="font-semibold">£0</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">2. Start of Tenancy Fees</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Set-up Fees</span>
                  <span className="font-semibold">£360</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span className="text-sm text-gray-600">Per tenancy. Includes reference checks, Right to Rent verification, 
                  tenancy agreement preparation, deposit registration, and initial documentation.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">3. During Tenancy Fees</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Tenancy Renewal Fee</span>
                  <span className="font-semibold">£150</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Right-to-Rent Follow-Up Check</span>
                  <span className="font-semibold">£0</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Landlord Withdrawal Fees (during tenancy)</span>
                  <span className="font-semibold">£0</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Arrangement Fees for works over £1,000</span>
                  <span className="font-semibold">12% of net cost</span>
                </li>
                <li className="text-sm text-gray-600 italic">
                  Fully Managed service only. Arranging access, assessing costs with contractors, 
                  ensuring work compliance, and retaining warranties.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">4. End of Tenancy Fees</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Check-out Fees</span>
                  <span className="font-semibold">£70 - £255</span>
                </li>
                <li className="text-sm text-gray-600 italic mb-3">
                  Dependent on the number of bedrooms and/or size of the property. Includes updated 
                  Schedule of Condition and deposit negotiation.
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Tenancy Dispute Fee</span>
                  <span className="font-semibold">£120</span>
                </li>
                <li className="text-sm text-gray-600 italic mb-3">
                  Preparation of evidence and submission to tenancy deposit scheme. Only applies 
                  where the agent has protected the deposit.
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Fees for service of Legal Notices (Section 8 or Section 21)</span>
                  <span className="font-semibold">£0</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Other Fees and Charges</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex justify-between border-b pb-2">
                  <span>Arrangement Fees for refurbishments over £1000</span>
                  <span className="font-semibold">14% of net cost</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Obtaining more than three contractor quotes</span>
                  <span className="font-semibold">£0</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Vacant Property Management Fees</span>
                  <span className="font-semibold">£0 per visit</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Management Take-over Fees</span>
                  <span className="font-semibold">£150</span>
                </li>
                <li className="flex justify-between border-b pb-2">
                  <span>Deposit Transfer Fees</span>
                  <span className="font-semibold">£96</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-8 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Please ask a member of staff if you have any questions about our fees.</strong>
          </p>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

