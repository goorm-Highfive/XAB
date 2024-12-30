'use client'

import Image from 'next/image'
import { Roboto } from 'next/font/google'

import googleIcon from '~/assets/svgs/google-icon.svg'
import kakaoIcon from '~/assets/svgs/kakao-icon.svg'
import naverIcon from '~/assets/svgs/naver-icon.svg'

const roboto = Roboto({
  subsets: ['latin'],
  weight: '500',
})

function SocialLogin() {
  return (
    <div className={`grid gap-4 ${roboto.className}`}>
      <div className="flex flex-col gap-3">
        <button className="flex w-full items-center gap-2 rounded border bg-white py-3 pl-4 text-sm font-medium">
          <Image
            src={googleIcon}
            alt="googleIcon"
            width={18}
            className="shrink-0"
          />
          <span className="flex-grow text-center">Continue with Google</span>
        </button>
        <button className="flex w-full items-center gap-2 rounded bg-social-kakao py-3 pl-4 text-sm font-medium">
          <Image
            src={kakaoIcon}
            alt="kakaoIcon"
            width={18}
            className="shrink-0"
          />
          <span className="flex-grow text-center">Continue with Kakao</span>
        </button>
        <button className="flex w-full items-center gap-2 rounded bg-social-naver py-3 pl-4 text-sm font-medium text-white">
          <Image
            src={naverIcon}
            alt="naverIcon"
            width={14}
            className="shrink-0"
          />
          <span className="flex-grow text-center">Continue with Naver</span>
        </button>
      </div>
    </div>
  )
}

export { SocialLogin }
