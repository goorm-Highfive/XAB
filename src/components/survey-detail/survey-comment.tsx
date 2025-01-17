import { useState } from 'react'
import { Heart, Ellipsis } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { ReplyInput } from '~/components/survey-detail/reply-input'
import { Textarea } from '~/components/ui/textarea'
import { ModalAlert } from '~/components/common/modal-alert'
import { Comment } from '~/types/comment'
import defaultProfile from '~/assets/svgs/default-profile.svg'

type SurveyCommentProps = {
  comment: Comment
  postId?: number
  currentUserId?: string
  handleCommentLikeToggle: (id: number) => void
}

function SurveyComment({
  comment,
  currentUserId,
  handleCommentLikeToggle,
}: SurveyCommentProps) {
  const {
    id,
    dept,
    username,
    user_id,
    content,
    created_at,
    likeCount,
    userLiked,
    replies,
    post_id,
    is_delete,
  } = comment
  const date = created_at.split('T')[0]
  const [reply, setReply] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editContent, setEditContent] = useState<string>(content)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  // 수정 모드: 댓글을 단 유저랑 현재 로그인 한 유저가 다르면 수정 불가
  const handleEdit = () => {
    if (currentUserId !== user_id) {
      toast.error(`You are not allowed to edit other user's comments.`)
      return
    }

    setIsEditing(true)
    console.log(id)
  }

  // 수정 취소
  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(content)
  }

  // 수정한 데이터 DB에 전송
  const handleEditSubmit = async () => {
    const response = await fetch('/api/comments/edit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
        content: editContent,
      }),
    })

    const result = await response.json()
    if (!result.success) throw new Error(result.error)

    setIsEditing(false)
    toast.success('The comment has been successfully updated')
  }

  // 삭제: 댓글을 단 유저랑 현재 로그인 한 유저가 다르면 삭제 불가, Alert 먼저 뜸 -> 수락시 삭제
  const handleDelete = async () => {
    if (currentUserId !== user_id) {
      toast.error(`You are not allowed to delete other user's comments.`)
      return
    }
    const response = await fetch('/api/comments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
      }),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
    toast.success(`The comment has been successfully deleted.`)
  }

  return (
    <div className="mb-4 mt-2 flex">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        {/*프로필 이미지 기능 구현 시 변경*/}
        <Image src={defaultProfile} alt="" />{' '}
      </div>
      <div className="flex-auto">
        <div className="flex justify-between rounded-lg bg-primary-foreground px-5 py-3">
          <div className="w-full">
            <div className="mb-1 flex justify-between">
              {!is_delete ? <b>{username}</b> : <b>Unknown User</b>}
              {!is_delete && (
                <DropdownMenu
                  open={isOpen}
                  onOpenChange={(open) => setIsOpen(open)}
                >
                  <DropdownMenuTrigger className="rounded p-1 hover:bg-gray-100">
                    <Ellipsis className="text-gray-500" size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEdit}>
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.preventDefault() //DropdownMenu는 메뉴 선택 시 닫힘 -> Alert도 같이 닫혀서 사용해줌
                        setIsAlertOpen(true)
                        setIsOpen(false)
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              <ModalAlert
                open={isAlertOpen}
                onClose={() => setIsAlertOpen(false)}
                title="Are you sure you want to delete this comment?"
                description="Once deleted, this comment cannot be recovered. Are you sure you want to proceed?"
                buttonTitle="Cancel"
                secondButtonTitle="Delete"
                secondAlertAction={handleDelete}
                alertAction={() => setIsAlertOpen(false)}
              />
            </div>
            {isEditing && !is_delete ? (
              <div className="mt-2 flex flex-col gap-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex justify-end gap-3 text-sm">
                  <button
                    className="text-neutral-600 hover:text-neutral-950"
                    onClick={handleCancel}
                  >
                    Cancle
                  </button>
                  <button
                    className="text-neutral-600 hover:text-neutral-950"
                    onClick={() => handleEditSubmit()}
                  >
                    Submit
                  </button>
                </div>
              </div>
            ) : (
              <p className={is_delete ? 'text-gray-400' : ''}>{content}</p>
            )}
          </div>
        </div>
        {!is_delete && (
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
              onClick={() => setReply(!reply)}
              className={`hover:text-black ${replies?.length ? 'mr-1' : 'mr-4'}`}
            >
              Add a Reply
            </button>
            {replies && replies.length > 0 && (
              <span className="mr-4">&middot; reply {replies.length}</span>
            )}
            <span>{date}</span>
          </div>
        )}

        {replies?.map((reply) => (
          <div key={reply.id} className="ml-5 mt-5 rounded-lg">
            <SurveyComment
              comment={reply}
              handleCommentLikeToggle={handleCommentLikeToggle}
            />
          </div>
        ))}

        {reply && (
          <ReplyInput
            username={username}
            postId={post_id}
            replyId={id}
            dept={dept}
          />
        )}
      </div>
    </div>
  )
}

export { SurveyComment }
