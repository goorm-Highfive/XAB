import defaultProfile from '~/assets/svgs/default-profile.svg'
import Image from 'next/image'

type ProfileCardProps = {
  username?: string
  profileImageUrl?: string
}

function ProfileCard({ username, profileImageUrl }: ProfileCardProps) {
  return (
    <div className="flex items-center">
      {/* Avatar */}
      <div className="relative mr-4 h-[60px] w-[60px] overflow-hidden rounded-full">
        {profileImageUrl ? (
          <Image
            fill
            className="object-cover"
            src={profileImageUrl}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt=""
          />
        ) : (
          <Image
            fill
            className="object-cover"
            src={defaultProfile}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            alt=""
          />
        )}
      </div>
      {/* User Info */}
      <div>
        <p className="text-md font-semibold leading-none">
          {username || 'Guest'}
        </p>
      </div>
    </div>
  )
}

export { ProfileCard }
