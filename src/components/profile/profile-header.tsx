'use client'

import Link from 'next/link'
import { useState } from 'react'
import { SettingButton } from '~/components/profile/profile-setting-button' // 설정 버튼 추가
import { Button } from '~/components/ui/button'

function ProfileHeader() {
  // 상태 관리: Following 여부
  const [isFollowing, setIsFollowing] = useState(true)

  // 버튼 클릭 시 상태 토글
  const toggleFollow = () => {
    setIsFollowing((prev) => !prev)
  }

  return (
    <div className="flex flex-col rounded-lg bg-white p-6 shadow">
      {/* Avatar */}
      <div className="mb-4 h-24 w-24 rounded-full bg-gray-300" />

      {/* Header 상단 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Alex Thompson</h2>
          <p className="text-gray-500">@alexthompson</p>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex gap-2">
          <Link href="/settings/personal-information" passHref>
            <Button variant="default">Edit Profile</Button>
          </Link>
          <Button
            onClick={toggleFollow}
            variant={isFollowing ? 'default' : 'outline'}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
          <SettingButton />
        </div>
      </div>

      {/* Description */}
      <p className="mt-4 text-gray-600">
        UX Researcher | A/B Testing Enthusiast | Data Driven Designer
      </p>

      {/* Stats */}
      <div className="mt-4 flex gap-6 text-sm text-gray-700">
        <Link href="/profile/followings" className="hover:underline">
          <strong>1,234</strong> Following
        </Link>
        <Link href="/profile/followers" className="hover:underline">
          <strong>5,678</strong> Followers
        </Link>
        <span>
          <strong>789</strong> Surveys
        </span>
      </div>
    </div>
  )
}

export { ProfileHeader }
