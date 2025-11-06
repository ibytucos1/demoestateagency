'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StickyCTABarProps {
  price: string
  whatsappLink?: string | null
  onContactClick?: () => void
}

export function StickyCTABar({ price, whatsappLink, onContactClick }: StickyCTABarProps) {
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
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-gray-600">Price</div>
            <div className="text-lg font-bold text-primary truncate">{price}</div>
          </div>
          <div className="flex gap-2">
            {whatsappLink ? (
              <Button
                size="sm"
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 flex-shrink-0"
                asChild
              >
                <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4" />
                </a>
              </Button>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="flex-shrink-0"
                onClick={onContactClick}
              >
                <Phone className="h-4 w-4" />
              </Button>
            )}
            <Button size="sm" className="flex-shrink-0">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="hidden xs:inline">Book</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

