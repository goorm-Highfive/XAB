'use client'

import Image from 'next/image'
import { Button } from '~/components/ui/button'
import { fetchUserProfile } from '~/utils/fetch-user'
import { useProfileImage } from '~/hooks/use-profile-image'

interface ProfileInfoProps {
  user?: Awaited<ReturnType<typeof fetchUserProfile>> | null
}

function ProfileImageUpload({ user }: ProfileInfoProps) {
  const { avatarUrl, fileInputRef, handleUpload, handleSetDefaultImage } =
    useProfileImage({ user })

  return (
    <div className="mb-6 flex flex-col">
      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full">
        <Image
          fill
          className="object-cover"
          src={avatarUrl}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          alt="프로필 이미지"
          quality={85}
          priority
        />
      </div>
      <div>
        <Button
          variant="outline"
          className="mr-4"
          onClick={() => fileInputRef.current?.click()}
        >
          프로필 이미지 변경
        </Button>
        <Button variant="outline" onClick={handleSetDefaultImage}>
          기본 이미지로 변경
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
        />
      </div>
    </div>
  )
}

export { ProfileImageUpload }
