'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Button } from '~/components/ui/button'
import { Form } from '~/components/ui/form'
import { CustomFormField } from '~/components/common/custom-form-field'
import { ModalAlert } from '~/components/common/modal-alert'
import { createClient } from '~/utils/supabase/client'
import { UpdatePasswordPayload, updatePasswordSchema } from '~/schema/user'

function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

  const form = useForm<UpdatePasswordPayload>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: '',
      passwordConfirm: '',
    },
  })

  const supabase = createClient()

  const onSubmit = async (values: UpdatePasswordPayload) => {
    setError(null)
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    })

    if (error) {
      setError(`${error.message}`)
      return
    }

    setIsAlertOpen(true) // AlertDialog 열기
  }

  const handleLogout = () => {
    supabase.auth.signOut()
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <CustomFormField name="password" label="password" type="password" />
            <CustomFormField
              name="passwordConfirm"
              label="Password Confirm"
              type="password"
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="my-4 w-full py-6">
              Reset Password
            </Button>
          </div>
        </form>
      </Form>
      <ModalAlert
        open={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title="Password Reset Successful"
        description="Your password has been updated! Please log in again with your new password."
        buttonTitle="Go to Login"
        alertAction={handleLogout}
      />
    </>
  )
}

export { ResetPasswordForm }
