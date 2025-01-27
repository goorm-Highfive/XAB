// components/common/survey-card/useProfileImage.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '~/utils/supabase/client'

export function useProfileImage(postId: number) {
  const [userProfileImage, setUserProfileImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const { data } = await createClient()
          .from('posts')
          .select(
            `
              user_id,
              users (
                profile_image
              )
            `,
          )
          .eq('id', postId)
          .single()

        if (data?.users?.profile_image) {
          setUserProfileImage(data.users.profile_image)
        }
      } catch (error) {
        console.error('Failed to fetch profile image:', error)
      }
    }

    fetchProfileImage()
  }, [postId])

  return userProfileImage
}
