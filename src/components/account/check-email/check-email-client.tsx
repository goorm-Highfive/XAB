'use client'

import { useState } from 'react'
import Link from 'next/link'

import AccountLayout from '~/components/account/account-layout'
import { Button } from '~/components/ui/button'
import { createClient } from '~/utils/supabase/client'

function CheckEmailClient({ email }: { email: string | undefined }) {
  const supabase = createClient()

  type Status = {
    error: string
    message: string
  }
  const [status, setStatus] = useState<Status>({ error: '', message: '' })
  const MESSAGES = {
    emailLost:
      'Your email information has been lost. Please return to the login page',
    emailResent: `we've resent the email`,
  }

  const resendEmail = async () => {
    setStatus({ error: '', message: '' })

    if (!email) {
      setStatus({ error: MESSAGES.emailLost, message: '' })
      return
    }

    console.log(email)

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
      },
    })

    setStatus(
      error
        ? { error: error.message, message: '' }
        : { error: '', message: MESSAGES.emailResent },
    )
  }
  return (
    <AccountLayout
      title="Check Your Email"
      description="We’ve sent you a confirmation email to proceed with your request."
    >
      {status.error && <p className="text-sm text-red-500">{status.error}</p>}
      {status.message && <p className="mt-6 text-sm">{status.message}</p>}
      <div className="flex justify-between gap-4 pt-4 md:gap-6 md:px-3">
        <Button className="w-full py-6" onClick={resendEmail}>
          Resend Email
        </Button>
        <Button asChild className="w-full py-6">
          <Link href="/account/login">Go to Login</Link>
        </Button>
      </div>
    </AccountLayout>
  )
}

export { CheckEmailClient }
