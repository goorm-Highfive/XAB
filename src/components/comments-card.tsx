import { PostComment } from '~/components/post-comment'
import { PostCommentInput } from '~/components/post-comment-input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

function CommentsCard({}) {
  return (
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
  )
}

export { CommentsCard }
