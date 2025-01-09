// app/settings/page.tsx
import { createClient } from '~/utils/supabase/server'
import SettingsMenu from '~/components/setting/setting-menu'
import { ProfileCard } from '~/components/setting/setting-profile-card'

async function fetchUserInfo(): Promise<{ username: string } | null> {
  const supabase = await createClient()

  // 현재 로그인된 사용자 정보 가져오기
  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError || !authData?.user) return null

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('username')
    .eq('id', authData.user.id)
    .single()

  if (userError) {
    console.error('Error fetching user info:', userError)
    return null
  }

  return userData
}

async function SettingsPage() {
  const userInfo = await fetchUserInfo()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <section className="p-0 pb-6">
          <ProfileCard username={userInfo?.username} />
        </section>
        <h1 className="mb-4 text-xl font-semibold">Settings</h1>
        <SettingsMenu />
      </div>
    </div>
  )
}

export default SettingsPage
