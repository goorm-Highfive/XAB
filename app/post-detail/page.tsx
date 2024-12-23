import { SiteHeader } from '~/components/common/site-header'
import { SurveyCard } from '~/components/common/survey-card'
import { PostComment } from '~/components/post-comment'
import { PostCommentInput } from '~/components/post-comment-input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

// 게시글 뷰페이지
function PostDetailPage() {
  return (
    <div className="h-screen bg-gray-100">
      <SiteHeader></SiteHeader>
      <div className="mx-auto max-w-[1248px] pt-[24px]">
        <section>
          <SurveyCard
            date="March 15, 2025"
            question="Which landing page design do you prefer for our new product?"
            optionA="Design A"
            optionB="Design B"
            votesA={50}
            votesB={50}
            showVoteBtn={true} //투표 버튼은 상세페이지에서만 보입니다.
          />
        </section>
        <section className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Comments (89)</CardTitle>
            </CardHeader>
            <CardContent>
              <PostComment />
              <PostComment />
              <PostCommentInput />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}

export default PostDetailPage
