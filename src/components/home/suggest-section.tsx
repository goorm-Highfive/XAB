import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Button } from '~/components/ui/button'

const SUGGESTED_FOR_YOU = [
  {
    profile: 'https://github.com/wontory.png',
    name: '조성원',
    id: '@wontory',
    isFollowing: false,
  },
  {
    profile: 'https://github.com/E0min.png',
    name: '이영민',
    id: '@E0min',
    isFollowing: true,
  },
] as const

const TRENDING_TOPICS = [
  {
    title: '#technology',
    count: '125K posts',
  },
  {
    title: '#photography',
    count: '98K posts',
  },
  {
    title: '#travel',
    count: '76K posts',
  },
] as const

function SuggestSection() {
  return (
    <div className="sticky top-[92px] hidden w-72 flex-col gap-4 xl:flex">
      <Card>
        <CardHeader>
          <CardTitle>Suggested for you</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {SUGGESTED_FOR_YOU.map((item) => (
              <li key={item.id} className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={item.profile} alt={item.name} />
                  <AvatarFallback>AB</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 flex-col">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {item.id}
                  </span>
                </div>
                {item.isFollowing ? (
                  <Button size="sm" variant="outline">
                    Following
                  </Button>
                ) : (
                  <Button size="sm">Follow</Button>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {TRENDING_TOPICS.map((item) => (
              <li key={item.title} className="flex flex-col">
                <span className="text-sm text-muted-foreground">
                  {item.title}
                </span>
                <span className="font-bold">{item.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

export { SuggestSection }
