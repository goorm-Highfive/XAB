'use client'

import { useForm, FormProvider } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { CustomFormField } from '~/components/common/custom-form-field'
import { createClient } from '~/utils/supabase/client'

export type FormDataType = {
  currentPassword: string
  newPassword: string
  newPasswordConfirm: string
}

const passwordUpdateSuccess = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1500))

  const supabase = createClient()
  await supabase.auth.signOut()
}

function PasswordForm() {
  const form = useForm<FormDataType>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      newPasswordConfirm: '',
    },
  })

  const updatePassword = async (data: FormDataType) => {
    if (data.newPassword !== data.newPasswordConfirm) {
      toast.error(
        '새 비밀번호와 확인용 비밀번호가 일치하지 않습니다. 다시 입력해 주세요.',
      )
      return
    }

    if (data.newPassword.length < 8) {
      toast.error('새 비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }

    try {
      const response = await fetch('/api/user-edit/edit-pswd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      })

      if (!response.ok) {
        const { error } = await response.json()
        throw new Error(
          error || '비밀번호 변경에 실패했습니다. 다시 시도해 주세요.',
        )
      }

      toast.success(
        '비밀번호가 성공적으로 변경되었습니다! 다시 로그인해 주세요.',
      )

      //딜레이 후 로그아웃
      passwordUpdateSuccess()

      form.reset()
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred.'

      console.error('Error updating password:', errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <FormProvider {...form}>
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
    </FormProvider>
  )
}

export { PasswordForm }
