'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'

function SettingButton() {
  return (
    <Link
      href="/settings"
      className="flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
    >
      <Settings className="h-5 w-5 text-gray-700" />
      Settings
    </Link>
  )
}

export { SettingButton }
