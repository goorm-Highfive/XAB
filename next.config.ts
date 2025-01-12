import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    domains: ['pvnulsmnssufqahnareh.supabase.co'],
  },
  async redirects() {
    return [
      {
        source: '/', // 사용자가 '/'로 접근할 때
        destination: '/home', // '/home'으로 리다이렉트
        permanent: true, // 영구 리다이렉트 (HTTP 308 상태 코드)
      },
    ]
  },
}

export default nextConfig
