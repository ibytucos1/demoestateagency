import { NextRequest, NextResponse } from 'next/server'
import { getTenantId } from '@/lib/tenant'
import { requireAuth } from '@/lib/rbac'
import { db } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ listing })
  } catch (error) {
    console.error('Listing fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    await requireAuth(tenantId, ['owner', 'admin', 'agent'])

    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const body = await req.json()
    const updated = await db.listing.update({
      where: { id: params.id },
      data: body,
    })

    return NextResponse.json({ listing: updated })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Listing update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tenantId = await getTenantId()
    await requireAuth(tenantId, ['owner', 'admin'])

    const listing = await db.listing.findUnique({
      where: { id: params.id },
    })

    if (!listing || listing.tenantId !== tenantId) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    await db.listing.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    console.error('Listing deletion error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

