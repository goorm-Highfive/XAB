import { redirect } from 'next/navigation'
import SettingsMenu from '~/components/setting/setting-menu'
import { ProfileCard } from '~/components/setting/setting-profile-card'
import { fetchUserProfile } from '~/utils/supabase/fetch-user'

async function SettingsPage() {
  const fields = ['username']
  const profileData = await fetchUserProfile(fields)

  // 로그인되지 않았으면 로그인 페이지로 리디렉션
  if (!profileData) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <section className="p-0 pb-6">
          <ProfileCard username={profileData.username} />
        </section>
        <h1 className="mb-4 text-xl font-semibold">Settings</h1>
        <SettingsMenu />
      </div>
    </div>
  )
}

export default SettingsPage
