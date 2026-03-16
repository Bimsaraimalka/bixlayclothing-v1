/**
 * Create the first owner (or promote an existing admin to owner).
 * Uses the service_role key. Run after applying the admin_profiles migration.
 *
 * Run from project root:
 *   node scripts/create-owner.js
 *
 * With custom email/password:
 *   ADMIN_EMAIL=owner@bixlay.com ADMIN_PASSWORD=yourpassword node scripts/create-owner.js
 *
 * Requires in .env.local: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

const path = require('path')
const fs = require('fs')

const envPath = path.resolve(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8')
  content.split('\n').forEach((line) => {
    const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/)
    if (match) {
      const key = match[1]
      const value = match[2].replace(/^["']|["']$/g, '').trim()
      if (!process.env[key]) process.env[key] = value
    }
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

if (!SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in .env.local')
  process.exit(1)
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const email = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || 'admin@bixlay.com').trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD || process.env.OWNER_PASSWORD || 'admin123'

  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'owner' },
  })

  if (authError) {
    if (authError.message.includes('already been registered')) {
      const { data: list } = await supabase.auth.admin.listUsers({ perPage: 1000 })
      const user = list?.users?.find((u) => (u.email || '').toLowerCase() === email)
      if (user) {
        const { error: profileError } = await supabase
          .from('admin_profiles')
          .upsert(
            { user_id: user.id, email: user.email || email, role: 'owner' },
            { onConflict: 'user_id' }
          )
        if (profileError) {
          console.error('Failed to set owner role:', profileError.message)
          process.exit(1)
        }
        console.log('User already exists. Updated admin_profiles to role: owner')
        console.log('Email:', email)
        console.log('Sign in at: /admin/login')
        return
      }
    }
    console.error('Error creating owner:', authError.message)
    process.exit(1)
  }

  const { error: profileError } = await supabase
    .from('admin_profiles')
    .upsert(
      { user_id: authData.user.id, email: authData.user.email ?? email, role: 'owner' },
      { onConflict: 'user_id' }
    )

  if (profileError) {
    console.error('User created but failed to add owner profile:', profileError.message)
    console.error('Insert manually in Supabase: admin_profiles (user_id, email, role) =', authData.user.id, email, 'owner')
    process.exit(1)
  }

  console.log('Owner created successfully.')
  console.log('Email:', email)
  console.log('Sign in at: /admin/login')
}

main()
