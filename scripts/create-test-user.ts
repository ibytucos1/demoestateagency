/**
 * Script to create a test user for the admin dashboard
 * 
 * Usage:
 * 1. First, sign up at /sign-up with an email and password
 * 2. Run: npm run create-user <email> <name> <role> <tenant-slug>
 * 
 * Examples:
 *   npm run create-user admin@bluebird.com "Bluebird Admin" admin bluebird test123
 *   npm run create-user admin@acme.com "ACME Admin" owner acme
 * 
 * Parameters:
 *   email (required): Email address of the user
 *   name (optional): Display name (default: "Admin User")
 *   role (optional): 'owner' | 'admin' | 'agent' (default: 'admin')
 *   tenant-slug (optional): 'acme' | 'bluebird' (default: 'acme')
 *   password (optional): Password for Supabase Auth (if provided, creates user automatically)
 */

import { db } from '../lib/db'
import { createClient } from '@supabase/supabase-js'
import { env } from '../lib/env'

async function createTestUser() {
  const email = process.argv[2] || 'admin@example.com'
  const name = process.argv[3] || 'Admin User'
  const role = (process.argv[4] as 'owner' | 'admin' | 'agent') || 'admin'
  const tenantSlug = process.argv[5] // Tenant slug - required if not provided, will use first tenant
  const password = process.argv[6] // Optional password - if provided, will create Supabase Auth user

  try {
    // Get all available tenants
    const allTenants = await db.tenant.findMany({
      select: { id: true, slug: true, name: true },
      orderBy: { createdAt: 'asc' },
    })

    if (allTenants.length === 0) {
      console.error('❌ No tenants found in database.')
      console.error('   Please run seed script first: npm run db:seed')
      process.exit(1)
    }

    // If no tenant slug provided, use the first tenant
    const requestedSlug = tenantSlug || allTenants[0].slug
    console.log(`Creating test user: ${email} for tenant: ${requestedSlug}...`)

    // Get tenant ID by slug
    const tenant = await db.tenant.findUnique({
      where: { slug: requestedSlug },
    })

    if (!tenant) {
      const availableSlugs = allTenants.map(t => t.slug).join(', ')
      console.error(`❌ Tenant "${requestedSlug}" not found.`)
      console.error(`   Available tenants: ${availableSlugs}`)
      console.error('   Please run seed script first: npm run db:seed')
      process.exit(1)
    }

    // Create Supabase admin client to find user by email
    const supabaseAdmin = createClient(
      env.SUPABASE_URL,
      env.SUPABASE_SERVICE_ROLE_KEY
    )

    // Find user by email in Supabase Auth
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error fetching users from Supabase:', listError.message)
      process.exit(1)
    }

    let supabaseUser = users.find(u => u.email === email)

    // If user doesn't exist and password is provided, create the user
    if (!supabaseUser && password) {
      console.log(`📝 Creating Supabase Auth user with email: ${email}...`)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          name,
        },
      })

      if (createError || !newUser.user) {
        console.error(`❌ Error creating Supabase Auth user:`, createError?.message)
        process.exit(1)
      }

      supabaseUser = newUser.user
      console.log(`✅ Supabase Auth user created successfully`)
    }

    if (!supabaseUser) {
      console.error(`❌ No Supabase user found with email: ${email}`)
      console.log('\n📝 Please sign up first at /sign-up with this email, then run this script again.')
      console.log('   Or provide a password as the 6th argument to create the user automatically.')
      process.exit(1)
    }

    const authId = supabaseUser.id

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { authId },
      include: { Tenant: true },
    })

    if (existingUser) {
      if (existingUser.tenantId === tenant.id) {
        console.log(`✅ User already exists for this tenant: ${existingUser.email} (${existingUser.role})`)
        console.log(`   ID: ${existingUser.id}`)
        console.log(`   Tenant: ${tenant.name}`)
        return
      } else {
        console.log(`⚠️  User already exists but for a different tenant:`)
        console.log(`   Email: ${existingUser.email}`)
        console.log(`   Current Tenant: ${existingUser.Tenant.name} (${existingUser.Tenant.slug})`)
        console.log(`   Requested Tenant: ${tenant.name} (${tenant.slug})`)
        console.log(`\n   To create a user for ${tenant.name}, use a different email address.`)
        console.log(`   Or update the existing user's tenantId manually in the database.`)
        process.exit(1)
      }
    }

    // Create user in database
    const user = await db.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name,
        role,
        authId,
      },
    })

    console.log('\n✅ Test user created successfully!')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ${user.role}`)
    console.log(`   Auth ID: ${user.authId}`)
    console.log(`   Tenant: ${tenant.name}`)
    console.log(`\n🔐 You can now sign in at /sign-in with:`)
    console.log(`   Email: ${email}`)
    console.log(`   Password: (the password you used when signing up)`)
    console.log(`\n📊 Access admin dashboard at: /admin`)
  } catch (error: any) {
    console.error('❌ Error creating user:', error.message)
    if (error.code === 'P2002') {
      console.error('   User with this email or authId already exists')
    }
    process.exit(1)
  }
}

createTestUser()

