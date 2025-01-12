'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { SearchBar } from '~/components/profile/profile-search-bar'
import { UserFollowList } from '~/components/profile/profile-user-follow-list'

interface UserListResponseItem {
  id: string
  name: string
  username?: string
  isFollowing?: boolean
  image?: string
}

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
  const [users, setUsers] = useState<UserListResponseItem[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserListResponseItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(apiEndpoint)
        if (!response.ok) throw new Error('Failed to fetch data')

        const data: UserListResponseItem[] = await response.json()
        setUsers(data)
        setFilteredUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error occurred.')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [apiEndpoint])

  const handleSearch = (query: string) => {
    setFilteredUsers(
      users.filter((user) =>
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
