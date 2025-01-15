'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'

type SuggestedUser = {
  id: string
  profile_image: string | null
  username: string
  bio: string | null
}

function SuggestSection() {
  const [suggestedUsers, setSuggestedUsers] = useState<SuggestedUser[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  const [errorIds, setErrorIds] = useState<Map<string, string>>(new Map())

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/get-suggested-user')
        if (!response.ok) {
          throw new Error('추천 사용자 가져오기에 실패했습니다.')
        }
        const data = await response.json()
        setSuggestedUsers(data.data || [])
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSuggestedUsers()
  }, [])

  const handleFollow = async (userId: string) => {
    try {
      // 로딩 상태 추가
      setLoadingIds((prev) => new Set(prev).add(userId))
      // 오류 상태 초기화
      setErrorIds((prev) => {
        const newMap = new Map(prev)
        newMap.delete(userId)
        return newMap
      })

      const response = await fetch(`/api/follow/${userId}`, {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '팔로우 요청에 실패했습니다.')
      }

      // 성공 시 사용자 목록에서 제거
      setSuggestedUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err: unknown) {
      // 오류 상태 업데이트
      setErrorIds((prev) => {
        const newMap = new Map(prev)
        newMap.set(
          userId,
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.',
        )
        return newMap
      })
    } finally {
      // 로딩 상태 제거
      setLoadingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (loading) {
    return <p>추천 사용자 불러오는 중...</p>
  }

  if (error) {
    return <p className="text-red-500">오류: {error}</p>
  }

  return (
    <div className="sticky top-[92px] hidden w-72 flex-col gap-4 xl:flex">
      <Card>
        <CardHeader>
          <CardTitle>추천 사용자</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {suggestedUsers.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                {/* Avatar */}
                <Avatar>
                  <AvatarImage
                    src={item.profile_image || '/default-avatar.png'}
                    alt={item.username}
                  />
                  <AvatarFallback>
                    {item.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* User Info */}
                <div className="flex flex-1 flex-col">
                  <span className="font-bold">{item.username}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.bio || '소개글이 없습니다.'}
                  </span>
                </div>

                {/* Follow Button */}
                <div className="flex flex-col items-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleFollow(item.id)}
                    disabled={loadingIds.has(item.id)}
                  >
                    {loadingIds.has(item.id) ? '팔로우 중...' : '팔로우'}
                  </Button>
                  {errorIds.has(item.id) && (
                    <span className="mt-1 text-xs text-red-500">
                      {errorIds.get(item.id)}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export { SuggestSection }
