'use client'

import { PasswordForm } from '~/components/password-and-security/password-form'
import { Toaster } from '~/components/ui/sonner'

function PasswordAndSecurity() {
  return (
    <div className="mx-auto max-w-xl">
      <h2 className="my-2 text-2xl font-bold">
        Password and Security Settings
      </h2>
      <p className="mb-10 text-sm">
        Manage your account security and login settings
      </p>

      <div className="rounded-lg bg-background px-5 py-5">
        <PasswordForm />
      </div>
      <Toaster />
    </div>
  )
}

export default PasswordAndSecurity
