'use client'

import { useRouter } from 'next/navigation'

import Write from '#/write/page'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'

export default function WriteModal() {
  const router = useRouter()

  const handleClose = () => {
    router.back()
  }

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="mx-auto max-h-[85%] max-w-lg overflow-y-scroll rounded-lg bg-white p-6 shadow-lg">
        <DialogHeader>
          <DialogTitle>Create Post with A/B Testing</DialogTitle>
        </DialogHeader>
        <Write />
      </DialogContent>
    </Dialog>
  )
}
