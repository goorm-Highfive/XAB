'use client'

import { Provider } from '@supabase/supabase-js'
import Image from 'next/image'
import { toast } from 'sonner'

import { createClient } from '~/utils/supabase/client'
import { Toaster } from '~/components/ui/sonner'

type SocialLoginButtonProps = {
  provider: Provider
  icon: string
  iconAlt: string
  iconSize: number
  bgColor: string
  textColor?: string
  border?: string
  label: string
}

const supabase = createClient()

const handleSocialLogin = async (provider: Provider) => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    toast.error(`${provider} Login Failed`, {
      description: `${error.message}`,
    })
  }

  if (data) {
    toast.success(`${provider} Login Success`)
  }
}

function SocialLoginButton({
  provider,
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
      onClick={() => handleSocialLogin(provider)}
    >
      <Image src={icon} alt={iconAlt} width={iconSize} className="shrink-0" />
      <span className="flex-grow text-center">{label}</span>
      <Toaster />
    </button>
  )
}

export { SocialLoginButton }
