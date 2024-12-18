'use client'

import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

// 이전 페이지로 가는 버튼이 포함된 헤더 컴포넌트
function HeaderPrevType({ pageTitle }: { pageTitle: string }) {
  // Save Changes 버튼 클릭시 알림 표시
  const showToastMessage = () => toast.success('Changes saved successfully!')

  return (
    <header className="border-b px-4">
      <div className="mx-auto flex h-[65px] max-w-screen-xl flex-row items-center justify-between">
        <div className="left">
          <Link href="/" className="flex flex-row items-center">
            <ArrowLeft size={18} className="mr-4" />
            <b className="text-xl">{pageTitle}</b>
          </Link>
        </div>
        <div className="right">
          <Button onClick={showToastMessage}>Save Changes</Button>
        </div>
      </div>
    </header>
  )
}

export { HeaderPrevType }
