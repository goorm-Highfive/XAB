'use client'

import { useForm } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { PasswordFormField } from '~/components/password-and-security/password-form-field'

function PasswordForm() {
  const form = useForm()

  return (
    <Form {...form}>
      <p className="mb-5 text-xl font-bold">Change Password</p>
      <form className="space-y-8">
        <PasswordFormField
          control={form.control}
          name="currentPassword"
          label="Current Password"
          type="password"
        />

        <PasswordFormField
          control={form.control}
          name="newPassword"
          label="New Password"
          type="password"
        />

        <PasswordFormField
          control={form.control}
          name="newPasswordConfirm"
          label="Confirm New Password"
          type="password"
        />
        <Button type="button">Update Password</Button>
      </form>
    </Form>
  )
}

export { PasswordForm }