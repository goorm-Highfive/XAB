import Link from 'next/link'

import { SiteHeader } from '~/components/common/site-header'
import { SignUpForm } from '~/components/sign-up/sign-up-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { SocialLogin } from '~/components/login/social-login'

export default function SignUpPage() {
  return (
    <>
      <SiteHeader />
      <div className="flex min-h-svh w-full items-center justify-center bg-gray-100 p-6 md:p-10">
        <div className="w-full max-w-md">
          <Card className="py-2">
            <CardHeader>
              <CardTitle className="text-2xl">Sign up for xAB</CardTitle>
              <CardDescription>
                Already have an account?
                <Link
                  href="login"
                  className="ml-1 underline underline-offset-4"
                >
                  Login
                </Link>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SignUpForm />
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
