import { useState } from 'react'
import { Heart } from 'lucide-react'
import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Comment } from '~/types/comment'
import { ReplyInput } from './reply-input'
import { Textarea } from '../ui/textarea'
import { toast } from 'sonner'

type SurveyCommentProps = {
  comment: Comment
  postId?: number
  handleCommentLikeToggle: (id: number) => void
}

function SurveyComment({
  comment,
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
    is_delete,
  } = comment
  const date = created_at.split('T')[0]
  const [reply, setReply] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [editContent, setEditContent] = useState<string>(content)

  const handleEdit = () => {
    setIsEditing(true)
    console.log(id)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(content)
  }

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

  const handleDelete = async () => {
    const response = await fetch('/api/comments/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: id,
      }),
    })
    const result = await response.json()
    if (!result.success) throw new Error(result.error)
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
                <DropdownMenu>
                  <DropdownMenuTrigger className="rounded p-1 hover:bg-gray-100">
                    <Ellipsis className="text-gray-500" size={16} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleEdit}>
                      편집
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDelete}>
                      삭제
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            {isEditing && !is_delete ? (
              <div className="mt-2 flex flex-col gap-4">
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <div className="flex justify-end gap-3 text-sm">
                  <button onClick={handleCancel}>취소</button>
                  <button onClick={() => handleEditSubmit()}>수정 완료</button>
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
