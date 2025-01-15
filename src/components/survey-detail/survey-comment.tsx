import { useState } from 'react'
import { Heart } from 'lucide-react'
import Image from 'next/image'

import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Comment } from '~/types/comment'
import { ReplyInput } from './reply-input'

type SurveyCommentProps = {
  comment: Comment
  userId: string | null
  postId?: number
  handleCommentLikeToggle: (id: number) => void
}

function SurveyComment({
  comment,
  userId,
  handleCommentLikeToggle,
}: SurveyCommentProps) {
  const {
    id,
    dept,
    username,
    content,
    created_at,
    likeCount,
    userLiked,
    replies,
    post_id,
  } = comment
  const date = created_at.split('T')[0]
  const [reply, setReply] = useState<boolean>(false)
  const [replyId, setReplyId] = useState<number>(id)

  const toggleReply = () => {
    setReply(!reply)
    setReplyId(replyId)
  }

  return (
    <div className="mb-4 mt-2 flex">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        {/*프로필 이미지 기능 구현 시 변경*/}
        <Image src={defaultProfile} alt="" />{' '}
      </div>
      <div className="flex-auto">
        <div className="rounded-lg bg-primary-foreground px-5 py-3">
          <b>{username}</b>
          <p>{content}</p>
        </div>
        <div className="mt-2 flex text-sm text-muted-foreground">
          <button
            type="button"
            className="mr-4 flex items-center justify-start"
            onClick={() => handleCommentLikeToggle(id)}
          >
            <Heart
              size={14}
              color={userLiked ? 'red' : 'currentColor'}
              className="mr-1"
              strokeWidth={2}
            />
            {likeCount}
          </button>
          <button
            type="button"
            onClick={() => toggleReply()}
            className={`hover:text-black ${replies?.length ? 'mr-1' : 'mr-4'}`}
          >
            Add a Reply
          </button>
          {replies && replies.length > 0 && (
            <span className="mr-4">&middot; reply {replies.length}</span>
          )}
          <span>{date}</span>
        </div>

        {replies?.map((reply) => (
          <div key={reply.id} className="ml-5 mt-5 rounded-lg">
            <SurveyComment
              comment={reply}
              userId={userId}
              handleCommentLikeToggle={handleCommentLikeToggle}
            />
          </div>
        ))}

        {reply && userId && (
          <ReplyInput
            username={username}
            postId={post_id}
            userId={userId}
            replyId={replyId}
            dept={dept}
          />
        )}
      </div>
    </div>
  )
}

export { SurveyComment }
