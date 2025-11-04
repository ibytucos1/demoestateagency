import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUserId } from '@/lib/auth'
import { getTenantId } from '@/lib/tenant'
import { db } from '@/lib/db'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'

export async function POST(req: NextRequest) {
  try {
    const authId = await getCurrentUserId()
    if (!authId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const tenantIdFromRequest = await getTenantId()
    console.log(`[create-user] getTenantId() returned: ${tenantIdFromRequest}`)
    
    const tenant = await db.tenant.findUnique({
      where: { slug: tenantIdFromRequest },
    })

    if (!tenant) {
      // Try by ID
      const tenantById = await db.tenant.findUnique({
        where: { id: tenantIdFromRequest },
      })
      if (!tenantById) {
        console.log(`[create-user] Tenant not found by slug or ID: ${tenantIdFromRequest}`)
        return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
      }
      var finalTenant = tenantById
    } else {
      var finalTenant = tenant
    }

    console.log(`[create-user] Using tenant: id=${finalTenant.id}, slug=${finalTenant.slug}`)

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { authId },
    })

    if (existingUser) {
      return NextResponse.json({ 
        success: true, 
        user: {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.name,
          role: existingUser.role,
        }
      })
    }

    // Get user info from Supabase Auth
    const supabaseAdmin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    )

    const { data: { user: supabaseUser }, error: getUserError } = await supabaseAdmin.auth.admin.getUserById(authId)

    if (getUserError || !supabaseUser) {
      return NextResponse.json({ error: 'Failed to get user from Supabase' }, { status: 500 })
    }

    // Create user in database
    const user = await db.user.create({
      data: {
        tenantId: finalTenant.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || null,
        role: 'admin', // Default role
        authId: supabaseUser.id,
      },
    })

    return NextResponse.json({ 
      success: true, 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    })
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

