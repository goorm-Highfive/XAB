'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '~/utils/supabase/client'
import { cleanFilename } from '~/utils/clean-filename'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { fetchUserProfile } from '~/utils/fetch-user'

interface ProfileInfoProps {
  user?: Awaited<ReturnType<typeof fetchUserProfile>> | null
}

export function useProfileImage({ user }: ProfileInfoProps) {
  const router = useRouter()
  const supabase = createClient()

  const [avatarUrl, setAvatarUrl] = useState<string>(
    user?.profile_image || defaultProfile,
  )
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const updateProfileImage = async (imageUrl: string | null) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ profile_image: imageUrl })
        .eq('id', user.id)

      if (error)
        throw new Error(
          imageUrl ? '프로필 업데이트 실패' : '기본 이미지로 변경 실패',
        )

      setAvatarUrl(imageUrl || defaultProfile)
      toast.success(
        imageUrl
          ? '프로필 사진이 업데이트되었습니다.'
          : '기본 이미지로 변경되었습니다.',
      )
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)

    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      if (e.target?.result) {
        setAvatarUrl(e.target.result as string)
      }
    }
    fileReader.readAsDataURL(file)

    try {
      const filePath = `${user.id}/${Date.now()}-${cleanFilename(file.name)}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user_images')
        .upload(filePath, file)

      if (uploadError) throw new Error('이미지 업로드 실패')

      const { data: publicUrlData } = supabase.storage
        .from('user_images')
        .getPublicUrl(uploadData.path)

      if (!publicUrlData?.publicUrl) throw new Error('이미지 URL 생성 실패')

      await updateProfileImage(publicUrlData.publicUrl)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
        setAvatarUrl(user.profile_image || defaultProfile)
      }
    } finally {
      setIsUploading(false)
    }
  }

  const handleSetDefaultImage = () => {
    updateProfileImage(null)
  }

  return {
    avatarUrl,
    fileInputRef,
    isUploading,
    handleUpload,
    handleSetDefaultImage,
  }
}
