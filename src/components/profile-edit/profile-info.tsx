'use client'

import Image from 'next/image'
import defaultProfileImg from '~/assets/svg/default-profile.svg'
import { Card, CardContent, CardHeader } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

// 타입 정의
type ProfileData = {
  displayname: string
  username: string
  bio: string
}

// 개인정보 페이지 : 사용자 정보 변경 부분
function ProfileInfo({ onSave }: { onSave: (data: ProfileData) => void }) {
  const { register, handleSubmit } = useForm<ProfileData>()

  const onSubmit = (data: ProfileData) => {
    onSave(data)
    // Sonner toast 팝업 띄우기
    toast.success('Profile updated successfully!')
  }

  const handleSaveBtnClick = () => {
    const form = document.querySelector('form')
    if (form) form.requestSubmit() // form 제출
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="mr-4 h-20 w-20 overflow-hidden rounded-full">
          <Image src={defaultProfileImg} alt="Profile Image" />
        </div>
        <Button variant="outline">Change Photo</Button>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <ul className="grid gap-4">
            <li className="space-y-1.5">
              <Label htmlFor="displayname">Display Name</Label>
              <Input {...register('displayname')} id="displayname" />
            </li>
            <li className="space-y-1.5">
              <Label htmlFor="username">Username</Label>
              <Input {...register('username')} id="username" />
            </li>
            <li className="space-y-1.5">
              <Label htmlFor="bio">Bio</Label>
              <Textarea {...register('bio')} id="bio" className="min-h-24" />
            </li>
          </ul>
          {/* Save Changes 버튼 */}
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              variant="default"
              className="bg-black text-white hover:bg-gray-800"
              onClick={handleSaveBtnClick}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export { ProfileInfo }
