'use client'

import { CustomAlertDialog } from '~/components/common/custom-alert-dialog'

function CustomAlertDialogWrapper() {
  const deleteUser = async () => {
    try {
      const response = await fetch('/api/user-edit/delete-account', {
        method: 'DELETE',
      })

      // 응답 상태 확인
      if (!response.ok) {
        const errorData = await response.json()
        console.error('Account deletion failed:', errorData)
        alert('Account deletion failed: ' + errorData.error)
        return
      }

      // 성공적인 응답 처리
      const responseData = await response.json()
      alert('Account deleted successfully: ' + responseData.message)
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('Unexpected error occurred.')
    }
  }

  return (
    <CustomAlertDialog
      alertTitle="Are you sure you want to delete your account?"
      description="This action is permanent and cannot be undone."
      triggerBtnText="Delete Account"
      cancelBtnText="Cancel"
      actionBtnText="Continue"
      onActionClick={deleteUser}
    />
  )
}

export { CustomAlertDialogWrapper }
