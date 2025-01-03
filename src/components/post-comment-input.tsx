'use client'

import { useState, useEffect } from 'react'

import Image from 'next/image'
import defaultProfile from '~/assets/svg/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Send } from 'lucide-react'

// 게시글 뷰페이지 : 댓글 입력
function PostCommentInput({
  onCommentSubmit,
}: {
  onCommentSubmit: (comment: string) => void
}) {
  const [inputValue, setInputValue] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false) // 중복 제출 방지 상태

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = () => {
    if (inputValue.trim() && !isSubmitting) {
      setIsSubmitting(true) // 제출 중으로 설정
      onCommentSubmit(inputValue) // 댓글 추가
      setInputValue('') // 입력 필드를 즉시 초기화
    }
  }

  useEffect(() => {
    if (isSubmitting) {
      // 제출 후, 500ms 후에 isSubmitting 상태를 초기화
      const timeout = setTimeout(() => setIsSubmitting(false), 500)
      return () => clearTimeout(timeout) // 타이머를 정리합니다.
    }
  }, [isSubmitting])

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault() // 줄 바꿈 방지
      handleSubmit() // 엔터 키 입력 시 댓글 제출
      setInputValue('')
    }
  }

  return (
    <div className="mt-[25px] flex border-t pt-[25px]">
      <div className="mr-3 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="" />
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
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

export { PostCommentInput }
