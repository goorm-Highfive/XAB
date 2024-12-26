import Image from 'next/image'
import defaultProfile from '~/assets/svg/default-profile.svg'
import { Heart } from 'lucide-react'

type commentMokData = {
  id: string
  writer: string
  content: string
  likeCount: number //해당 댓글의 좋아요 수
  date: string
  userLiked: boolean //현재 사용자가 해당 댓글에 좋아요를 눌렀는지 여부
  replies?: commentMokData[]
}

type PostCommentProps = {
  comment: commentMokData
}

// 게시글 뷰페이지 : 댓글 개별 요소
function PostComment({ comment }: PostCommentProps) {
  return (
    <div className="mb-6 flex">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="" />
      </div>
      <div key={comment.id} className="flex-auto">
        <div className="rounded-lg bg-primary-foreground p-3">
          <b>{comment.writer}</b>
          <p>{comment.content}</p>
        </div>
        <div className="mt-2 flex text-sm text-muted-foreground">
          <button
            type="button"
            className="mr-4 flex items-center justify-start"
          >
            <Heart size={14} className="mr-1 text-muted-foreground" />
            {comment.likeCount}
          </button>
          <button type="button" className="mr-1 hover:text-black">
            답글 달기
          </button>
          <span className="mr-4">
            &middot; 댓글 {comment.replies && comment.replies.length}
          </span>
          <span>{comment.date}</span>
        </div>
        {comment.replies &&
          comment.replies.map((reply) => (
            <div key={reply.id}>
              <div className="ml-5 mt-5 rounded-lg bg-primary-foreground p-3">
                <b>{reply.writer}</b>
                <p>{reply.content}</p>
              </div>
              <div className="ml-5 mt-2 flex text-sm text-muted-foreground">
                <button
                  type="button"
                  className="mr-4 flex items-center justify-start"
                >
                  <Heart size={14} className="mr-1 text-muted-foreground" />
                  {reply.likeCount}
                </button>
                <button type="button" className="mr-4 hover:text-black">
                  답글 달기
                </button>
                <span>{reply.date}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export { PostComment }
