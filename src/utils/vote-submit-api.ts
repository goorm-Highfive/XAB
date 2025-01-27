export const voteSubmitAPI = async (abTestId: number, option: 'A' | 'B') => {
  const res = await fetch('/api/vote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ abTestId, option }),
    credentials: 'include',
  })

  if (!res.ok) {
    const errJson = await res.json().catch(() => ({}))
    throw new Error(errJson.error || 'Failed to submit vote')
  }

  return res.json()
}
