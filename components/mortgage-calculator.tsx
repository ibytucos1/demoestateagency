'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calculator } from 'lucide-react'

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

  // Pre-fill property price if provided
  useEffect(() => {
    if (propertyPrice) {
      setPrice(propertyPrice.toString())
      // Suggest 10% deposit
      setDeposit((propertyPrice * 0.1).toString())
    }
  }, [propertyPrice])

  const calculateMortgage = () => {
    const propertyValue = parseFloat(price) || 0
    const depositAmount = parseFloat(deposit) || 0
    const rate = parseFloat(interestRate) || 0
    const term = parseFloat(loanTerm) || 25

    const loanAmount = propertyValue - depositAmount
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          Mortgage Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="propertyPrice" className="text-sm font-semibold">Property Price (£)</Label>
              <Input
                id="propertyPrice"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 300000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="deposit" className="text-sm font-semibold">Deposit (£)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="e.g. 30000"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="interestRate" className="text-sm font-semibold">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="4.5"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm" className="text-sm font-semibold">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="25"
                className="mt-1"
              />
            </div>

            <Button onClick={calculateMortgage} className="w-full">
              <Calculator className="mr-2 h-4 w-4" />
              Calculate
            </Button>
          </div>

          {/* Results */}
          <div>
            {monthlyPayment !== null && totalRepayment !== null ? (
              <div className="h-full flex flex-col justify-center space-y-4">
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg p-6 border border-primary/20">
                  <p className="text-sm text-gray-600 mb-2">Estimated Monthly Payment</p>
                  <p className="text-3xl font-bold text-primary">£{monthlyPayment.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-2">per month</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Repayment:</span>
                    <span className="font-semibold">£{totalRepayment.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Interest:</span>
                    <span className="font-semibold">
                      £{(totalRepayment - (parseFloat(price) || 0) + (parseFloat(deposit) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  * This is an estimate only. Actual rates may vary.
                </p>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg p-8">
                <div className="text-center">
                  <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">
                    Enter your details and click Calculate
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

