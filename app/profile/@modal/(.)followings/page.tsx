import { UserListModal } from '~/components/profile/profile-user-list-modal'

function FollowingsPage() {
  return (
    <UserListModal title="Followings" apiEndpoint="/api/profile/followings" />
  )
}
export default FollowingsPage
