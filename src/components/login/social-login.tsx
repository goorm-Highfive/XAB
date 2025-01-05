'use client'

import { Roboto } from 'next/font/google'

import googleIcon from '~/assets/svgs/google-icon.svg'
import kakaoIcon from '~/assets/svgs/kakao-icon.svg'
import { SocialLoginButton } from '~/components/common/social-login-button'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
})

function SocialLogin() {
  return (
    <div className={`my-2 grid gap-4 ${roboto.className}`}>
      <div className="flex flex-col gap-3">
        <SocialLoginButton
          icon={googleIcon}
          iconAlt="google social login"
          iconSize={18}
          bgColor="bg-white"
          border="border"
          label="Continue with Google"
        />

        <SocialLoginButton
          icon={kakaoIcon}
          iconAlt="kakao social login"
          iconSize={18}
          bgColor="bg-social-kakao"
          label="Continue with Kakao"
        />
      </div>
    </div>
  )
}

export { SocialLogin }
