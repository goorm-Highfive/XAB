'use client'

import { toast, Toaster } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

type ProfileData = {
  username: string
  bio: string
}

function ProfileInfo({ defaultValues }: { defaultValues: ProfileData }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ProfileData>(
    defaultValues || { username: '', bio: '' },
  )
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/user-edit/edit-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          bio: formData.bio || '',
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || '알 수 없는 오류가 발생했습니다.')
      }

      const result = await response.json()
      toast.success(result.message || '변경 사항이 저장되었습니다.')
      router.refresh()
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || '예기치 못한 오류가 발생했습니다.')
      } else {
        toast.error('알 수 없는 오류가 발생했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center">
          <Avatar className="mr-4 h-16 w-16">
            <AvatarImage alt={formData.username || 'User'} />
            <AvatarFallback>
              {formData.username ? formData.username[0].toUpperCase() : 'G'}
            </AvatarFallback>
          </Avatar>
          <Button variant="outline">Change Photo</Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username" className="mb-2 block">
                Username
              </Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="bio" className="mb-2 block">
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                className="h-[120px] max-h-[200px]"
                onChange={handleChange}
              />
            </div>
            <Button
              type="submit"
              className="bg-black text-white hover:bg-gray-800"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}

export { ProfileInfo }
