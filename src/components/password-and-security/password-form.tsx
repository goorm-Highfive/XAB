'use client'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'

export type FormDataType = {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

function PasswordForm() {
  const form = useForm<FormDataType>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const updatePassword = (data: FormDataType): void => {
    toast.success('The password has been changed')
    console.log(data)
    form.reset()
  }

  return (
    <Form {...form}>
      <p className="mb-5 text-xl font-bold">Change Password</p>
      <form onSubmit={form.handleSubmit(updatePassword)} className="space-y-8">
        <CustomFormField
          name="currentPassword"
          label="Current Password"
          type="password"
        />

        <CustomFormField
          name="newPassword"
          label="New Password"
          type="password"
        />

        <CustomFormField
          name="newPasswordConfirm"
          label="Confirm New Password"
          type="password"
        />
        <Button type="submit">Update Password</Button>
      </form>
    </Form>
  )
}

export { PasswordForm }
