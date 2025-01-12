import { UserListModal } from '~/components/profile/profile-user-list-modal'

function FollowersPage() {
  return (
    <UserListModal title="Followers" apiEndpoint="/api/profile/followers" />
  )
}

export default FollowersPage
