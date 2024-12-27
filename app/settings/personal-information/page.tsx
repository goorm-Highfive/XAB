'use client'

import { ProfileEditLayout } from '~/components/profile-edit-layout'
import { ProfileInfo } from '~/components/profile-info'
import { Toaster } from '~/components/ui/sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { SiteHeader } from '~/components/common/site-header'

// 타입 정의
type ProfileData = {
  displayname: string
  username: string
  bio: string
}

// 개인정보 페이지
function ProfileInfoPage() {
  const handleSave = (data: ProfileData) => {
    console.log(data)
  }

  return (
    <>
      <SiteHeader />
      <div className="mx-auto h-screen max-w-[736px]">
        <ProfileEditLayout contentTitle={'Profile Settings'}>
          <ProfileInfo onSave={handleSave} />
        </ProfileEditLayout>
        <ProfileEditLayout contentTitle={'Danger Zone'}>
          <Card>
            <CardHeader>
              <CardTitle>Delete Account</CardTitle>
              <CardDescription>
                Once you delete your account, there is no going back. Please be
                certain.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CustomAlertDialog
                alertTitle="Are you sure you want to delete your account?"
                description="This action is permanent and cannot be undone."
                triggerBtnText="Delete Account"
                cancelBtnText="Cancel"
                actionBtnText="Continue"
              />
            </CardContent>
          </Card>
        </ProfileEditLayout>
      </div>
      <Toaster
        toastOptions={{
          duration: 1000, // 알림이 1초 후에 사라짐
          className: 'z-10', // z-index 수정
        }}
      />
    </>
  )
}

export default ProfileInfoPage
