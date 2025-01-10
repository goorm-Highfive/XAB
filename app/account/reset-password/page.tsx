import AccountLayout from '~/components/account/account-layout'
import { ResetPasswordForm } from '~/components/account/reset-password/reset-password-form'

export default function ForgotPassword() {
  return (
    <AccountLayout
      title="Reset Your Password"
      description="Please create a new password for your account"
    >
      <ResetPasswordForm />
    </AccountLayout>
  )
}
