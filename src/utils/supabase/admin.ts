import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!serviceRoleKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY가 누락되었습니다.')
  throw new Error('Service Role Key가 설정되지 않았습니다.')
}

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('Supabase URL 또는 Service Role Key가 누락되었습니다.')
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export const adminAuthClient = supabase.auth.admin
