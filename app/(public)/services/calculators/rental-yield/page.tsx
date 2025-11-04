'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function RentalYieldCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState('')
  const [monthlyRent, setMonthlyRent] = useState('')
  const [annualYield, setAnnualYield] = useState<number | null>(null)

  const calculateYield = () => {
    const price = parseFloat(propertyPrice) || 0
    const rent = parseFloat(monthlyRent) || 0

    if (price > 0 && rent > 0) {
      const annualRent = rent * 12
      const yieldValue = (annualRent / price) * 100
      setAnnualYield(Number(yieldValue.toFixed(2)))
    } else {
      setAnnualYield(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Rental Yield Calculator</h1>
        <p className="text-lg text-gray-600 mb-8">
          An easy-to-use calculator to work out the return on your investment property.
        </p>

        <div className="bg-white border rounded-lg p-8 shadow-sm mb-8">
          <div className="space-y-6">
            <div>
              <Label htmlFor="propertyPrice">Property Price (£)</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={propertyPrice}
                onChange={(e) => setPropertyPrice(e.target.value)}
                placeholder="Enter property price"
              />
            </div>

            <div>
              <Label htmlFor="monthlyRent">Monthly Rent (£)</Label>
              <Input
                id="monthlyRent"
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(e.target.value)}
                placeholder="Enter monthly rent"
              />
            </div>

            <Button onClick={calculateYield} className="w-full">
              Calculate
            </Button>
          </div>
        </div>

        {annualYield !== null && (
          <div className="bg-blue-50 rounded-lg p-8 mb-8 text-center">
            <h2 className="text-2xl font-semibold mb-4">Rental Yield</h2>
            <div className="text-6xl font-bold text-blue-600 mb-2">
              {annualYield}%
            </div>
            <p className="text-gray-700">
              Annual return on your investment
            </p>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Understanding Rental Yield</h3>
          <p className="text-gray-700 text-sm mb-3">
            Rental yield is a measure of the annual rental income as a percentage of the property's value. 
            It helps investors assess the potential return on their investment property.
          </p>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Good Yield:</strong> Generally considered 5% or higher</p>
            <p><strong>Average Yield:</strong> Typically 3-5%</p>
            <p><strong>Low Yield:</strong> Usually below 3%</p>
          </div>
          <p className="text-gray-700 text-sm mt-4">
            <strong>Note:</strong> This calculator provides a basic yield calculation. Actual returns 
            may vary based on additional costs, void periods, and property appreciation.
          </p>
        </div>
      </div>
    </div>
  )
}

