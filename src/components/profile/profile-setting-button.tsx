'use client'

import { Settings } from 'lucide-react'
import { useRouter } from 'next/navigation'

function SettingButton() {
  const router = useRouter()

  const handleSettingsClick = () => {
    router.push('/settings') // 설정 페이지로 이동
  }

  return (
    <button
      onClick={handleSettingsClick}
      className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <Settings className="h-5 w-5 text-gray-700" />
      Settings
    </button>
  )
}

export { SettingButton }
