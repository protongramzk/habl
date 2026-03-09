// Server-side Supabase client (for API routes and server components)
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided')
}

export const supabaseServer = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Helper for authenticated server requests
export async function getServerClient(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '')
  if (!token) throw new Error('No authorization token')
  
  const { data: { user }, error } = await supabaseServer.auth.getUser(token)
  if (error) throw error
  
  return { user, supabase: supabaseServer }
}