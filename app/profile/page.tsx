import { ProfileHeader } from '~/components/profile/profile-header'
import { SurveyCard } from '~/components/common/survey-card'

function ProfilePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          <ProfileHeader />

          <SurveyCard
            date="March 15, 2025"
            username="John Doe" // 필수 prop 추가
            question="Which landing page design do you prefer for our new product?"
            post_image_url={null} // 필수 prop 추가
            optionA="Design A"
            optionB="Design B"
            optionA_url={null} // 필수 prop 추가
            optionB_url={null} // 필수 prop 추가
            votesA={790}
            votesB={444}
            commentsCount={10} // 필수 prop 추가
            userVote={null} // 필수 prop 추가
            ab_test_id={null} // 필수 prop 추가
            postId={1} // 필수 prop 추가
            voteComplete={true}
            initLikeCount={999}
            userLiked={false}
          />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
