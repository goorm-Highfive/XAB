import Link from 'next/link'

import { SiteHeader } from '~/components/common/site-header'
import { LoginForm } from '~/components/login/login-form'
import { SocialLogin } from '~/components/login/social-login'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export default function LoginPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-svh w-full items-center justify-center bg-gray-100 p-10 md:p-10">
        <div className="w-full max-w-md">
          <Card className="py-2">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to xAB</CardTitle>
              <CardDescription>
                Don&apos;t have an account?
                <Link
                  href="sign-up"
                  className="ml-1 underline underline-offset-4"
                >
                  Sign up
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="relative py-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  OR
                </span>
              </div>
              <SocialLogin />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
