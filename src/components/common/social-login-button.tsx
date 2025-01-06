'use client'

import Image from 'next/image'
import { createClient } from '~/utils/supabase/client'

type SocialLoginButtonProps = {
  social: 'google' | 'kakao'
  icon: string
  iconAlt: string
  iconSize: number
  bgColor: string
  textColor?: string
  border?: string
  label: string
}
const supabase = createClient()

const handleSocialLogin = async (social: 'google' | 'kakao') => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: social,
    options: {
      redirectTo: window.origin + '/auth/callback',
    },
  })

  if (error) {
    console.error(`${social} 로그인 실패`, error.message)
    return { success: false }
  }

  console.log(data)
  alert(`${social} 계정으로 로그인이 완료 되었습니다.`)
}

function SocialLoginButton({
  social,
  icon,
  iconSize,
  iconAlt,
  bgColor,
  textColor,
  label,
  border,
}: SocialLoginButtonProps) {
  return (
    <button
      className={`flex w-full items-center gap-2 rounded py-3 pl-4 text-sm font-medium ${bgColor} ${textColor} ${border}`}
      onClick={() => handleSocialLogin(social)}
    >
      <Image src={icon} alt={iconAlt} width={iconSize} className="shrink-0" />
      <span className="flex-grow text-center">{label}</span>
    </button>
  )
}

export { SocialLoginButton }
