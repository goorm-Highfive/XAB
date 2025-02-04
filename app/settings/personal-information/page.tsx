import { ProfileEditLayout } from '~/components/profile-edit/profile-edit-layout'
import { ProfileInfo } from '~/components/profile-edit/profile-info'
import { ProfileImageUpload } from '~/components/profile-edit/profile-image-upload'
import { CustomAlertDialogWrapper } from '~/components/common/custom-alert-dialog-wrapper'
import { fetchUserProfile } from '~/utils/fetch-user'

async function ProfileInfoPage() {
  const user = await fetchUserProfile()

  return (
    <div className="mx-auto max-w-xl">
      <ProfileEditLayout contentTitle="Profile Settings">
        <ProfileImageUpload user={user} />
        <ProfileInfo user={user} />
      </ProfileEditLayout>
      <ProfileEditLayout contentTitle="Danger Zone">
        <h3>Delete Account</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <CustomAlertDialogWrapper />
      </ProfileEditLayout>
    </div>
  )
}

export default ProfileInfoPage
