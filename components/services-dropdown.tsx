'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const [showCalculators, setShowCalculators] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1"
      >
        Services
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          <Link
            href="/services/auctions"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Auctions
          </Link>
          <Link
            href="/services/investing-land"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Investing/Land
          </Link>
          <Link
            href="/services/mortgages"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Mortgages
          </Link>
          <Link
            href="/services/market-appraisals"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Market Appraisals
          </Link>
          <div
            className="relative"
            onMouseEnter={() => setShowCalculators(true)}
            onMouseLeave={() => setShowCalculators(false)}
          >
            <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
              <span>Calculators</span>
              <ChevronRight className="h-4 w-4" />
            </div>
            {showCalculators && (
              <div className="absolute left-full top-0 ml-1 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2">
                <Link
                  href="/services/calculators/mortgage"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Mortgage Calculator
                </Link>
                <Link
                  href="/services/calculators/rental-yield"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Rental Yield Calculator
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

