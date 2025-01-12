'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '~/types/user'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog' // Shadcn Dialog
import { SearchBar } from '~/components/profile/profile-search-bar'
import { UserFollowList } from '~/components/profile/profile-user-follow-list'

// API 응답 데이터 타입 정의
interface UserListResponseItem {
  id: number
  name: string
  username?: string
  isFollowing?: boolean
  image?: string
}

// UserListModalProps 타입 정의
interface UserListModalProps {
  title: string
  apiEndpoint: string
}

function LoadingIndicator() {
  return <p className="text-center">Loading...</p>
}

function ErrorIndicator({ message }: { message: string }) {
  return <p className="text-center text-red-500">{message}</p>
}

function UserListModal({ title, apiEndpoint }: UserListModalProps) {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint)
        if (!response.ok) throw new Error('Failed to fetch data')

        // API 응답 데이터 타입 명시
        const data: UserListResponseItem[] = await response.json()

        // User 타입으로 변환
        const formattedData: User[] = data.map((item) => ({
          id: item.id,
          name: item.name,
          username: item.username || 'Unknown',
          isFollowing: item.isFollowing || false,
          image: item.image || undefined,
        }))

        setUsers(formattedData)
        setFilteredUsers(formattedData)
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message)
        } else {
          setError('Unknown error occurred.')
        }
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiEndpoint])

  const handleSearch = (query: string) => {
    setFilteredUsers(
      users.filter((user: User) =>
        user.name.toLowerCase().includes(query.toLowerCase()),
      ),
    )
  }

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="mx-auto mt-20 max-w-lg rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <LoadingIndicator />
        ) : error ? (
          <ErrorIndicator message={error} />
        ) : (
          <>
            <SearchBar onSearch={handleSearch} />
            <div className="mt-4 space-y-4">
              <UserFollowList users={filteredUsers} />
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export { UserListModal }
