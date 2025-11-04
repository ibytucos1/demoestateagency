/**
 * Script to create a test user for the admin dashboard
 * 
 * Usage:
 * 1. First, sign up at /sign-up with an email and password
 * 2. Get your Supabase auth ID from Supabase dashboard or use the script below
 * 3. Run: pnpm tsx scripts/create-test-user.ts
 * 
 * Or use the simpler approach: sign up via /sign-up, then run this script
 * with your email and it will find your auth ID automatically.
 */

import { db } from '../lib/db'
import { createClient } from '@supabase/supabase-js'
import { env } from '../lib/env'

async function createTestUser() {
  const email = process.argv[2] || 'admin@example.com'
  const name = process.argv[3] || 'Admin User'
  const role = (process.argv[4] as 'owner' | 'admin' | 'agent') || 'admin'

  console.log(`Creating test user: ${email}...`)

  try {
    // Get tenant ID (default 'acme')
    const tenant = await db.tenant.findUnique({
      where: { slug: 'acme' },
    })

    if (!tenant) {
      console.error('❌ Tenant "acme" not found. Please run seed script first: pnpm db:seed')
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

    const supabaseUser = users.find(u => u.email === email)

    if (!supabaseUser) {
      console.error(`❌ No Supabase user found with email: ${email}`)
      console.log('\n📝 Please sign up first at /sign-up with this email, then run this script again.')
      process.exit(1)
    }

    const authId = supabaseUser.id

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { authId },
    })

    if (existingUser) {
      console.log(`✅ User already exists: ${existingUser.email} (${existingUser.role})`)
      console.log(`   ID: ${existingUser.id}`)
      console.log(`   Tenant: ${tenant.name}`)
      return
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

