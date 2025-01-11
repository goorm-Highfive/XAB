'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { createClient } from '~/utils/supabase/client'
import { CheckEmailPayload, checkEmailSchema } from '~/schema/user'

const supabase = createClient()

const MESSAGES = {
  emailNotRegistered: 'The email address is not registered.',
  sentEmail:
    'We’ve sent you a confirmation email to proceed with your request. Check your email.',
  unexpectedError: 'Something went wrong. Please try again later.',
}

type Status = {
  error: string
  message: string
}

const getUsersEmail = async (email: string): Promise<string | null> => {
  const { data, error } = await supabase
    .from('users')
    .select('email')
    .eq('email', email)
    .maybeSingle()

  if (error) {
    throw new Error(`Error fetching user by email: ${error.message}`)
  }
  return data?.email || null
}

function ForgotPasswordForm() {
  const [status, setStatus] = useState<Status>({ error: '', message: '' })

  const form = useForm<CheckEmailPayload>({
    resolver: zodResolver(checkEmailSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: CheckEmailPayload) => {
    setStatus({ error: '', message: '' })

    try {
      const userEmail = await getUsersEmail(values.email)

      if (!userEmail) {
        setStatus({ error: MESSAGES.emailNotRegistered, message: '' })
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/account/reset-password`,
        },
      )

      if (error) {
        setStatus({ error: error.message, message: '' })
        return
      }

      setStatus({ error: '', message: MESSAGES.sentEmail })
    } catch (err) {
      console.error('Unexpected error:', err)
      setStatus({ error: MESSAGES.unexpectedError, message: '' })
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <CustomFormField
              name="email"
              label="Email"
              placeholder="xAB@example.com"
            />
            {status.error && (
              <p className="text-sm text-red-500">{status.error}</p>
            )}
            {status.message && <p className="mt-6 text-sm">{status.message}</p>}
            <Button
              type="submit"
              className="mb-3 w-full py-6"
              disabled={!form.formState.isValid}
            >
              Send Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex text-sm text-gray-500">
        <p>Remember Your Address? </p>
        <Link
          href="/account/login"
          className="ml-1 underline underline-offset-4"
        >
          Login
        </Link>
      </div>
    </>
  )
}

export { ForgotPasswordForm }
