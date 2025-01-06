import type { Metadata } from 'next'
import { SiteHeader } from '~/components/common/site-header'

import '~/styles/globals.css'

export const metadata: Metadata = {
  title: 'XAB',
  description: 'A/B 테스트를 집단지성으로!',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="bg-gray-100 antialiased">
        <SiteHeader />
        <main className="min-h-screen px-5 pb-20 pt-10" role="main">
          <div className="mx-auto max-w-screen-2xl">{children}</div>
        </main>
      </body>
    </html>
  )
}
