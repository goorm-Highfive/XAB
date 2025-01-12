import { redirect } from 'next/navigation'
import { ProfileEditLayout } from '~/components/profile-edit/profile-edit-layout'
import { ProfileInfo } from '~/components/profile-edit/profile-info'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { fetchUserProfile } from '~/utils/fetch-user'
import { CustomAlertDialogWrapper } from '~/components/common/custom-alert-dialog-wrapper' // 클라이언트 컴포넌트 가져오기

async function ProfileInfoPage() {
  const profileData = await fetchUserProfile()

  if (!profileData) {
    redirect('/account/login')
    return null // 리디렉션 후 렌더링 방지
  }

  return (
    <div className="mx-auto max-w-xl">
      <ProfileEditLayout contentTitle="Profile Settings">
        <ProfileInfo
          defaultValues={{
            username: profileData.username ?? '',
            bio: profileData.bio ?? '',
          }}
        />
      </ProfileEditLayout>
      <ProfileEditLayout contentTitle="Danger Zone">
        <Card>
          <CardHeader>
            <CardTitle>Delete Account</CardTitle>
            <CardDescription>
              Once you delete your account, there is no going back. Please be
              certain.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CustomAlertDialogWrapper />
          </CardContent>
        </Card>
      </ProfileEditLayout>
    </div>
  )
}

export default ProfileInfoPage
