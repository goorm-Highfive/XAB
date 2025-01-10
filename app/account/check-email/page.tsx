'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import AccountLayout from '~/components/account/account-layout'
import { Button } from '~/components/ui/button'
import { createClient } from '~/utils/supabase/client'

export default function CheckEmailPage() {
  const supabase = createClient()
  const params = useSearchParams()
  const userEmail = params.get('email') ?? ''
  const [message, setMessage] = useState<string | null>()
  const MESSAGES = {
    emailLost:
      'Your email information has benn lost. Please return to the login page',
    emailResent: `we've resent the email`,
  }

  const resendEmail = async () => {
    setMessage(null)

    if (!userEmail) {
      setMessage(MESSAGES.emailLost)
      return
    }

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: userEmail,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    setMessage(error ? error.message : MESSAGES.emailResent)
  }
  return (
    <AccountLayout
      title="Check Your Email"
      description="We’ve sent you a confirmation email to proceed with your request."
    >
      {message && <p className="mb-5 text-sm">{message}</p>}
      <div className="flex justify-between gap-4 pt-4 md:gap-6 md:px-3">
        <Button className="w-full py-5" onClick={resendEmail}>
          Resend Email
        </Button>
        <Button asChild className="w-full py-5">
          <Link href="/account/login">Go to Login</Link>
        </Button>
      </div>
    </AccountLayout>
  )
}
