'use client'

import Image from 'next/image'

type SocialLoginButtonProps = {
  icon: string
  iconAlt: string
  iconSize: number
  bgColor: string
  textColor?: string
  border?: string
  label: string
}

function SocialLoginButton({
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
    >
      <Image src={icon} alt={iconAlt} width={iconSize} className="shrink-0" />
      <span className="flex-grow text-center">{label}</span>
    </button>
  )
}

export { SocialLoginButton }
