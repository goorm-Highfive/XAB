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
import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'
import { fetchUserProfile } from '~/utils/supabase/fetch-user'

async function ProfileInfoPage() {
  const fields = ['username', 'bio']
  const userData = await fetchUserProfile(fields)

  if (!userData) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-xl">
      <ProfileEditLayout contentTitle="Profile Settings">
        <ProfileInfo
          defaultValues={{
            username: userData.username ?? '',
            bio: userData.bio ?? '',
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
  )
}

export default ProfileInfoPage
