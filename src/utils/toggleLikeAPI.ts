export const toggleLikeAPI = async (postId: number) => {
  const res = await fetch('/api/like', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ postId }),
    credentials: 'include', // 쿠키 포함
  })

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}))
    throw new Error(errJson.error || 'Failed to toggle like')
  }

  return res.json()
}
