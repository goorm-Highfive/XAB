import type { Metadata } from 'next'

import '~/styles/globals.css'

export const metadata: Metadata = {
  title: 'XAB',
  description: 'A/B 테스트를 집단지성으로!',
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode
  modal: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body className="antialiased">
        {children}
        {modal}
      </body>
    </html>
  )
}
