import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Lock } from 'lucide-react'

type ProfileCardProps = {
  username?: string
}

function ProfileCard({ username }: ProfileCardProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage alt={username || 'User'} />
          <AvatarFallback>
            {username ? username[0].toUpperCase() : 'G'}
          </AvatarFallback>
        </Avatar>
        {/* Lock Icon */}
        <div className="absolute bottom-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-gray-800">
          <Lock className="h-3 w-3 text-white" />
        </div>
      </div>

      {/* User Info */}
      <div>
        <p className="text-sm font-semibold leading-none">
          {username || 'Guest'}
        </p>
        {username && <p className="mt-1 text-xs text-gray-500">@{username}</p>}
      </div>
    </div>
  )
}

export { ProfileCard }
