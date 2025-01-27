import { ProfileHeader } from '~/components/profile/profile-header'
import { SurveyCardSkeleton } from '~/components/common/survey-card/surveycard-skeleton'
import { Suspense } from 'react'
import { SurveyList } from '~/components/home/survey-list'

async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-6">
        <div className="mx-auto mt-6 max-w-3xl space-y-6">
          <ProfileHeader />
          <Suspense fallback={<SurveyCardSkeleton />}>
            <SurveyList type="profile" id={id} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
