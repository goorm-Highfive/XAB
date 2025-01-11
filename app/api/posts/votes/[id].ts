import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '~/utils/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { userId, option } = req.body

  try {
    const { error } = await supabase.from('ab_test_votes').upsert({
      ab_test_id: id,
      user_id: userId,
      preferred_variant: option,
      created_at: new Date().toISOString(),
    })

    if (error) throw error

    res.status(200).json({ message: 'Vote submitted successfully' })
  } catch (error: unknown) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}
