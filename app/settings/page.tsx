import { redirect } from 'next/navigation'
import SettingsMenu from '~/components/setting/setting-menu'
import { ProfileCard } from '~/components/setting/setting-profile-card'
import { fetchUserProfile } from '~/utils/fetch-user'

async function SettingsPage() {
  const profileData = await fetchUserProfile()

  if (!profileData) {
    redirect('/account/login')
    return null // 리디렉션 후 렌더링 방지
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <section className="p-0 pb-6">
          <ProfileCard
            username={profileData.username}
            profileImageUrl={profileData.profileImage}
          />
        </section>
        <h1 className="mb-4 text-xl font-semibold">Settings</h1>
        <SettingsMenu />
      </div>
    </div>
  )
}

export default SettingsPage
