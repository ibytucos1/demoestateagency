#!/usr/bin/env node

/**
 * Helper script to set up NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY
 * by copying from SUPABASE_URL and SUPABASE_ANON_KEY if they exist
 */

const fs = require('fs')
const path = require('path')

const envLocalPath = path.join(process.cwd(), '.env.local')
const envPath = path.join(process.cwd(), '.env')

// Read existing .env.local if it exists
let envLocal = {}
if (fs.existsSync(envLocalPath)) {
  const content = fs.readFileSync(envLocalPath, 'utf-8')
  content.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      envLocal[match[1].trim()] = match[2].trim()
    }
  })
}

// Read .env file to get SUPABASE_URL and SUPABASE_ANON_KEY
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8')
  content.split('\n').forEach(line => {
    const match = line.match(/^SUPABASE_URL=(.*)$/)
    if (match && !envLocal.NEXT_PUBLIC_SUPABASE_URL) {
      envLocal.NEXT_PUBLIC_SUPABASE_URL = match[1].trim()
    }
    const match2 = line.match(/^SUPABASE_ANON_KEY=(.*)$/)
    if (match2 && !envLocal.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      envLocal.NEXT_PUBLIC_SUPABASE_ANON_KEY = match2[1].trim()
    }
  })
}

// Write .env.local
const lines = []
Object.entries(envLocal).forEach(([key, value]) => {
  if (key.startsWith('NEXT_PUBLIC_SUPABASE')) {
    lines.push(`${key}=${value}`)
  }
})

// Append to existing .env.local or create new
let existingContent = ''
if (fs.existsSync(envLocalPath)) {
  existingContent = fs.readFileSync(envLocalPath, 'utf-8')
  // Remove existing NEXT_PUBLIC_SUPABASE vars
  existingContent = existingContent.split('\n').filter(line => {
    return !line.startsWith('NEXT_PUBLIC_SUPABASE')
  }).join('\n')
}

const newContent = existingContent + (existingContent && !existingContent.endsWith('\n') ? '\n' : '') + 
  lines.join('\n') + '\n'

fs.writeFileSync(envLocalPath, newContent)

console.log('✅ Added NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local')
console.log('   Please restart your dev server for changes to take effect.')

