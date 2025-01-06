import Link from 'next/link'

import { Card } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

function NewSurveyButton() {
  return (
    <Card className="mb-4 flex items-center gap-4 p-6 shadow-sm">
      <div className="h-8 w-8 rounded-full bg-gray-300" />
      <Button
        variant="outline"
        className="w-full justify-start rounded-full"
        asChild
      >
        <Link href="/write">Create a new survey...</Link>
      </Button>
    </Card>
  )
}

export { NewSurveyButton }
