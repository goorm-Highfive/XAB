import { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '~/utils/supabase'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id } = req.query

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  try {
    const { data: comments, error } = await supabase
      .from('comments')
      .select(
        `
        id,
        content,
        created_at AS date,
        user_id,
        (SELECT username FROM users WHERE users.id = comments.user_id) AS writer,
        (SELECT COUNT(*) FROM comment_likes WHERE comment_id = comments.id) AS likeCount,
        EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = comments.id AND user_id = $1) AS userLiked
      `,
      )
      .eq('post_id', id)
      .order('created_at', { ascending: false })

    if (error) throw error

    res.status(200).json(comments)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}
