'use client'

import { useSearchParams } from 'next/navigation'

import { createClient } from '~/utils/supabase/client'
import AccountLayout from '~/components/account/account-layout'
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'

export default function CheckEmailPage() {
  const supabase = createClient()
  const params = useSearchParams()
  const userEmail = params.get('email')
  const [message, setMessage] = useState<string | null>()

  const resendEmail = async () => {
    setMessage(null)

    if (userEmail) {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: userEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage(`we've resent the email`)
      }
    } else {
      setMessage(
        'Your email information has been lost. Please return to the login page',
      )
    }
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
        <Button asChild className="w-full py-5" onClick={resendEmail}>
          <Link href="/account/login">Go to Login</Link>
        </Button>
      </div>
    </AccountLayout>
  )
}
