'use client'

import { useForm } from 'react-hook-form'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

export type FormDataType = {
  email: string
  password: string
}

function LoginForm() {
  const form = useForm<FormDataType>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Form {...form}>
      <form>
        <div className="flex flex-col gap-6">
          <CustomFormField name="email" label="Email" type="password" />
          <CustomFormField name="password" label="Password" type="password" />
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { LoginForm }
