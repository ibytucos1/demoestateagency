'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Calculator, ArrowRight, Info } from 'lucide-react'

export default function MortgageCalculatorPage() {
  const [propertyPrice, setPropertyPrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [interestRate, setInterestRate] = useState('4.5')
  const [loanTerm, setLoanTerm] = useState('25')
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [totalRepayment, setTotalRepayment] = useState<number | null>(null)

  const calculateMortgage = () => {
    const price = parseFloat(propertyPrice) || 0
    const depositAmount = parseFloat(deposit) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 25

    const loanAmount = price - depositAmount
    if (loanAmount <= 0) {
      setMonthlyPayment(null)
      setTotalRepayment(null)
      return
    }

    const monthlyRate = rate / 100 / 12
    const numberOfPayments = term * 12

    let payment = 0
    if (monthlyRate > 0) {
      payment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    } else {
      payment = loanAmount / numberOfPayments
    }

    setMonthlyPayment(Math.round(payment))
    setTotalRepayment(Math.round(payment * numberOfPayments))
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-indigo-700 py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Mortgage Calculator
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Calculate your estimated monthly mortgage payments and total repayment amount
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
                        placeholder="e.g. 300000"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="deposit" className="text-base font-semibold">Deposit (£)</Label>
                      <Input
                        id="deposit"
                        type="number"
                        value={deposit}
                        onChange={(e) => setDeposit(e.target.value)}
                        placeholder="e.g. 30000"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="interestRate" className="text-base font-semibold">Interest Rate (%)</Label>
                      <Input
                        id="interestRate"
                        type="number"
                        step="0.1"
                        value={interestRate}
                        onChange={(e) => setInterestRate(e.target.value)}
                        placeholder="4.5"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <div>
                      <Label htmlFor="loanTerm" className="text-base font-semibold">Loan Term (years)</Label>
                      <Input
                        id="loanTerm"
                        type="number"
                        value={loanTerm}
                        onChange={(e) => setLoanTerm(e.target.value)}
                        placeholder="25"
                        className="mt-2 h-12 text-lg"
                      />
                    </div>

                    <Button onClick={calculateMortgage} className="w-full h-12 text-lg" size="lg">
                      <Calculator className="mr-2 h-5 w-5" />
                      Calculate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Results */}
              <div className="space-y-6">
                {monthlyPayment !== null && totalRepayment !== null ? (
                  <>
                    <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
                      <CardContent className="p-8">
                        <h2 className="text-2xl font-bold mb-6">Your Mortgage Estimate</h2>
                        <div className="space-y-6">
                          <div className="bg-white rounded-lg p-6 shadow-sm">
                            <p className="text-sm text-gray-600 mb-2">Monthly Payment</p>
                            <p className="text-4xl font-bold text-blue-600">£{monthlyPayment.toLocaleString()}</p>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-sm">
                            <div className="flex justify-between items-center mb-3">
                              <span className="text-gray-700 font-medium">Total Repayment:</span>
                              <span className="text-xl font-bold text-gray-900">£{totalRepayment.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700 font-medium">Total Interest:</span>
                              <span className="text-xl font-bold text-gray-900">
                                £{(totalRepayment - (parseFloat(propertyPrice) || 0) + (parseFloat(deposit) || 0)).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                ) : (
                  <Card className="border-2 border-dashed">
                    <CardContent className="p-8 text-center">
                      <Calculator className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Enter your details and click Calculate to see your mortgage estimate</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer & CTA */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="border-2">
              <CardContent className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Info className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-lg mb-2">Important Information</h3>
                    <p className="text-gray-700 mb-4">
                      This calculator provides estimates only. Actual mortgage rates and terms may vary. 
                      Contact us to speak with an independent mortgage broker for personalized advice.
                    </p>
                    <Button asChild>
                      <Link href="/services/mortgages" className="flex items-center gap-2">
                        Learn More About Mortgages
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
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

