import { NextResponse } from 'next/server'
import { createClient } from '~/utils/supabase/server'

export async function GET() {
  const supabase = await createClient() // No need for 'await' if createClient is synchronous

  try {
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError) {
      throw new Error(sessionError.message)
    }

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.id
    console.log('로그인된 유저 ID:', userId)

    // **2. Fetch Following IDs**
    const { data: followingData, error: followingError } = await supabase
      .from('follows')
      .select('following_id')
      .eq('follower_id', userId)

    if (followingError) {
      throw new Error(followingError.message)
    }

    const followingIds =
      followingData?.map((follow) => follow.following_id) || []

    // **3. Prepare Exclude IDs as a Comma-Separated String**
    const excludeIds = [userId, ...followingIds].join(',')

    // **4. Fetch Suggested Users with Correct Filter**
    const { data: suggestedUsers, error: suggestedUsersError } = await supabase
      .from('users')
      .select('id, username, profile_image, bio')
      .not('id', 'in', `(${excludeIds})`) // Correctly formatted filter
      .limit(5)
      .order('created_at', { ascending: false })

    if (suggestedUsersError) {
      throw new Error(suggestedUsersError.message)
    }

    return NextResponse.json({ data: suggestedUsers }, { status: 200 })
  } catch (err) {
    console.error('Error fetching suggested users:', err)
    if (err instanceof Error) {
      return NextResponse.json({ error: err.message }, { status: 500 })
    }
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
