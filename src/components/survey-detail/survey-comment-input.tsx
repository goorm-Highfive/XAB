'use client'

import { useState } from 'react'
import Image from 'next/image'
import defaultProfile from '~/assets/svg/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Send } from 'lucide-react'

// 게시글 뷰페이지 : 댓글 입력
function SurveyCommentInput({
  onCommentSubmit,
}: {
  onCommentSubmit: (comment: string) => void
}) {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !isSubmitting) {
      setIsSubmitting(true) // 제출 중으로 설정
      onCommentSubmit(inputValue) // 댓글 추가

      // 중복 제출 방지 타이머 설정
      setTimeout(() => {
        setInputValue('')
        setIsSubmitting(false) // 중복 제출 방지 해제
      }, 500)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="mt-[25px] flex border-t pt-[25px]">
      <div className="mr-3 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="default profile" />
      </div>
      <div className="relative flex-auto">
        <Input
          type="text"
          className="h-[40px] rounded-[30px] border-0 bg-primary-foreground pr-[40px]"
          placeholder="Add a comment..."
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        <Button
          variant="ghost"
          className="z-1 absolute right-2 top-1 w-[30px] hover:bg-transparent"
          onClick={handleSubmit}
          disabled={isSubmitting} // 중복 제출 방지
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

export { SurveyCommentInput }
