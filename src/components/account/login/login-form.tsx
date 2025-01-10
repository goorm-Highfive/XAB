'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { LoginPayload, loginSchema } from '~/schema/user'
import { createClient } from '~/utils/supabase/client'

function LoginForm() {
  const [error, setError] = useState<boolean>(false)

  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const supabase = createClient()

  const onSubmit = async (values: LoginPayload) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      setError(true)
      return
    }
    redirect('/home')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <CustomFormField name="email" label="Email" type="text" />
          <CustomFormField
            name="password"
            label="Password"
            type="password"
            addLinkTitle="Forget Your Password?"
            addLinkHref="/account/forgot-password"
          />
          {error && (
            <p className="text-sm text-red-500">
              The email or password you entered is incorrect. Please check and
              try again
            </p>
          )}
          <Button type="submit" className="my-4 w-full py-6">
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }
