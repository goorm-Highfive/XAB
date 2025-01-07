import Image from 'next/image'
import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Heart } from 'lucide-react'

// 게시글 뷰페이지 : 댓글 개별 요소
function PostComment() {
  return (
    <div className="mb-6 flex">
      <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
        <Image src={defaultProfile} alt="" />
      </div>
      <div className="flex-auto">
        <div className="rounded-lg bg-primary-foreground p-3">
          <b>댓글 작성자</b>
          <p>내용</p>
        </div>
        <div className="mt-2 flex text-sm text-muted-foreground">
          <button
            type="button"
            className="mr-4 flex items-center justify-start"
          >
            <Heart size={14} className="mr-1 text-muted-foreground" />
            24
          </button>
          <button type="button" className="mr-4">
            Reply
          </button>
          <span>2h ago</span>
        </div>
      </div>
    </div>
  )
}

export { PostComment }
