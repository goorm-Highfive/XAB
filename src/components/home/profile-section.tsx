import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'
import Link from 'next/link'

function ProfileSection() {
  return (
    <Card className="sticky top-[92px] hidden w-72 lg:block">
      <CardHeader className="items-center gap-5">
        <Avatar className="size-20 items-center justify-center">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback className="text-4xl font-semibold">AB</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <CardTitle>John Doe</CardTitle>
          <CardDescription>@johndoe</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">528</span>
          <span className="text-sm text-muted-foreground">Posts</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">2.4k</span>
          <span className="text-sm text-muted-foreground">Followers</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="font-bold">891</span>
          <span className="text-sm text-muted-foreground">Following</span>
        </div>
      </CardContent>
      <CardFooter>
        <Link
          href="/settings/personal-information"
          passHref
          className="block w-full" // block 추가
        >
          <Button variant="default" className="w-full">
            Edit Profile
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

export { ProfileSection }
