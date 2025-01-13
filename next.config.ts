import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/', // 사용자가 '/'로 접근할 때
        destination: '/home', // '/home'으로 리다이렉트
        permanent: true, // 영구 리다이렉트 (HTTP 308 상태 코드)
      },
    ]
  },
  images: {
    domains: ['pvnulsmnssufqahnareh.supabase.co', 'example.com'], // Supabase와 다른 외부 이미지 호스트 추가
  },
}

export default nextConfig
