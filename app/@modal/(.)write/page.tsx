'use client'

import { useRouter } from 'next/navigation'
import Write from '#/write/page' // Write 컴포넌트
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
    router.back()
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
        {/* onClose prop 전달 */}
        <Write onClose={handleClose} />
      </DialogContent>
    </Dialog>
  )
}
