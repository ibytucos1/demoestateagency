'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandlordsDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1"
      >
        Landlords
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2 z-50">
          <Link
            href="/landlords"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Landlords
          </Link>
          <Link
            href="/landlords/let"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Let
          </Link>
          <Link
            href="/landlords/fees"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Landlords Fees
          </Link>
          <Link
            href="/landlords/property-management"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Property Management
          </Link>
          <Link
            href="/landlords/refurbishment-projects"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Refurbishment Projects
          </Link>
          <Link
            href="/landlords/block-management"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Block Management
          </Link>
        </div>
      )}
    </div>
  )
}

