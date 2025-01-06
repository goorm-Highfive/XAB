import Link from 'next/link'

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
    <div className="flex min-h-svh items-center justify-center">
      <Card className="w-full max-w-md py-2">
        <CardHeader>
          <CardTitle className="text-2xl">Welcome to xAB</CardTitle>
          <CardDescription>
            Don&apos;t have an account?
            <Link href="sign-up" className="ml-1 underline underline-offset-4">
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
  )
}
