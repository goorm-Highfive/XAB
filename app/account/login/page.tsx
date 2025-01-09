import { LoginForm } from '~/components/account/login/login-form'
import { SocialLogin } from '~/components/account/social-login'
import AccountLayout from '~/components/account/account-layout'

export default function LoginPage() {
  return (
    <AccountLayout
      title="Welcome to xAB"
      description="Don't have an account?"
      linkText="Sign up"
      linkHref="/account/sign-up"
    >
      <LoginForm />
      <div className="relative py-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          OR
        </span>
      </div>
      <SocialLogin />
    </AccountLayout>
  )
}
