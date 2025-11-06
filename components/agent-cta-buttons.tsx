'use client'

import { Button } from '@/components/ui/button'
import { Calendar, MessageCircle, Phone } from 'lucide-react'

interface AgentCTAButtonsProps {
  whatsappLink: string | null
  phoneNumber: string | null
}

export function AgentCTAButtons({ whatsappLink, phoneNumber }: AgentCTAButtonsProps) {
  const handleArrangeViewing = () => {
    const form = document.querySelector('#enquiry-form')
    form?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  return (
    <div className="space-y-3">
      <Button 
        size="lg" 
        className="w-full text-base"
        onClick={handleArrangeViewing}
      >
        <Calendar className="h-5 w-5 mr-2" />
        Arrange a Viewing
      </Button>
      {whatsappLink && (
        <Button
          variant="outline"
          size="lg"
          className="w-full text-base border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          asChild
        >
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5 mr-2" />
            Chat on WhatsApp
          </a>
        </Button>
      )}
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full text-base"
        asChild
      >
        <a href={`tel:${phoneNumber || '+442012345678'}`}>
          <Phone className="h-5 w-5 mr-2" />
          Call Agent
        </a>
      </Button>
      <div className="text-center text-sm text-gray-600 pt-2">
        or
      </div>
      <p className="text-center text-sm text-gray-600">
        Get in touch for more information
      </p>
    </div>
  )
}

