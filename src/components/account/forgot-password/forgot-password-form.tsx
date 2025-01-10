'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { createClient } from '~/utils/supabase/client'

const supabase = createClient()
// DB에 해당 이메일이 있는지 확인
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

const emailSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email required.' })
    .email({ message: 'Invalid email.' }),
})

function ForgotPasswordForm() {
  const [status, setStatus] = useState({ error: '', message: '' })

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof emailSchema>) => {
    try {
      setStatus({ error: '', message: '' })
      const userEmail = await getUsersEmail(values.email)

      // 유저 이메일이 DB에 없음
      if (!userEmail) {
        setStatus({
          error: 'The email address is not registered.',
          message: '',
        })
        return
      }

      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/account/reset-password`,
        },
      )

      // DB에 데이터는 있는데, 오류가 있음
      if (error) {
        setStatus({
          error: `${error.message}`,
          message: '',
        })
        return
      }

      setStatus({
        error: '',
        message:
          'We’ve sent you a confirmation email to proceed with your request. Check your email.',
      })
    } catch (err) {
      console.error('Unexpected error:', err)
      setStatus({
        error: 'Something went wrong. Please try again later.',
        message: '',
      })
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
            <Button type="submit" className="mb-3 w-full py-6">
              Send Email
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex text-sm text-gray-500">
        <p className="">Remember Your Address? </p>
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
