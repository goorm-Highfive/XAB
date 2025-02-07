'use client'

import { useRouter } from 'next/navigation'
import { WriteForm } from '~/components/write/write-form'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useState, useEffect } from 'react'

export default function WriteModal() {
  const router = useRouter()
  const [postId, setPostId] = useState<string | null>(null)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const postIdParam = urlParams.get('postId')
    if (postIdParam) setPostId(postIdParam)
  }, [])

  const handleClose = () => {
    router.back() // 인터셉트 라우팅을 통해 모달 닫기
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="mx-auto max-h-[85%] max-w-lg overflow-y-scroll rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>
            {postId
              ? 'Edit Post with A/B Testing'
              : 'Create Post with A/B Testing'}
          </DialogTitle>
        </DialogHeader>
        <WriteForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
