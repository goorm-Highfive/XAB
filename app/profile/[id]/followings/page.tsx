'use client'
import { UserListModal } from '~/components/profile/profile-user-list-modal'
import { useParams } from 'next/navigation'

function FollowingsPage() {
  const { id } = useParams()

  return (
    <UserListModal
      title="Followings"
      apiEndpoint={`/api/profile/${id}/followings`}
    />
  )
}
export default FollowingsPage
