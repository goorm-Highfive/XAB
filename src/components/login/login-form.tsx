'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { LoginPayload, loginSchema } from '~/schema/user'

function LoginForm() {
  const form = useForm<LoginPayload>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = (values: LoginPayload) => {
    console.log(values)
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
