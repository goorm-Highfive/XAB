'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '~/utils/supabase/client'
import { fetchUserProfile } from '~/utils/fetch-user'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'

interface ProfileInfoProps {
  user: Awaited<ReturnType<typeof fetchUserProfile>>
}

function ProfileInfo({ user }: ProfileInfoProps) {
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async () => {
    if (!formData.username.trim()) {
      toast.error('username은 필수 입력 항목입니다.')
      return
    }

    try {
      const { error } = await supabase
        .from('users')
        .update({ username: formData.username.trim(), bio: formData.bio })
        .eq('id', user!.id)

      if (error) throw new Error('프로필 업데이트 실패')

      toast.success('프로필 정보가 성공적으로 업데이트되었습니다!')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <>
      <div className="mb-4">
        <Label className="mb-2 block">username</Label>
        <Input
          name="username"
          value={formData.username}
          onChange={handleChange}
        />
      </div>
      <div className="mb-4">
        <Label className="mb-2 block">bio</Label>
        <Textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          className="max-h-40"
        />
      </div>
      <Button onClick={handleSave} className="mt-4 w-full">
        저장
      </Button>
    </>
  )
}

export { ProfileInfo }
