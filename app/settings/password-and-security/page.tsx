'use client'

import { PasswordForm } from '~/components/password-and-security/password-form'
import { Toaster } from '~/components/ui/sonner'

function PasswordAndSecurity() {
  return (
    <div className="h-screen">
      <div className="m-auto w-2/3 pt-10 xl:w-1/2">
        <h2 className="my-2 text-2xl font-bold">
          Password and Security Settings
        </h2>
        <p className="mb-10 text-sm">
          Manage your account security and login settings
        </p>

        <div className="rounded-lg bg-background px-5 py-5">
          <PasswordForm />
        </div>
      </div>
      <Toaster />
    </div>
  )
}

export default PasswordAndSecurity
