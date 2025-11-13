/**
 * Generate WhatsApp tracking URL
 * This redirects through our tracking endpoint before opening WhatsApp
 */
export function getWhatsAppTrackingUrl(
  whatsappNumber: string,
  message: string,
  listingId?: string,
  listingSlug?: string
): string {
  const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')
  
  // If we have a listing slug, append the URL to the message for rich preview
  let fullMessage = message
  if (listingSlug) {
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3005'
    const listingUrl = `${baseUrl}/listing/${listingSlug}`
    fullMessage = `${message}\n\n${listingUrl}`
  }
  
  const params = new URLSearchParams({
    number: whatsappNumber,
    message: fullMessage,
    ...(listingId && { listingId }),
  })
  
  return `/api/whatsapp/track?${params.toString()}`
}

