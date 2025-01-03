'use client'

import { useState } from 'react'

import Image from 'next/image'
import defaultProfile from '~/assets/svg/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Heart, Send } from 'lucide-react'

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
  onToggleLike: () => void
  onToggleReplyLike: (replyId: string) => void
  onAddReply: (
    commentId: string,
    replyContent: string,
    mentionedUser: string,
  ) => void // 댓글에 대댓글 추가하는 함수
}

// 게시글 뷰페이지 : 댓글 개별 요소
function PostComment({
  comment,
  onToggleLike,
  onToggleReplyLike,
  onAddReply,
}: PostCommentProps) {
  const [replyWriter, setReplyWriter] = useState('')
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState('') // 대댓글 내용 관리

  const toggleReplyInput = (writer: string) => {
    if (showReplyInput && replyWriter === writer) {
      setShowReplyInput(false)
    } else {
      setReplyWriter(writer)
      setShowReplyInput(true)
      setReplyContent('') // 새로 입력할 때 초기화
    }
  }

  const handleReplyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReplyContent(e.target.value) // 답글 내용 업데이트
  }

  const handleReplySubmit = () => {
    if (replyContent.trim() !== '') {
      onAddReply(comment.id, replyContent, replyWriter) // 부모 컴포넌트의 댓글 추가 함수 호출
      setReplyContent('') // 답글 제출 후 입력창 초기화
      setShowReplyInput(false) // 입력창 닫기
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && replyContent.trim() !== '') {
      handleReplySubmit() // 엔터 키를 누르면 대댓글 제출
    }
  }

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
            onClick={onToggleLike}
          >
            {comment.userLiked ? (
              <Heart size={14} color="red" className="mr-1" strokeWidth={2} />
            ) : (
              <Heart size={14} className="mr-1 text-muted-foreground" />
            )}
            {comment.likeCount}
          </button>
          <button
            type="button"
            onClick={() => toggleReplyInput(comment.writer)}
            className={`${comment.replies && comment.replies.length > 0 ? 'mr-1' : 'mr-4'} hover:text-black`}
          >
            답글 달기
          </button>
          {comment.replies && comment.replies.length > 0 && (
            <span className="mr-4">&middot; 댓글 {comment.replies.length}</span>
          )}
          <span>{comment.date}</span>
        </div>

        {/* 답글 있을 경우 -> 답글 렌더링 */}
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
                  onClick={() => onToggleReplyLike(reply.id)}
                >
                  {reply.userLiked ? (
                    <Heart
                      size={14}
                      color="red"
                      className="mr-1"
                      strokeWidth={2}
                    />
                  ) : (
                    <Heart size={14} className="mr-1 text-muted-foreground" />
                  )}
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

        {/* [답글 달기] 클릭시 답글 input 보임 */}
        {showReplyInput && (
          <div className="mt-[25px] flex">
            <div className="mr-3 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
              <Image src={defaultProfile} alt="" />
            </div>
            <div className="relative flex-auto">
              <Input
                type="text"
                className="h-[40px] rounded-[30px] border-0 bg-primary-foreground pr-[40px]"
                placeholder={`@${replyWriter}에게 답글 달기`}
                value={replyContent} // 입력값을 상태에 바인딩
                onChange={handleReplyChange} // 입력값 변경 처리
                onKeyDown={handleKeyDown} // 엔터 키 이벤트 처리
              />
              <Button
                variant="ghost"
                className="z-1 absolute right-2 top-1 w-[30px] hover:bg-transparent"
                onClick={handleReplySubmit} // 답글 제출
              >
                <Send />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { PostComment }
