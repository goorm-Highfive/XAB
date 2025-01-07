import Image from 'next/image'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Send } from 'lucide-react'

// 게시글 뷰페이지 : 댓글 입력
function PostCommentInput() {
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
        />
        <Button
          variant="ghost"
          className="z-1 absolute right-2 top-1 w-[30px] hover:bg-transparent"
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}

export { PostCommentInput }
