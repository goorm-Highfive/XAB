import Link from 'next/link'

import { LoginForm } from '~/components/login/login-form'
import { SocialLogin } from '~/components/login/social-login'

export default function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold">Welcome to xAB</h1>
            <div className="text-md text-center">
              Don&apos;t have an account?
              <Link
                href="sign-up"
                className="ml-1 underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
          <LoginForm />
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              OR
            </span>
          </div>
          <SocialLogin />
        </div>
      </div>
    </div>
  )
}
