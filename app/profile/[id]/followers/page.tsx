'use client'

import { UserListModal } from '~/components/profile/profile-user-list-modal'
import { useParams } from 'next/navigation' // useParams 가져오기

function FollowersPage() {
  const { id } = useParams() // URL에서 id 추출
  console.log('id: ' + id)
  return (
    <UserListModal
      title="Followers"
      apiEndpoint={`/api/profile/${id}/followers`} // id를 사용하여 API 엔드포인트 생성
    />
  )
}

export default FollowersPage
