import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { db } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * Track WhatsApp clicks and redirect to WhatsApp
 * This allows us to count how many people click WhatsApp links
 */
export async function GET(req: NextRequest) {
  try {
    const tenant = await getTenant()
    const tenantId = tenant.id

    const searchParams = req.nextUrl.searchParams
    const listingId = searchParams.get('listingId')
    const whatsappNumber = searchParams.get('number')
    const message = searchParams.get('message') || 'Hi, I\'m interested in this property'

    // Validate WhatsApp number
    if (!whatsappNumber) {
      return NextResponse.json({ error: 'WhatsApp number required' }, { status: 400 })
    }

    // Verify listing belongs to tenant if listingId provided
    if (listingId) {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
        select: { tenantId: true },
      })

      if (!listing || listing.tenantId !== tenantId) {
        return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
      }
    }

    // Get IP address and user agent for tracking
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const userAgent = req.headers.get('user-agent') || 'unknown'

    // Track the click
    await db.whatsAppClick.create({
      data: {
        tenantId,
        listingId: listingId || null,
        ipAddress,
        userAgent,
      },
    })

    // Build WhatsApp URL
    const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`

    // Redirect to WhatsApp
    return NextResponse.redirect(whatsappUrl)
  } catch (error) {
    console.error('WhatsApp tracking error:', error)
    // If tracking fails, still try to redirect
    const whatsappNumber = req.nextUrl.searchParams.get('number')
    const message = req.nextUrl.searchParams.get('message') || 'Hi, I\'m interested in this property'
    if (whatsappNumber) {
      const cleanNumber = whatsappNumber.replace(/[^\d]/g, '')
      const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
      return NextResponse.redirect(whatsappUrl)
    }
    return NextResponse.json({ error: 'Failed to track WhatsApp click' }, { status: 500 })
  }
}

