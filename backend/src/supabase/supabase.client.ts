import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseAdminKey = process.env.SUPABASE_ADMIN_KEY

if (!supabaseUrl || !supabaseAnonKey || !supabaseAdminKey) {
  throw new Error("Supabase environment variables not loaded correctly.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
export const supabaseAdmin = createClient(supabaseUrl, supabaseAdminKey)