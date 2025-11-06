'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function LandlordsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const closeTimeout = useRef<NodeJS.Timeout | null>(null)

  const handleOpen = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
      closeTimeout.current = null
    }
    setIsOpen(true)
  }

  const handleClose = () => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current)
    }
    closeTimeout.current = setTimeout(() => setIsOpen(false), 250)
  }

  return (
    <div 
      className="relative"
      onPointerEnter={handleOpen}
      onPointerLeave={handleClose}
    >
      <button
        className="text-gray-700 hover:text-primary font-medium transition-colors flex items-center gap-1"
      >
        Landlords
        <ChevronDown className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 pt-2"
          onPointerEnter={handleOpen}
          onPointerLeave={handleClose}
        >
          <div className="w-56 bg-white rounded-md shadow-lg border border-gray-200 py-2">
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
        </div>
      )}
    </div>
  )
}

