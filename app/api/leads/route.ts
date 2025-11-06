import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { db } from '@/lib/db'
import { emailService } from '@/lib/email'
import { writeLimiter } from '@/lib/ratelimit'
import { verifyTurnstileToken } from '@/lib/turnstile'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await writeLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    const tenantId = tenant.id
    const body = await req.json()

    const { listingId, name, email, phone, message, turnstileToken } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify Turnstile token if configured
    const turnstileValid = await verifyTurnstileToken(turnstileToken || '')
    if (!turnstileValid) {
      return NextResponse.json(
        { error: 'Security verification failed. Please try again.' },
        { status: 400 }
      )
    }

    // Verify listing exists and belongs to tenant
    if (listingId) {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
        select: { id: true, tenantId: true, title: true, slug: true },
      })

      if (!listing || listing.tenantId !== tenantId) {
        return NextResponse.json(
          { error: 'Listing not found' },
          { status: 404 }
        )
      }
    }

    // Create lead
    const lead = await db.lead.create({
      data: {
        tenantId,
        listingId: listingId || null,
        name,
        email,
        phone: phone || null,
        message,
        source: 'form',
      },
    })

    // Send email notification (non-blocking)
    if (listingId) {
      const listing = await db.listing.findUnique({
        where: { id: listingId },
        select: { title: true, slug: true },
      })
      emailService.sendLeadNotification({
        tenantName: tenant.name || 'Real Estate',
        listingTitle: listing?.title,
        listingSlug: listing?.slug,
        name,
        email,
        phone,
        message,
      }).catch(console.error)
    } else {
      emailService.sendLeadNotification({
        tenantName: tenant.name || 'Real Estate',
        name,
        email,
        phone,
        message,
      }).catch(console.error)
    }

    return NextResponse.json({ success: true, id: lead.id })
  } catch (error) {
    console.error('Lead creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

