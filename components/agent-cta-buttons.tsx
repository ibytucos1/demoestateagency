'use client'

import { Button } from '@/components/ui/button'
import { Calendar, Phone } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/whatsapp-icon'

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
      {/* Primary CTA - Arrange Viewing */}
      <Button 
        size="lg" 
        className="w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all bg-gradient-to-r from-primary to-primary/90"
        onClick={handleArrangeViewing}
      >
        <Calendar className="h-5 w-5 mr-2" />
        Arrange a Viewing
      </Button>

      {/* Contact Options Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* WhatsApp Button */}
        {whatsappLink && (
          <Button
            variant="outline"
            size="lg"
            className="h-12 text-sm font-semibold border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-md"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon className="h-5 w-5 mr-2" />
              WhatsApp
            </a>
          </Button>
        )}
        
        {/* Call Button */}
        <Button 
          variant="outline" 
          size="lg" 
          className={`h-12 text-sm font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all shadow-sm hover:shadow-md ${whatsappLink ? '' : 'col-span-2'}`}
          asChild
        >
          <a href={`tel:${phoneNumber || '+442012345678'}`}>
            <Phone className="h-5 w-5 mr-2" />
            Call Now
          </a>
        </Button>
      </div>

      {/* Divider with text */}
      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">or fill out the form below</span>
        </div>
      </div>
    </div>
  )
}

