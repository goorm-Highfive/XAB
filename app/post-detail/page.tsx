import { SiteHeader } from '~/components/common/site-header'
import { PostArticle } from '~/components/post-article'
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
          <PostArticle />
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
