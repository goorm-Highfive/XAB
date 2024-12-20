'use client'

import {
  ChevronRight,
  User,
  Lock,
  Bell,
  Info,
  FileText,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'

function SettingsMenu() {
  return (
    <div className="mx-auto max-w-sm p-4">
      {/* Account Section */}
      <div>
        <h2 className="mb-2 text-sm text-gray-500">Account</h2>
        <div className="space-y-2">
          <MenuItem
            icon={User}
            label="Personal Information"
            href="/settings/personal-information"
          />
          <MenuItem
            icon={Lock}
            label="Password and Security"
            href="/settings/password-and-security"
          />
          <MenuItem icon={Bell} label="Notifications" href="/notify" />
        </div>
      </div>

      {/* Other Section */}
      <div className="mt-6">
        <h2 className="mb-2 text-sm text-gray-500">Other</h2>
        <div className="space-y-2">
          <MenuItem icon={Info} label="About" href="/settings/about" />
          <MenuItem
            icon={FileText}
            label="Terms of Service"
            href="/settings/terms"
          />
          <MenuItem icon={LogOut} label="Log Out" isLogout />
        </div>
      </div>
    </div>
  )
}

const MenuItem = ({
  icon: Icon,
  label,
  isLogout,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  isLogout?: boolean
  href?: string // Link의 목적지
}) => {
  // 버튼인지 링크인지 결정
  const Wrapper = href ? Link : 'button'

  return (
    <Wrapper
      href={href}
      className={`flex w-full items-center justify-between rounded-lg px-4 py-2 ${
        isLogout ? 'text-red-500 hover:bg-red-50' : 'hover:bg-gray-100'
      }`}
    >
      <div className="flex items-center space-x-3">
        <Icon className="h-5 w-5 text-gray-600" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <ChevronRight className="h-5 w-5 text-gray-400" />
    </Wrapper>
  )
}

export default SettingsMenu
