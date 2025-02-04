import defaultProfile from '~/assets/svgs/default-profile.svg'
import Image from 'next/image'

type ProfileCardProps = {
  username: string
  profile_image?: string | null
}

function ProfileCard({ username, profile_image }: ProfileCardProps) {
  return (
    <div className="flex items-center pb-6">
      {/* Avatar */}
      <div className="relative mr-4 h-[60px] w-[60px] overflow-hidden rounded-full">
        <Image
          fill
          className="object-cover"
          src={profile_image || defaultProfile}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          alt={`${username}의 프로필 이미지}`}
        />
      </div>
      {/* User Info */}
      <div>
        <p className="text-md font-semibold leading-none">{username}</p>
      </div>
    </div>
  )
}

export { ProfileCard }
