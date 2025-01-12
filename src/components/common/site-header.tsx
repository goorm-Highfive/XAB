'use client'

import Image from 'next/image'
import Link from 'next/link'
import { User } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Button } from '~/components/ui/button'
import { NotificationButton } from '~/components/common/notification-button'
import { createClient } from '~/utils/supabase/client'

import Logo from '~/assets/svgs/logo.svg'

function SiteHeader() {
  const pathname = usePathname()
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient()
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        console.error('Failed to fetch user:', error.message)
      } else if (user) {
        setUserId(user.id)
      }
    }

    fetchUser()
  }, [])

  if (pathname.startsWith('/account')) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <h1 className="flex items-center gap-2">
          <Link href="/">
            <Image src={Logo} alt="Website Logo" className="size-8" />
          </Link>
        </h1>

        {/* Navbar 메뉴 */}
        <nav className="flex items-center gap-4">
          <Link href={userId ? `/profile/${userId}` : '/login'}>
            <Button variant="ghost" className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </Button>
          </Link>

          <NotificationButton />
        </nav>
      </div>
    </header>
  )
}

export { SiteHeader }
