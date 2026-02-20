/**
 * One-time script to create an admin user in Supabase Auth.
 * Uses the service_role key (server-only, never expose in the client).
 *
 * Run from project root:
 *   node scripts/create-admin-user.js
 * (Loads .env.local automatically, or use: node --env-file=.env.local scripts/create-admin-user.js)
 *
 * Optional: override email/password with env vars:
 *   ADMIN_EMAIL=admin@bixlay.com ADMIN_PASSWORD=yourpassword node scripts/create-admin-user.js
 *
 * Add to .env.local (do not commit, get from Supabase Dashboard → Project Settings → API):
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
 *
 * Note: The current /admin login uses a built-in check (admin@bixlay.com / admin123).
 * This script creates a user in Supabase Auth for use if you later switch admin to Supabase Auth.
 */

const path = require('path')
const fs = require('fs')

// Load .env.local if present (Node < 20.6 doesn't have --env-file)
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

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() || ''

if (!SUPABASE_URL) {
  console.error('Missing SUPABASE_URL. Add NEXT_PUBLIC_SUPABASE_URL to .env.local')
  process.exit(1)
}
if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in .env.local')
  console.error('')
  console.error('1. Open https://supabase.com/dashboard and select your project (mddsrudsansryzrknajf)')
  console.error('2. Go to Project Settings (gear) → API')
  console.error('3. Under "Project API keys", copy the service_role key (starts with eyJ..., marked secret)')
  console.error('4. In .env.local set: SUPABASE_SERVICE_ROLE_KEY=paste-the-key-here')
  console.error('')
  console.error('Never commit or expose the service_role key in client-side code.')
  process.exit(1)
}

async function main() {
  const { createClient } = await import('@supabase/supabase-js')
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const email = process.env.ADMIN_EMAIL || 'admin@bixlay.com'
  const password = process.env.ADMIN_PASSWORD || 'admin123'

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { role: 'admin' },
  })

  if (error) {
    if (error.message.includes('already been registered')) {
      console.log('Admin user already exists with this email. You can sign in at /admin/login with the same credentials.')
    } else {
      console.error('Error creating admin user:', error.message)
    }
    process.exit(1)
  }

  console.log('Admin user created successfully.')
  console.log('Email:', email)
  console.log('Sign in at: http://localhost:3000/admin/login')
}

main()
