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
    const { data: survey, error } = await supabase
      .from('posts')
      .select(
        `
        id,
        user_id,
        caption,
        image_url AS post_image_url,
        ab_tests (
          id AS ab_test_id,
          description_a AS optionA,
          description_b AS optionB,
          variant_a_url AS optionA_url,
          variant_b_url AS optionB_url,
          (SELECT COUNT(*) FROM ab_test_votes WHERE ab_test_id = ab_tests.id AND preferred_variant = 'A') AS votesA,
          (SELECT COUNT(*) FROM ab_test_votes WHERE ab_test_id = ab_tests.id AND preferred_variant = 'B') AS votesB
        ),
        (SELECT username FROM users WHERE users.id = posts.user_id) AS username,
        (SELECT COUNT(*) FROM likes WHERE post_id = posts.id) AS initLikeCount,
        (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS commentsCount,
        (SELECT preferred_variant FROM ab_test_votes WHERE ab_test_id = ab_tests.id AND user_id = $1 LIMIT 1) AS userVote,
        EXISTS (SELECT 1 FROM likes WHERE post_id = posts.id AND user_id = $1) AS userLiked
      `,
      )
      .eq('id', id)

    if (error) throw error
    if (!survey || survey.length === 0) {
      return res.status(404).json({ message: 'Survey not found' })
    }

    res.status(200).json(survey[0])
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: error.message })
  }
}
