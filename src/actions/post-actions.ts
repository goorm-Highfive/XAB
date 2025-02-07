// app/actions/postActions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '~/utils/supabase/server'
import { WritePayload } from '~/schema/write'

export async function createPostAction(values: WritePayload, userId: string) {
  const supabase = await createClient()

  // 새 게시물 추가
  const { data: postsData, error: postError } = await supabase
    .from('posts')
    .insert({ user_id: userId, caption: values.body })
    .select('id')

  if (postError) {
    throw new Error(postError.message)
  }

  const newPostId = postsData[0].id

  // A/B 테스트 관련 로직
  if (values.type === 'text') {
    const { error: textError } = await supabase.from('ab_tests').insert({
      post_id: newPostId,
      description_a: values.textA,
      description_b: values.textB,
    })
    if (textError) {
      throw new Error(textError.message)
    }
  } else if (values.type === 'image') {
    if (!(values.imageA instanceof File) || !(values.imageB instanceof File)) {
      throw new Error('Both imageA and imageB must be files.')
    }

    const imageAPath = `images/${newPostId}/option-A${Date.now()}`
    const imageBPath = `images/${newPostId}/option-B${Date.now()}`

    const uploadImage = async (file: File, filePath: string) => {
      const { error } = await supabase.storage
        .from('xab')
        .upload(filePath, file)
      if (error) {
        throw new Error(error.message)
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('xab').getPublicUrl(filePath)
      return publicUrl
    }

    const imageAurl = await uploadImage(values.imageA, imageAPath)
    const imageBurl = await uploadImage(values.imageB, imageBPath)

    const { error: imageError } = await supabase.from('ab_tests').insert({
      post_id: newPostId,
      variant_a_url: imageAurl,
      variant_b_url: imageBurl,
    })
    if (imageError) {
      throw new Error(imageError.message)
    }
  }

  // /home 경로 ISR 캐시 재검증
  revalidatePath('/home')

  return newPostId
}

export async function updatePostAction(postId: number, values: WritePayload) {
  const supabase = await createClient()

  // 기존 게시물 데이터 가져오기
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select(
      `
      id,
      caption,
      ab_tests:ab_tests (
         variant_a_url,
         variant_b_url
      )
    `,
    )
    .eq('id', postId)
    .single()

  if (postError || !postData) {
    throw new Error('게시물 정보를 가져오는 데 실패했습니다.')
  }

  const abTest = postData.ab_tests?.[0] || {}

  // 게시물 제목(캡션) 업데이트
  const { error: postUpdateError } = await supabase
    .from('posts')
    .update({ caption: values.body })
    .eq('id', postId)

  if (postUpdateError) {
    throw new Error('게시물 수정 중 문제가 발생했습니다.')
  }

  if (values.type === 'text') {
    const { error: textError } = await supabase
      .from('ab_tests')
      .update({
        description_a: values.textA,
        description_b: values.textB,
      })
      .eq('post_id', postId)
    if (textError) {
      throw new Error(textError.message)
    }
  } else if (values.type === 'image') {
    // 기존 이미지 URL 유지 또는 새 파일이 있으면 업로드
    const currentImageAUrl = abTest?.variant_a_url
    const currentImageBUrl = abTest?.variant_b_url

    const imageAPath = `images/${postId}/option-A${Date.now()}`
    const imageBPath = `images/${postId}/option-B${Date.now()}`

    const uploadImage = async (file: File, filePath: string) => {
      const { error } = await supabase.storage
        .from('xab')
        .upload(filePath, file)
      if (error) {
        throw new Error(error.message)
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from('xab').getPublicUrl(filePath)
      return publicUrl
    }

    const imageAurl =
      values.imageA instanceof File
        ? await uploadImage(values.imageA, imageAPath)
        : currentImageAUrl
    const imageBurl =
      values.imageB instanceof File
        ? await uploadImage(values.imageB, imageBPath)
        : currentImageBUrl

    const { error: imageError } = await supabase
      .from('ab_tests')
      .update({
        variant_a_url: imageAurl,
        variant_b_url: imageBurl,
      })
      .eq('post_id', postId)
    if (imageError) {
      throw new Error(imageError.message)
    }
  }

  revalidatePath('/home')
  return postId
}

export async function deletePostAction(postId: number) {
  const supabase = await createClient()

  const { error: deleteError } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)
  if (deleteError) {
    throw new Error(deleteError.message)
  }

  revalidatePath('/home')
  return postId
}
