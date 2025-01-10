import Link from 'next/link'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

type AccountLayoutProps = {
  title: string
  description: string
  linkHref?: string
  linkText?: string
  children: React.ReactNode
}

function AccountLayout({
  title,
  description,
  linkHref = '/',
  linkText,
  children,
}: AccountLayoutProps) {
  return (
    <div className="mx-auto mt-24 flex items-center justify-center">
      <Card className="w-full max-w-md py-2">
        <CardHeader>
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>
            {description}
            {linkHref ? (
              <Link
                href={linkHref}
                className="ml-1 underline underline-offset-4"
              >
                {linkText}
              </Link>
            ) : null}
          </CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  )
}

export { AccountLayout }
