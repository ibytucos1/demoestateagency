'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyCTABarProps {
  price: string
  whatsappLink?: string | null
  phoneNumber?: string | null
  onContactClick?: () => void
}

export function StickyCTABar({ price, whatsappLink, phoneNumber, onContactClick }: StickyCTABarProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show the bar after scrolling 300px
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-transform duration-300 lg:hidden",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      <div className="px-4 py-3">
        {/* Price */}
        <div className="mb-3">
          <div className="text-xs text-gray-600 mb-1">Price</div>
          <div className="text-2xl font-bold text-gray-900">{price}</div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex gap-2">
          {/* Call Button - Red */}
          <Button
            size="lg"
            className="flex-1 bg-red-500 hover:bg-red-600 text-white h-12"
            asChild={!!phoneNumber}
            onClick={phoneNumber ? undefined : onContactClick}
          >
            {phoneNumber ? (
              <a href={`tel:${phoneNumber}`}>
                <Phone className="h-5 w-5 mr-2" />
                Call
              </a>
            ) : (
              <>
                <Phone className="h-5 w-5 mr-2" />
                Call
              </>
            )}
          </Button>
          
          {/* WhatsApp Button - Green */}
          {whatsappLink && (
            <Button
              size="lg"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white h-12"
              asChild
            >
              <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" />
                WhatsApp
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

