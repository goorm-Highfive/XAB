import { Avatar, AvatarImage } from '~/components/ui/avatar'

type ProfileCardProps = {
  username?: string
  profileImageUrl?: string
}

function ProfileCard({ username, profileImageUrl }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <Avatar className="h-20 w-20">
        {profileImageUrl ? (
          <AvatarImage
            width={150}
            height={150}
            src={profileImageUrl}
            alt="프로필 사진"
          />
        ) : (
          <AvatarImage
            width={150}
            height={150}
            src={'/assets/svgs/default-profile.svg'}
            alt="프로필 사진"
          />
        )}
      </Avatar>
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
