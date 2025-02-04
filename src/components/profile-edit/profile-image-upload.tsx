'use client'

import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState, useRef } from 'react'
import { createClient } from '~/utils/supabase/client'
import { Button } from '~/components/ui/button'
import { fetchUserProfile } from '~/utils/fetch-user'
import defaultProfile from '~/assets/svgs/default-profile.svg'

interface ProfileInfoProps {
  user: Awaited<ReturnType<typeof fetchUserProfile>>
}

function ProfileImageUpload({ user }: ProfileInfoProps) {
  const router = useRouter()
  const supabase = createClient()

  const [avatarUrl, setAvatarUrl] = useState(user?.profile_image || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

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
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
      console.error('Upload error:', error)
    }
  }

  const handleSetDefaultImage = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_image: null })
        .eq('id', user!.id)

      if (error) throw new Error('프로필 기본 이미지로 변경 실패')

      setAvatarUrl(null)
      toast.success('기본 이미지로 성공적으로 변경되었습니다!')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  return (
    <div className="mb-6 flex flex-col">
      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full">
        <Image
          fill
          className="object-cover"
          src={avatarUrl || defaultProfile}
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
          alt=""
        />
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
    </div>
  )
}

export { ProfileImageUpload }
