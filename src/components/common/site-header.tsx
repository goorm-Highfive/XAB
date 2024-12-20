import { User } from 'lucide-react'
import Image from 'next/image'

import Logo from '~/assets/svgs/logo.svg'
import { Button } from '~/components/ui/button'
import { NotificationButton } from '~/components/common/notification-button'

function SiteHeader() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="flex items-center gap-2">
          <Image src={Logo} alt="Website Logo" className="size-8" />
        </h1>

        {/* Navbar 메뉴 */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile
          </Button>
          <NotificationButton />
        </div>
      </div>
    </nav>
  )
}

export { SiteHeader }
