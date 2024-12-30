import Link from 'next/link'
import { SignUpForm } from '~/components/sign-up/sign-up-form'

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col items-center gap-2">
            <h1 className="text-3xl font-bold">Sign up for xAB</h1>
            <div className="text-md text-center">
              Already have an account?
              <Link href="login" className="ml-1 underline underline-offset-4">
                Login
              </Link>
            </div>
          </div>
          <SignUpForm />
        </div>
      </div>
    </div>
  )
}
