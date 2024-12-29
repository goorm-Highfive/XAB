import Link from 'next/link'
import Image from 'next/image'
import { Roboto } from 'next/font/google'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

import googleIcon from '~/assets/svgs/google-icon.svg'
import kakaoIcon from '~/assets/svgs/kakao-icon.svg'
import naverIcon from '~/assets/svgs/naver-icon.svg'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
})

function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <form>
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
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t">
            <span className="relative z-10 bg-background px-2 text-muted-foreground">
              OR
            </span>
          </div>
          <div className={`grid gap-4 ${roboto.className}`}>
            <div className="flex flex-col gap-3">
              <button className="flex w-full items-center gap-2 rounded border bg-white py-3 pl-4 text-sm font-medium">
                <Image
                  src={googleIcon}
                  alt="googleIcon"
                  width={18}
                  className="shrink-0"
                />
                <span className="flex-grow text-center">
                  Continue with Google
                </span>
              </button>
              <button className="flex w-full items-center gap-2 rounded bg-social-kakao py-3 pl-4 text-sm font-medium">
                <Image
                  src={kakaoIcon}
                  alt="kakaoIcon"
                  width={18}
                  className="shrink-0"
                />
                <span className="flex-grow text-center">
                  Continue with Kakao
                </span>
              </button>
              <button className="flex w-full items-center gap-2 rounded bg-social-naver py-3 pl-4 text-sm font-medium text-white">
                <Image
                  src={naverIcon}
                  alt="naverIcon"
                  width={14}
                  className="shrink-0"
                />
                <span className="flex-grow text-center">
                  Continue with Naver
                </span>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export { LoginForm }
