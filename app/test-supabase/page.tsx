'use client'

import { useEffect, useState } from 'react'

export default function TestSupabasePage() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/test-supabase')
      const result = await response.json()

      if (response.ok) {
        setData(result.data)
      } else {
        setError(result.error)
      }
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>Supabase Test</h1>
      {error && <p>Error: {error}</p>}
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
    </div>
  )
}
