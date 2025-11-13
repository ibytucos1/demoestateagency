'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Calculator, TrendingUp, PiggyBank, Home, Sparkles } from 'lucide-react'

interface MortgageCalculatorProps {
  propertyPrice?: number
}

export function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState('')
  const [deposit, setDeposit] = useState('')
  const [interestRate, setInterestRate] = useState('4.5')
  const [loanTerm, setLoanTerm] = useState('25')
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null)
  const [totalRepayment, setTotalRepayment] = useState<number | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)

  // Pre-fill property price if provided
  useEffect(() => {
    if (propertyPrice) {
      setPrice(propertyPrice.toString())
      // Suggest 10% deposit
      setDeposit((propertyPrice * 0.1).toString())
    }
  }, [propertyPrice])

  const calculateMortgage = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      const propertyValue = parseFloat(price) || 0
      const depositAmount = parseFloat(deposit) || 0
      const rate = parseFloat(interestRate) || 0
      const term = parseFloat(loanTerm) || 25

      const loanAmount = propertyValue - depositAmount
      if (loanAmount <= 0) {
        setMonthlyPayment(null)
        setTotalRepayment(null)
        setIsCalculating(false)
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
      setIsCalculating(false)
    }, 600)
  }

  const depositPercentage = price && deposit ? ((parseFloat(deposit) / parseFloat(price)) * 100).toFixed(0) : 0
  const loanToValue = price && deposit ? (100 - parseFloat(depositPercentage.toString())).toFixed(0) : 0

  return (
    <div className="relative overflow-hidden rounded-3xl border-2 border-gray-200 bg-white shadow-sm">
      <div className="relative bg-white rounded-3xl overflow-hidden">
        {/* Header with subtle gradient overlay */}
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 overflow-hidden border-b border-gray-200">
          {/* Subtle animated circles */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-100/20 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-blue-600 rounded-2xl">
                <Calculator className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  Mortgage Calculator
                  <Sparkles className="h-5 w-5 text-blue-600" />
                </h3>
                <p className="text-gray-600 text-sm">Calculate your dream home affordability</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Property Price */}
              <div className="group">
                <Label htmlFor="propertyPrice" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Home className="h-4 w-4 text-blue-600" />
                  Property Price (£)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">£</span>
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="300000"
                    className="pl-8 h-14 text-lg border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-all group-hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Deposit */}
              <div className="group">
                <Label htmlFor="deposit" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <PiggyBank className="h-4 w-4 text-green-600" />
                  Deposit (£)
                  {depositPercentage > 0 && (
                    <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-bold">
                      {depositPercentage}% deposit
                    </span>
                  )}
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">£</span>
                  <Input
                    id="deposit"
                    type="number"
                    value={deposit}
                    onChange={(e) => setDeposit(e.target.value)}
                    placeholder="30000"
                    className="pl-8 h-14 text-lg border-2 border-gray-200 focus:border-green-500 rounded-xl transition-all group-hover:border-gray-300"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div className="group">
                <Label htmlFor="interestRate" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  Interest Rate (%)
                </Label>
                <div className="relative">
                  <Input
                    id="interestRate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="4.5"
                    className="h-14 text-lg border-2 border-gray-200 focus:border-orange-500 rounded-xl transition-all group-hover:border-gray-300"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div className="group">
                <Label htmlFor="loanTerm" className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                  <Calculator className="h-4 w-4 text-purple-600" />
                  Loan Term (years)
                </Label>
                <div className="relative">
                  <Input
                    id="loanTerm"
                    type="number"
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    placeholder="25"
                    className="h-14 text-lg border-2 border-gray-200 focus:border-purple-500 rounded-xl transition-all group-hover:border-gray-300"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">years</span>
                </div>
              </div>

              <Button 
                onClick={calculateMortgage} 
                disabled={isCalculating}
                className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {isCalculating ? (
                  <>
                    <div className="h-5 w-5 border-3 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Calculating...
                  </>
                ) : (
                  <>
                    <Calculator className="mr-2 h-5 w-5" />
                    Calculate Payment
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="lg:pl-4">
              {monthlyPayment !== null && totalRepayment !== null ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Main Monthly Payment Card */}
                  <div className="relative overflow-hidden rounded-2xl bg-blue-600 p-8 text-white shadow-lg border border-blue-700">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      <p className="text-sm font-medium text-blue-100 mb-2 flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        Your Monthly Payment
                      </p>
                      <p className="text-5xl font-black mb-1">£{monthlyPayment.toLocaleString()}</p>
                      <p className="text-blue-100 text-sm">per month for {loanTerm} years</p>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <PiggyBank className="h-4 w-4 text-green-700" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600">LTV Ratio</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{loanToValue}%</p>
                    </div>

                    <div className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <TrendingUp className="h-4 w-4 text-orange-700" />
                        </div>
                        <p className="text-xs font-semibold text-gray-600">Interest</p>
                      </div>
                      <p className="text-2xl font-bold text-gray-900">{interestRate}%</p>
                    </div>
                  </div>

                  {/* Breakdown Card */}
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 space-y-4">
                    <h4 className="font-bold text-gray-900 flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-gray-600" />
                      Payment Breakdown
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Total Repayment</span>
                        <span className="text-lg font-bold text-gray-900">£{totalRepayment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Total Interest</span>
                        <span className="text-lg font-bold text-gray-900">
                          £{(totalRepayment - (parseFloat(price) || 0) + (parseFloat(deposit) || 0)).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200">
                        <span className="text-sm font-medium text-gray-600">Loan Amount</span>
                        <span className="text-lg font-bold text-gray-900">
                          £{((parseFloat(price) || 0) - (parseFloat(deposit) || 0)).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 text-center bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    ⚠️ This is an estimate only. Actual mortgage rates and terms may vary. 
                    <br />
                    Contact us for personalized advice.
                  </p>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-12">
                  <div className="text-center">
                    <div className="relative inline-block mb-6">
                      <Calculator className="h-16 w-16 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">Ready to Calculate</p>
                    <p className="text-sm text-gray-500">
                      Enter your details and click<br />Calculate Payment to see results
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

