'use client'

import { useState, useEffect, useRef, ChangeEvent } from 'react'
import { Input } from '~/components/ui/input'
import { Card, CardContent } from '~/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { SkeletonLoading } from './site-header-search-bar-skeleton'
// User 타입 정의
type User = {
  id: string
  username: string
  profile_image: string | null
}

// // 딜레이 함수 정의
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('') // 검색어 상태
  const [results, setResults] = useState<User[]>([]) // 검색 결과 상태
  const [loading, setLoading] = useState<boolean>(false) // 로딩 상태
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false) // 드롭다운 상태
  const dropdownRef = useRef<HTMLDivElement | null>(null) // 드롭다운 참조

  // 검색 결과 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!searchTerm.trim()) {
        setResults([]) // 검색어 없을 경우 초기화
        setIsDropdownOpen(false) // 드롭다운 닫기
        return
      }

      setLoading(true)

      try {
        // await delay(5000) // 2초 지연 추가

        const res = await fetch(
          `/api/search-users?q=${encodeURIComponent(searchTerm)}`,
        )
        if (!res.ok) throw new Error('Failed to fetch users')

        const data: User[] = await res.json() // API 반환값의 타입 명시
        setResults(data)
        setIsDropdownOpen(true) // 드롭다운 열기
      } catch (error) {
        console.error('Error fetching data:', (error as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [searchTerm]) // searchTerm 의존성

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false) // 드롭다운 닫기
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="relative w-full max-w-lg">
      {/* 검색 Input */}
      <Input
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleInputChange}
        className="border"
      />
      {loading ? (
        <SkeletonLoading />
      ) : (
        isDropdownOpen &&
        results.length > 0 && (
          <div
            ref={dropdownRef}
            className="absolute z-10 mt-2 w-full items-center"
          >
            <Card>
              <CardContent>
                <ul>
                  {results.map((user) => (
                    <Link key={user.id} href={`/profile/${user.id}`}>
                      <li
                        key={user.id}
                        className="flex cursor-pointer items-center gap-4 p-2 hover:bg-gray-100"
                      >
                        <div className="relative h-8 w-8 overflow-hidden rounded-full">
                          <Image
                            fill
                            priority
                            src={user.profile_image || defaultProfile.src} // 기본 프로필 이미지 경로
                            alt={`${user.username}'s profile`}
                            sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                        <span>{user.username}</span>
                      </li>
                    </Link>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )
      )}
      {/* 검색 결과 표시 */}
    </div>
  )
}

export { SearchBar }
