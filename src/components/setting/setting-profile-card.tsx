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
      <div className="mr-4">
        {profileImageUrl ? (
          <Image width={60} height={60} src={profileImageUrl} alt="" />
        ) : (
          <Image width={60} height={60} src={defaultProfile} alt="" />
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
