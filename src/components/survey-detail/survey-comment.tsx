'use client'

import { useState } from 'react'
import Image from 'next/image'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { CommentData } from '~/types/comment'
import { Heart, Send } from 'lucide-react'

type SurveyCommentProps = {
  comment: CommentData
  onToggleLike: () => void
  onToggleReplyLike: (replyId: string) => void
  onAddReply: (
    commentId: string,
    replyContent: string,
    mentionedUser: string,
  ) => void
}

type ReplyInputProps = {
  replyWriter: string
  replyContent: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: () => void
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

// 특정 사용자를 대상으로 댓글을 작성할 수 있는 입력창
function ReplyInput({
  replyWriter,
  replyContent,
  onChange,
  onSubmit,
  onKeyDown,
}: ReplyInputProps) {
  return (
    <div className="mt-[25px] flex items-center">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="" />
      </div>
      <div className="relative flex-auto">
        <Input
          type="text"
          className="h-[40px] rounded-[30px] border-0 bg-primary-foreground pr-[40px]"
          placeholder={`@${replyWriter}에게 답글 달기`}
          value={replyContent}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
        <Button
          variant="ghost"
          className="absolute right-2 top-1 w-[30px] hover:bg-transparent"
          onClick={onSubmit}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

function SurveyComment({
  comment,
  onToggleLike,
  onToggleReplyLike,
  onAddReply,
}: SurveyCommentProps) {
  const [replyData, setReplyData] = useState({
    replyWriter: '',
    replyContent: '',
  })

  const toggleReplyInput = (writer: string) => {
    setReplyData((prev) => {
      const newWriter = prev.replyWriter === writer ? '' : writer
      return {
        replyWriter: newWriter,
        replyContent: '', // 내용 초기화
      }
    })
  }

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyData((prev) => ({
      ...prev,
      replyContent: e.target.value,
    }))
  }

  const handleReplySubmit = () => {
    if (replyData.replyContent.trim()) {
      onAddReply(comment.id, replyData.replyContent, replyData.replyWriter)
      setReplyData({
        replyWriter: '',
        replyContent: '',
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && replyData.replyContent.trim()) handleReplySubmit()
  }

  return (
    <div className="mb-6 flex">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="" />
      </div>
      <div className="flex-auto">
        <div className="rounded-lg bg-primary-foreground p-3">
          <b>{comment.writer}</b>
          <p>{comment.content}</p>
        </div>
        <div className="mt-2 flex text-sm text-muted-foreground">
          <button
            type="button"
            className="mr-4 flex items-center justify-start"
            onClick={onToggleLike}
          >
            <Heart
              size={14}
              color={comment.userLiked ? 'red' : 'currentColor'}
              className="mr-1"
              strokeWidth={2}
            />
            {comment.likeCount}
          </button>
          <button
            type="button"
            onClick={() => toggleReplyInput(comment.writer)}
            className={`hover:text-black ${comment.replies?.length ? 'mr-1' : 'mr-4'}`}
          >
            답글 달기
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <span className="mr-4">&middot; 댓글 {comment.replies.length}</span>
          )}
          <span>{comment.date}</span>
        </div>

        {/* 답글 렌더링 */}
        {comment.replies?.map((reply) => (
          <div key={reply.id} className="ml-5 mt-5 rounded-lg">
            <b>{reply.writer}</b>
            <p>{reply.content}</p>
            <div className="mt-2 flex text-sm text-muted-foreground">
              <button
                type="button"
                className="mr-4 flex items-center justify-start"
                onClick={() => onToggleReplyLike(reply.id)}
              >
                <Heart
                  size={14}
                  color={reply.userLiked ? 'red' : 'currentColor'}
                  className="mr-1"
                  strokeWidth={2}
                />
                {reply.likeCount}
              </button>
              <button
                type="button"
                className="mr-4 hover:text-black"
                onClick={() => toggleReplyInput(reply.writer)}
              >
                답글 달기
              </button>
              <span>{reply.date}</span>
            </div>
          </div>
        ))}

        {/* 답글 입력창 */}
        {replyData.replyWriter && (
          <ReplyInput
            replyWriter={replyData.replyWriter}
            replyContent={replyData.replyContent}
            onChange={handleReplyChange}
            onSubmit={handleReplySubmit}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
    </div>
  )
}

export { SurveyComment }
