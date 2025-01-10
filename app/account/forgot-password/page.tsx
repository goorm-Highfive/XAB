import AccountLayout from '~/components/account/account-layout'
import { ForgotPasswordForm } from '~/components/account/forgot-password/forgot-password-form'

export default function ForgotPassword() {
  return (
    <AccountLayout
      title="Forgot Password"
      description="Enter your email below to reset your password"
    >
      <ForgotPasswordForm />
    </AccountLayout>
  )
}
