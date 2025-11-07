import { NextRequest, NextResponse } from 'next/server'
import { getTenant } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'
import { readLimiter, writeLimiter } from '@/lib/ratelimit'
import { z } from 'zod'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const updateLeadSchema = z.object({
  status: z.enum(['new', 'contacted', 'qualified', 'converted', 'archived']).optional(),
  notes: z.string().optional(),
  assignedTo: z.string().nullable().optional(),
})

// GET /api/leads/[id] - Get single lead
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await readLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const lead = await db.lead.findUnique({
      where: { id: params.id },
      include: {
        Listing: {
          select: { title: true, slug: true },
        },
        AssignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    if (!lead || lead.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Get lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/leads/[id] - Update lead
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await writeLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const body = await req.json()
    const validatedData = updateLeadSchema.parse(body)

    // Check lead exists and belongs to tenant
    const existingLead = await db.lead.findUnique({
      where: { id: params.id },
      select: { id: true, tenantId: true },
    })

    if (!existingLead || existingLead.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // If assignedTo is provided, verify user exists and belongs to tenant
    if (validatedData.assignedTo !== undefined && validatedData.assignedTo !== null) {
      const assignedUser = await db.user.findUnique({
        where: { id: validatedData.assignedTo },
        select: { id: true, tenantId: true },
      })

      if (!assignedUser || assignedUser.tenantId !== tenantId) {
        return NextResponse.json(
          { error: 'Assigned user not found' },
          { status: 400 }
        )
      }
    }

    // Update lead
    const updatedLead = await db.lead.update({
      where: { id: params.id },
      data: validatedData,
      include: {
        Listing: {
          select: { title: true, slug: true },
        },
        AssignedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    })

    return NextResponse.json(updatedLead)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/leads/[id] - Delete lead
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
    const { success } = await writeLimiter.limit(ip)
    if (!success) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
    }

    const tenant = await getTenant()
    const tenantId = tenant.id
    await requireAuth(tenantId, ['owner', 'admin'])

    // Check lead exists and belongs to tenant
    const existingLead = await db.lead.findUnique({
      where: { id: params.id },
      select: { id: true, tenantId: true },
    })

    if (!existingLead || existingLead.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    // Delete lead
    await db.lead.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete lead error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

