interface User {
  id: number
  name: string
  username: string
  bio?: string
  isFollowing?: boolean
  image?: string
}

export type { User }
