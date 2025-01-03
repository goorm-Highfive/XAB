'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

import { SignUpPayload, signUpSchema } from '~/schema/user'

function SignUpForm() {
  const form = useForm<SignUpPayload>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      createdAt: new Date(),
    },
  })

  const onSubmit = (values: SignUpPayload) => {
    console.log(values)
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

          <Button type="submit" className="my-4 w-full py-6">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { SignUpForm }
