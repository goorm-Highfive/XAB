'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'
import { toast } from 'sonner'

import { Toaster } from '~/components/ui/sonner'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { LoginPayload, loginSchema } from '~/schema/user'
import { createClient } from '~/utils/supabase/client'

function LoginForm() {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const supabase = createClient()

  const onSubmit = async (values: LoginPayload) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      console.log(error)
      toast.error('Login Failed', {
        description: `${error.message}`,
      })
    } else {
      console.log('로그인 성공:', data)
      redirect('/home')
    }
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
            addLinkHref="/account/reset-password"
          />
          <Button type="submit" className="my-4 w-full py-6">
            Login
          </Button>
        </div>
      </form>
      <Toaster richColors />
    </Form>
  )
}

export { LoginForm }
