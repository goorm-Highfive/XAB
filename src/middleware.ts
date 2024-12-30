import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // 사용자가 '/'로 접근했을 때
  if (request.nextUrl.pathname === '/') {
    // '/home'으로 리다이렉트
    return NextResponse.redirect(new URL('/home', request.url))
  }
}
