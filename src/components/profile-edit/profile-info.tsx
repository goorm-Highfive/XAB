'use client'

import Image from 'next/image'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { createClient } from '~/utils/supabase/client'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { fetchUserProfile } from '~/utils/fetch-user'
import defaultProfile from '~/assets/svgs/default-profile.svg'

interface ProfileInfoProps {
  user: Awaited<ReturnType<typeof fetchUserProfile>>
}

function ProfileInfo({ user }: ProfileInfoProps) {
  const [avatarUrl, setAvatarUrl] = useState(user?.profileImage || null)
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState(user?.bio || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supabase = createClient()
  //console.log('fetchUserProfile result:', user)
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      // 파일 이름 안전하게 처리
      const sanitizeFileName = (fileName: string): string =>
        fileName.replace(/[^a-zA-Z0-9_.-]/g, '_').replace(/\s+/g, '_')

      const safeFileName = sanitizeFileName(file.name)
      const fileName = `${user!.id}/${Date.now()}-${safeFileName}`

      // 파일 업로드
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
      console.error('Upload error:', error)
    }
  }

  const handleSetDefaultImage = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_image: null }) // 프로필 이미지를 null로 업데이트
        .eq('id', user!.id)

      if (error) throw new Error('프로필 기본 이미지로 변경 실패')

      setAvatarUrl(null) // UI 상태 업데이트
      toast.success('기본 이미지로 성공적으로 변경되었습니다!')
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
          <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full">
            {avatarUrl ? (
              <Image
                fill
                className="object-cover"
                src={avatarUrl}
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                alt=""
              />
            ) : (
              <Image
                fill
                className="object-cover"
                src={defaultProfile}
                sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                alt=""
              />
            )}
          </div>
          <div>
            <Button
              variant="outline"
              className="mr-4"
              onClick={() => fileInputRef.current?.click()}
            >
              프로필 이미지 변경
            </Button>
            <Button variant="outline" onClick={handleSetDefaultImage}>
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
    </>
  )
}

export { ProfileInfo }
