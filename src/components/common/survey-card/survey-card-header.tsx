// components/common/survey-card/SurveyCardHeader.tsx
'use client'
import Image from 'next/image'
import Link from 'next/link'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { Ellipsis } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import defaultProfile from '~/assets/svgs/default-profile.svg'

interface SurveyCardHeaderProps {
  userId: string
  currentUserId: string | null
  username: string
  date: string
  userProfileImage: string | null
  postId: number
}

export function SurveyCardHeader({
  userId,
  currentUserId,
  username,
  date,
  userProfileImage,
  postId,
}: SurveyCardHeaderProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) return
    setIsDeleting(true)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
        cache: 'no-store',
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(error || '게시글 삭제 실패')
      }

      await response.json()
      alert('게시글이 삭제되었습니다.')
      router.push('/')
      router.refresh()
    } catch (error: unknown) {
      console.error('게시글 삭제 오류:', error)
      alert(
        error instanceof Error
          ? error.message
          : '게시글 삭제 중 문제가 발생했습니다.',
      )
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      {/* 작성자 정보 */}
      <Link href={`/profile/${userId}`} className="flex items-center gap-4">
        <div className="relative h-[40px] w-[40px] overflow-hidden rounded-full">
          <Image
            fill
            className="object-cover"
            src={userProfileImage || defaultProfile}
            alt={username}
            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
            priority
          />
        </div>
        <div>
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-gray-500">{date.split('T')[0]}</p>
        </div>
      </Link>

      {/* 편집/삭제 메뉴 */}
      {userId === currentUserId && (
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded p-1 hover:bg-gray-100">
            <Ellipsis className="text-gray-500" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link
                href={{
                  pathname: '/write',
                  query: { postId },
                }}
                className="block w-full"
              >
                편집
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? '삭제 중...' : '삭제'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
