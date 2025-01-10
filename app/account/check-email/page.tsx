import { CheckEmailClient } from '#/account/check-email/check-email-client'

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { email } = await searchParams

  return <CheckEmailClient email={email} />
}
