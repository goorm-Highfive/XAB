'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { createClient } from '~/utils/supabase/client'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { fetchUserProfile } from '~/utils/fetch-user'
import imageCompression from 'browser-image-compression'

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

      if (error) throw new Error('프로필 업데이트 실패')

      setAvatarUrl(imageUrl || defaultProfile)
      toast.success('프로필 사진이 업데이트되었습니다.')
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) toast.error(error.message)
    }
  }

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setIsUploading(true)

    // 기존 파일을 다시 선택할 때 이벤트가 동작하도록 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    // 미리보기 기능
    if (typeof window !== 'undefined') {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        if (e.target?.result) {
          setAvatarUrl(e.target.result as string)
        }
      }
      fileReader.readAsDataURL(file)
    }

    try {
      const options = {
        maxSizeMB: 0.4,
        maxWidthOrHeight: 720,
        useWebWorker: true,
        fileType: 'image/webp',
      }

      const compressedFile = await imageCompression(file, options)

      const filePath = `${user.id}/profile-image.webp`

      await supabase.storage.from('user_images').remove([filePath])

      const { error: uploadError } = await supabase.storage
        .from('user_images')
        .upload(filePath, compressedFile, { upsert: true })

      if (uploadError) throw new Error('이미지 업로드 실패')

      const { data: publicUrlData } = supabase.storage
        .from('user_images')
        .getPublicUrl(filePath)

      if (!publicUrlData?.publicUrl) throw new Error('이미지 URL 생성 실패')

      const newImageUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

      await updateProfileImage(newImageUrl)
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
    if (avatarUrl === defaultProfile) return
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
