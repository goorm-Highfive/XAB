import Link from 'next/link'

import { SignUpForm } from '~/components/sign-up/sign-up-form'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export default function SignUpPage() {
  return (
    <>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
