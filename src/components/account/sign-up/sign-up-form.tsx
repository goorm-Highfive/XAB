'use client'

import { useState } from 'react'
import { redirect } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { SignUpPayload, signUpSchema } from '~/schema/user'
import { createClient } from '~/utils/supabase/client'

function SignUpForm() {
  const [error, setError] = useState<string | null>()

  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      createdAt: new Date(),
    },

    mode: 'onChange',
  })

  const onSubmit = async (values: SignUpPayload) => {
    const supabase = createClient()
    const { email, password, userName: username } = values
    setError(null)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
        },
      },
    })

    if (error) {
      setError(error.message)
      return
    }

    redirect(`/account/check-email?email=${email}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <CustomFormField
            name="userName"
            label="Name"
            placeholder="John Doe"
          />

          <CustomFormField
            name="email"
            label="Email"
            placeholder="xAB@example.com"
          />

          <CustomFormField
            name="password"
            label="Password"
            type="password"
            placeholder="password"
            description="Password must be at least 8 characters"
          />

          <CustomFormField
            name="passwordConfirm"
            label="Password Confirm"
            type="password"
            placeholder="password confirm"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" className="my-4 w-full py-6">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { SignUpForm }
