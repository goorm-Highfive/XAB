import { SignUpForm } from '~/components/account/sign-up/sign-up-form'
import AccountLayout from '~/components/account/account-layout'
import { SocialLogin } from '~/components/account/social-login'

export default function SignUpPage() {
  return (
    <AccountLayout
      title="Sign up for xAB"
      description="Already have an account?"
      linkText="Login"
      linkHref="/account/login"
    >
      <SignUpForm />
      <div className="relative py-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          OR
        </span>
      </div>
      <SocialLogin />
    </AccountLayout>
  )
}
