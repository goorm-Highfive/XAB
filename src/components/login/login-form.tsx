'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { redirect } from 'next/navigation'

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
      console.error('로그인 실패:', error.message)
      return
    }

    console.log('로그인 성공:', data)
    alert('로그인이 완료되었습니다!')
    redirect('/home')
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-6">
          <CustomFormField name="email" label="Email" type="text" />
          <CustomFormField name="password" label="Password" type="password" />
          <Button type="submit" className="my-4 w-full py-6">
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }
