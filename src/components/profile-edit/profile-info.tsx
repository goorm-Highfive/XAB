'use client'

import { useRef, useState } from 'react'
import { toast, Toaster } from 'sonner'
import { createClient } from '~/utils/supabase/client'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Label } from '../ui/label'
import { fetchUserProfile } from '~/utils/fetch-user'

interface ProfileInfoProps {
  user: Awaited<ReturnType<typeof fetchUserProfile>>
}

function ProfileInfo({ user }: ProfileInfoProps) {
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImage || null)
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  console.log('fetchUserProfile result:', user)
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const fileName = `${user!.id}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user_images')
        .upload(fileName, file)

      if (uploadError) throw new Error('이미지 업로드 실패')

      const { data: publicUrlData } = supabase.storage
        .from('user_images')
        .getPublicUrl(uploadData.path)

      if (!publicUrlData || !publicUrlData.publicUrl)
        throw new Error('이미지 URL 생성 실패')

      const imageUrl = publicUrlData.publicUrl

      const { error: updateError } = await supabase
        .from('users')
        .update({ profile_image: imageUrl })
        .eq('id', user!.id)

      if (updateError) throw new Error('프로필 업데이트 실패')

      setAvatarUrl(imageUrl)
      toast.success('프로필 사진이 성공적으로 업데이트되었습니다!')
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ username, bio })
        .eq('id', user!.id)

      if (error) throw new Error('프로필 업데이트 실패')

      toast.success('프로필 정보가 성공적으로 업데이트되었습니다!')
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <>
      <Card>
        <CardHeader className="flex">
          <Avatar className="mb-4 h-20 w-20">
            <AvatarImage
              width={150}
              height={150}
              src={avatarUrl || '/assets/svgs/default-profile.svg'}
              alt="프로필 사진"
            />
          </Avatar>
          <div>
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => fileInputRef.current?.click()}
            >
              프로필 이미지 변경
            </Button>
            <Button variant="outline" onClick={() => setAvatarUrl(null)}>
              기본 이미지로 변경
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Label className="mb-2 block">username</Label>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Label className="mb-2 mt-6 block">bio</Label>
          <Textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="max-h-40"
          />
          <Button onClick={handleSave} className="mt-4 w-full">
            저장
          </Button>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}

export { ProfileInfo }
