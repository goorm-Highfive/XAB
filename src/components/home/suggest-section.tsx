'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

import defaultProfile from '~/assets/svgs/default-profile.svg'
import Link from 'next/link'
import { SuggestSkeleton } from './suggest-section-skeleton'

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
      setLoadingIds((prev) => new Set(prev).add(userId))
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

      setSuggestedUsers((prev) => prev.filter((user) => user.id !== userId))
    } catch (err: unknown) {
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
      setLoadingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(userId)
        return newSet
      })
    }
  }

  if (error) {
    return <p className="text-red-500">오류: {error}</p>
  }

  return (
    <>
      {loading ? (
        <SuggestSkeleton />
      ) : (
        <div className="sticky top-[92px] hidden w-72 flex-col gap-4 xl:flex">
          <Card>
            <CardHeader>
              <CardTitle>추천 사용자</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {suggestedUsers.map((item) => (
                  <li key={item.id} className="flex items-center gap-3">
                    <Link
                      href={`/profile/${item.id}`}
                      className="flex justify-between gap-4"
                    >
                      <div className="relative h-10 w-10 overflow-hidden rounded-full">
                        {item.profile_image ? (
                          <Image
                            fill
                            className="object-cover"
                            src={item.profile_image}
                            alt={item.username}
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                            priority
                          />
                        ) : (
                          <Image
                            fill
                            className="object-cover"
                            src={defaultProfile}
                            alt={item.username}
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                            priority
                          />
                        )}
                      </div>
                      {/* User Info */}
                      <div className="flex flex-1 flex-col">
                        <span className="font-bold">{item.username}</span>
                        <span className="text-sm text-muted-foreground">
                          {item.bio || '소개글이 없습니다.'}
                        </span>
                      </div>
                    </Link>
                    {/* Follow Button */}
                    <div className="ml-auto flex flex-col items-end">
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
      )}
    </>
  )
}

export { SuggestSection }
