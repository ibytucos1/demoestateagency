'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

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
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Mortgage Calculator</h1>
        <p className="text-lg text-gray-600 mb-8">
          Calculate your estimated monthly mortgage payments and total repayment amount.
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
              <Label htmlFor="deposit">Deposit (£)</Label>
              <Input
                id="deposit"
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="Enter deposit amount"
              />
            </div>

            <div>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                step="0.1"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                placeholder="4.5"
              />
            </div>

            <div>
              <Label htmlFor="loanTerm">Loan Term (years)</Label>
              <Input
                id="loanTerm"
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="25"
              />
            </div>

            <Button onClick={calculateMortgage} className="w-full">
              Calculate
            </Button>
          </div>
        </div>

        {monthlyPayment !== null && totalRepayment !== null && (
          <div className="bg-blue-50 rounded-lg p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-4">Your Mortgage Estimate</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Monthly Payment:</span>
                <span className="text-2xl font-bold text-blue-600">£{monthlyPayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-gray-700">Total Repayment:</span>
                <span className="text-xl font-semibold text-gray-900">£{totalRepayment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Interest:</span>
                <span className="text-xl font-semibold text-gray-900">
                  £{(totalRepayment - (parseFloat(propertyPrice) || 0) + (parseFloat(deposit) || 0)).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-700 mb-4">
            <strong>Disclaimer:</strong> This calculator provides estimates only. Actual mortgage rates 
            and terms may vary. Contact us to speak with an independent mortgage broker for personalized advice.
          </p>
          <Button asChild variant="outline">
            <Link href="/services/mortgages">Learn More About Mortgages</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

