'use client'

import { WriteForm } from '~/components/write/write-form'
import { useRouter } from 'next/navigation'

export default function WritePage() {
  const router = useRouter()
  const handleClose = () => {
    router.push('/home')
  }

  return <WriteForm onClose={handleClose} />
}
