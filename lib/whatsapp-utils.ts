/**
 * Generate WhatsApp tracking URL
 * This redirects through our tracking endpoint before opening WhatsApp
 */
export function getWhatsAppTrackingUrl(
  whatsappNumber: string,
  message: string,
  listingId?: string
): string {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')
  const params = new URLSearchParams({
    number: whatsappNumber,
    message,
    ...(listingId && { listingId }),
  })
  
  return `/api/whatsapp/track?${params.toString()}`
}

