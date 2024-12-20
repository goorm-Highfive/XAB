import SettingsMenu from '~/components/setting/setting-menu'
import { SiteHeader } from '~/components/common/site-header'
import { ProfileCard } from '~/components/setting/setting-profile-card'
export default function SettingsPage() {
  return (
    <div>
      <SiteHeader />
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
          <section className="p-0 pb-6">
            <ProfileCard />
          </section>
          <h1 className="mb-4 text-xl font-semibold">Settings</h1>
          <SettingsMenu />
        </div>
      </main>
    </div>
  )
}
