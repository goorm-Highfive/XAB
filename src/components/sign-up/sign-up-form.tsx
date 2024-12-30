'use client'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

export type FormDataType = {
  userName: string
  email: string
  password: string
  passwordConfirm: string
}

function SignUpForm() {
  const form = useForm<FormDataType>({
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      passwordConfirm: '',
    },
  })
  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-6">
          <CustomFormField
            name="userName"
            label="Name"
            placeholder="John Doe"
            type="text"
          />

          <CustomFormField
            name="email"
            label="Email"
            placeholder="xAB@example.com"
          />
          <CustomFormField name="password" label="Password" type="password" />
          <CustomFormField
            name="passwordConfirm"
            label="Password Confirm"
            type="password"
          />
          <Button type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { SignUpForm }
