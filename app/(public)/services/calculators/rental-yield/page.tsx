'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, Info, Calculator } from 'lucide-react'

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

  const getYieldCategory = (yield_val: number) => {
    if (yield_val >= 5) return { label: 'Good Yield', color: 'text-emerald-600', bg: 'bg-emerald-50' }
    if (yield_val >= 3) return { label: 'Average Yield', color: 'text-blue-600', bg: 'bg-blue-50' }
    return { label: 'Low Yield', color: 'text-orange-600', bg: 'bg-orange-50' }
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Rental Yield Calculator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              An easy-to-use calculator to work out the return on your investment property
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Input Form */}
              <Card className="border-2">
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold mb-6">Enter Your Details</h2>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="propertyPrice" className="text-base font-semibold">Property Price (£)</Label>
                      <Input
                        id="propertyPrice"
                        type="number"
                        value={propertyPrice}
                        onChange={(e) => setPropertyPrice(e.target.value)}
                        placeholder="e.g. 200000"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="monthlyRent" className="text-base font-semibold">Monthly Rent (£)</Label>
                      <Input
                        id="monthlyRent"
                        type="number"
                        value={monthlyRent}
                        onChange={(e) => setMonthlyRent(e.target.value)}
                        placeholder="e.g. 1000"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <Button onClick={calculateYield} className="w-full h-12 text-lg" size="lg">
                      <Calculator className="mr-2 h-5 w-5" />
                      Calculate Yield
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {annualYield !== null ? (
                  <>
                    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-8 text-center">
                        <h2 className="text-2xl font-bold mb-6">Your Rental Yield</h2>
                        <div className="bg-white rounded-lg p-8 shadow-sm mb-4">
                          <div className="text-7xl font-bold text-blue-600 mb-2">
                            {annualYield}%
                          </div>
                          <p className="text-gray-700 text-lg">
                            Annual return on investment
                          </p>
                        </div>
                        {(() => {
                          const category = getYieldCategory(annualYield)
                          return (
                            <div className={`${category.bg} rounded-lg p-4`}>
                              <p className={`font-bold text-lg ${category.color}`}>
                                {category.label}
                              </p>
                            </div>
                          )
                        })()}
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-8 text-center">
                      <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Enter your property details to calculate the rental yield</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-bold mb-4">Understanding Rental Yield</h3>
                    <p className="text-gray-700 mb-6">
                      Rental yield is a measure of the annual rental income as a percentage of the property's value. 
                      It helps investors assess the potential return on their investment property.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-emerald-50 rounded-lg p-4 border-2 border-emerald-200">
                        <p className="font-bold text-emerald-600 mb-1">Good Yield</p>
                        <p className="text-2xl font-bold text-emerald-700">5%+</p>
                        <p className="text-sm text-gray-600 mt-2">Strong investment return</p>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                        <p className="font-bold text-blue-600 mb-1">Average Yield</p>
                        <p className="text-2xl font-bold text-blue-700">3-5%</p>
                        <p className="text-sm text-gray-600 mt-2">Typical market return</p>
                      </div>
                      <div className="bg-orange-50 rounded-lg p-4 border-2 border-orange-200">
                        <p className="font-bold text-orange-600 mb-1">Low Yield</p>
                        <p className="text-2xl font-bold text-orange-700">&lt;3%</p>
                        <p className="text-sm text-gray-600 mt-2">Below average return</p>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm">
                      <strong>Note:</strong> This calculator provides a basic yield calculation. Actual returns 
                      may vary based on additional costs, void periods, maintenance, and property appreciation.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </>
  )
}

