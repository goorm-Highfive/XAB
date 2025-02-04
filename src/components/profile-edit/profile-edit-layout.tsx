import { Card } from '~/components/ui/card'

function ProfileEditLayout({
  contentTitle,
  children,
}: {
  contentTitle: string
  children: React.ReactNode
}) {
  return (
    <section>
      <h2 className="mb-5 mt-8 text-lg">
        <b>{contentTitle}</b>
      </h2>
      <Card className="p-6">{children}</Card>
    </section>
  )
}

export { ProfileEditLayout }
