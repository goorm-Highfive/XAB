import { PostComment } from '~/components/post-comment'
import { PostCommentInput } from '~/components/post-comment-input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'

// 임시 댓글 데이터 타입 정의
type commentMokData = {
  id: string
  writer: string
  content: string
  likeCount: number //해당 댓글의 좋아요 수
  date: string
  userLiked: boolean //현재 사용자가 해당 댓글에 좋아요를 눌렀는지 여부
  replies?: commentMokData[]
}

type commnetsCardProps = {
  comments: commentMokData[]
}

function CommentsCard({ comments }: commnetsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comments (89)</CardTitle>
      </CardHeader>
      <CardContent>
        {comments.map((comment) => (
          <PostComment comment={comment} key={comment.id} />
        ))}
        <PostCommentInput />
      </CardContent>
    </Card>
  )
}

export { CommentsCard }
