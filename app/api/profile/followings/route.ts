import { NextResponse } from 'next/server'

const users = [
  { id: 1, name: 'Sarah Wilson', username: '@sarahw', isFollowing: false },
  { id: 2, name: 'Emma Davis', username: '@emmad', isFollowing: true },
  { id: 3, name: 'John Doe', username: '@DoeJ', isFollowing: false },
  { id: 4, name: 'Lee Young min', username: '@LYM', isFollowing: true },

  // 더 많은 사용자 데이터...
]

export async function GET() {
  return NextResponse.json(users) // 사용자 데이터 반환
}
