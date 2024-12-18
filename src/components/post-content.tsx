'use client'

import { useState } from 'react'
import { PostActionBar } from '~/components/post-action-bar'
import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { Card } from '~/components/ui/card'

// 게시글 뷰페이지 : 게시글 (콘텐츠 + 액션 바)
function PostContent() {
  // 투표 버튼의 보임/숨김 상태를 관리하는 상태 변수
  const [voteBtnBool, setVoteBtnBool] = useState(true)

  // 투표 버튼 클릭시 상태 변화
  const voteBtnOnClick = () => {
    setVoteBtnBool(false)
  }

  // 투표 버튼 클릭시 투표 버튼 사라짐 -> 투표 완료 확인용
  const voteBtnRender = (triggerBtnText: string, option: string) => {
    return (
      voteBtnBool && (
        <CustomAlertDialog
          alertTitle={`Your vote for ${option} has been successfully submitted.`}
          triggerBtnText={triggerBtnText}
          actionBtnText="Confirm"
          onActionClick={() => voteBtnOnClick()}
        />
      )
    )
  }

  return (
    <Card className="p-6">
      <h2 className="pb-4 text-xl font-semibold">
        Which landing page design do you prefer?
      </h2>
      <ul className="grid grid-cols-2 gap-6">
        <li className="rounded-[8px] border p-4">
          <div className="flex h-[192px] items-center justify-center overflow-hidden rounded-[8px] text-center">
            Design Option A
          </div>
          <div className="mt-4 flex h-[40px] items-center justify-between">
            <p className="font-medium">Option A</p>
            <div className="flex items-center">
              <p className="mr-3">64%</p>
              {voteBtnRender('Vote', 'Option A')}
            </div>
          </div>
        </li>
        <li className="rounded-[8px] border p-4">
          <div className="flex h-[192px] items-center justify-center overflow-hidden rounded-[8px] text-center">
            Design Option B
          </div>
          <div className="mt-4 flex h-[40px] items-center justify-between">
            <p className="font-medium">Option B</p>
            <div className="flex items-center">
              <p className="mr-3">36%</p>
              {voteBtnRender('Vote', 'Option B')}
            </div>
          </div>
        </li>
      </ul>
      <PostActionBar />
    </Card>
  )
}

export { PostContent }