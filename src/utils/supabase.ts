import { createClient, SupabaseClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl: string | undefined = process.env.SUPABASE_URL
const supabaseKey: string | undefined = process.env.SUPABASE_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Supabase URL or Key is missing. Please check your environment variables.',
  )
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey)
