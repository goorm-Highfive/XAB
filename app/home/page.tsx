import { Suspense } from 'react'
import { SurveyList } from '~/components/home/survey-list'
import { ProfileSection } from '~/components/home/profile-section'
import { SuggestSection } from '~/components/home/suggest-section'
import { NewSurveyButton } from '~/components/home/new-survey-button'
import { SurveyCardSkeleton } from '~/components/common/survey-card/surveycard-skeleton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-screen-2xl items-start gap-6 p-6 lg:flex">
        <div className="lg:w-72">
          <ProfileSection />
        </div>
        <div className="flex-1 space-y-6">
          <NewSurveyButton />
          <Suspense fallback={<SurveyCardSkeleton />}>
            <SurveyList type="feed" />
          </Suspense>
        </div>
        <SuggestSection />
      </div>
    </div>
  )
}
