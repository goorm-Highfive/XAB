'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, TypeIcon } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { AspectRatio } from '~/components/ui/aspect-ratio'
import { createClient } from '~/utils/supabase/client'
import { WritePayload, writeSchema } from '~/schema/write'
import { useRouter } from 'next/navigation'
import usePostStore from '~/stores/post-store'
import { Post } from '~/types/post'

export default function Write() {
  const supabase = createClient()
  const router = useRouter()

  const [previewA, setPreviewA] = useState<string | undefined>(undefined)
  const [previewB, setPreviewB] = useState<string | undefined>(undefined)

  const [postId, setPostId] = useState<string | null>(null)

  // 데이터 URL 생성하기
  const uploadImage = async (file: File, filePath: string) => {
    // 사진 supabase storage에 저장
    const { error } = await supabase.storage.from('xab').upload(filePath, file)

    if (error) {
      toast.error(`Upload Error: ${error.message}`)
      console.log(`upload Error: ${error.message}`)
    }

    // URL 추가
    const {
      data: { publicUrl },
    } = supabase.storage.from('xab').getPublicUrl(filePath)

    return publicUrl
  }

  const form = useForm<WritePayload>({
    resolver: zodResolver(writeSchema),
    defaultValues: {
      body: '',
      type: '',
      textA: '',
      textB: '',
    },
  })

  // 폼 데이터 불러오기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const postIdParam = urlParams.get('postId')

    if (postIdParam) {
      setPostId(postIdParam)

      const fetchPostData = async () => {
        try {
          const supabase = createClient()
          const { data: postData, error: postError } = await supabase
            .from('posts')
            .select(
              `
              id,
              caption,
              ab_tests:ab_tests (
                description_a,
                description_b,
                variant_a_url,
                variant_b_url
              )
            `,
            )
            .eq('id', Number(postIdParam))
            .single()

          if (postError || !postData) {
            toast.error('Failed to fetch post data.')
            return
          }

          const abTest = postData.ab_tests?.[0] || {}

          // 폼 데이터 초기화
          form.reset({
            body: postData.caption || '',
            type:
              abTest?.description_a || abTest?.variant_a_url
                ? abTest?.description_a
                  ? 'text'
                  : 'image'
                : '',
            textA: abTest?.description_a || '',
            textB: abTest?.description_b || '',
          })

          // 이미지 미리보기 설정
          setPreviewA(abTest?.variant_a_url || undefined)
          setPreviewB(abTest?.variant_b_url || undefined)
        } catch (error) {
          console.error('Error fetching post data:', error)
          toast.error('An unexpected error occurred.')
        }
      }

      fetchPostData()
    }
  }, [form])

  const addPost = usePostStore((state) => state.addPost)

  const onSubmit = async (values: WritePayload) => {
    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData?.user) {
        console.error('사용자 데이터를 찾을 수 없습니다.')
        return
      }

      if (!postId) {
        if (!values.body || !(values.body.trim().length > 0)) {
          toast.error('제목은 필수입니다. 제목을 작성해주세요.')
          return
        }

        const userId = userData.user.id

        // 게시글 데이터 생성
        const newPost = {
          user_id: userId,
          caption: values.body,
        }

        // 사용자 테이블에서 추가 정보를 가져오기
        const { data: userProfile, error: userError } = await supabase
          .from('users')
          .select('username, profile_image')
          .eq('id', userData.user.id)
          .single()

        if (userError) {
          console.error('사용자 정보 가져오기 실패:', userError.message)
        }

        const { data: postsData, error: postError } = await supabase
          .from('posts')
          .insert(newPost)
          .select('id, created_at, updated_at, user_id, image_url, caption')
          .single()

        if (postError) throw new Error(postError.message)

        const newPostId = postsData.id

        let abTestData = null

        if (values.type === 'text' || values.type === 'image') {
          const { data: abTestResult, error: abTestError } = await supabase
            .from('ab_tests')
            .insert({
              post_id: newPostId,
              description_a: values.textA || null,
              description_b: values.textB || null,
              variant_a_url: values.imageA
                ? await uploadImage(
                    values.imageA,
                    `images/${newPostId}/option-A${Date.now()}`,
                  )
                : null,
              variant_b_url: values.imageB
                ? await uploadImage(
                    values.imageB,
                    `images/${newPostId}/option-B${Date.now()}`,
                  )
                : null,
            })
            .select(
              'id, post_id, description_a, description_b, variant_a_url, variant_b_url',
            )
            .single()

          if (abTestError) throw new Error(abTestError.message)

          abTestData = abTestResult
        }

        // 포맷팅
        const formattedPost: Post = {
          post_id: postsData.id,
          post_user_id: postsData.user_id,
          currentUserId: null,
          username: userProfile?.username || 'Unknown',
          profile_image: userProfile?.profile_image || '',
          post_image_url: postsData.image_url || null,
          post_caption: postsData.caption || null,
          post_created_at: postsData.created_at,
          post_updated_at: postsData.updated_at || '',
          ab_test_id: abTestData?.id || null,
          variant_a_url: abTestData?.variant_a_url || null,
          variant_b_url: abTestData?.variant_b_url || null,
          description_a: abTestData?.description_a || null,
          description_b: abTestData?.description_b || null,
          ab_test_created_at: postsData.created_at || null,
          ab_test_updated_at: postsData.updated_at || null,
          ab_test_votes: [],
          comments: [],
          likes: [],
          comments_count: 0,
          voteComplete: false,
          likes_count: 0,
          userLiked: false,
          userVote: null,
          votesA: 0,
          votesB: 0,
        }

        addPost(formattedPost)

        toast.success('게시물이 성공적으로 업로드되었습니다.')
        router.back()
      } else {
        if (!values.body || !(values.body.trim().length > 0)) {
          toast.error('제목은 필수입니다. 제목을 작성해주세요.')
          return
        }

        // 기존 게시물 수정
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
          .eq('id', Number(postId))
          .single()

        if (postError || !postData) {
          toast.error('게시물 정보를 가져오는 데 실패했습니다.')
          return
        }

        const abTest = postData.ab_tests?.[0] || {}

        const { error: postUpdateError } = await supabase
          .from('posts')
          .update({ caption: values.body })
          .eq('id', Number(postId))

        if (postUpdateError) {
          toast.error('게시물 수정 중 문제가 발생했습니다. 다시 시도해주세요.')
          throw new Error(postUpdateError.message)
        }

        switch (values.type) {
          case 'text': {
            const { error: textError } = await supabase
              .from('ab_tests')
              .update({
                description_a: values.textA,
                description_b: values.textB,
              })
              .eq('post_id', Number(postId))

            if (textError) {
              toast.error(
                'A/B 테스트 수정 중 문제가 발생했습니다. 다시 시도해주세요.',
              )
              throw new Error(textError.message)
            }
            break
          }

          case 'image': {
            // 기존 URL 가져오기
            const currentImageAUrl = abTest?.variant_a_url
            const currentImageBUrl = abTest?.variant_b_url

            // 새로운 이미지 업로드 경로 생성
            const imageAPath = `images/${postId}/option-A${Date.now()}`
            const imageBPath = `images/${postId}/option-B${Date.now()}`

            // 이미지 A 처리
            const imageAurl =
              values.imageA instanceof File
                ? await uploadImage(values.imageA, imageAPath) // 새 이미지 업로드
                : currentImageAUrl // 기존 URL 유지

            // 이미지 B 처리
            const imageBurl =
              values.imageB instanceof File
                ? await uploadImage(values.imageB, imageBPath) // 새 이미지 업로드
                : currentImageBUrl // 기존 URL 유지

            // A/B 테스트 업데이트
            const { error: imageError } = await supabase
              .from('ab_tests')
              .update({
                variant_a_url: imageAurl,
                variant_b_url: imageBurl,
              })
              .eq('post_id', Number(postId))

            if (imageError) {
              toast.error(
                'A/B 테스트 수정 중 문제가 발생했습니다. 다시 시도해주세요.',
              )
              throw new Error(imageError.message)
            }
            break
          }
        }

        toast.success('게시물 수정이 완료되었습니다.')
        router.back()
      }

      router.push('/')
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
      }
    }
  }

  const renderSurveyForm = (formType: WritePayload['type']) => {
    switch (formType) {
      case 'text':
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Option A</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="textA"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Enter option A" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Option B</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="textB"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea placeholder="Enter option B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </>
        )
      case 'image':
        return (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Option A</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {previewA && (
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={previewA}
                      alt="Option A"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                )}
                <FormField
                  control={form.control}
                  name="imageA"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          className="hover:cursor-pointer"
                          accept="image/*"
                          onChange={(e) => {
                            setPreviewA(
                              URL.createObjectURL(
                                e.target.files?.[0] ?? new File([], ''),
                              ),
                            )
                            onChange(e.target.files?.[0])
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Option B</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                {previewB && (
                  <AspectRatio ratio={16 / 9}>
                    <Image
                      src={previewB}
                      alt="Option B"
                      fill
                      className="rounded-md object-cover"
                    />
                  </AspectRatio>
                )}
                <FormField
                  control={form.control}
                  name="imageB"
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="file"
                          className="hover:cursor-pointer"
                          accept="image/*"
                          onChange={(e) => {
                            setPreviewB(
                              URL.createObjectURL(
                                e.target.files?.[0] ?? new File([], ''),
                              ),
                            )
                            onChange(e.target.files?.[0])
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </>
        )
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea placeholder="What's on your mind?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field: { onChange, value } }) => (
            <FormItem className="space-y-3">
              {(value !== '' || !postId) && (
                <FormLabel className="flex items-center gap-2">
                  <span className="text-base font-semibold">
                    A/B Test Survey
                  </span>
                  <span className="text-muted-foreground">
                    (Choose option type)
                  </span>
                </FormLabel>
              )}
              <FormControl>
                <ToggleGroup
                  type="single"
                  onValueChange={(selectedValue) => {
                    // 수정 중이고 이미 선택된 값이면 선택 X
                    if (postId && selectedValue === value) return

                    form.reset({
                      type: selectedValue as WritePayload['type'],
                      body: form.getValues('body'),
                    })
                    setPreviewA(undefined)
                    setPreviewB(undefined)
                    onChange(selectedValue)
                  }}
                  value={value}
                  className="flex justify-start gap-2"
                  variant="outline"
                >
                  {(!postId || value === 'text') && (
                    <FormItem>
                      <FormControl>
                        <ToggleGroupItem
                          value="text"
                          disabled={!!postId && value === 'text'}
                        >
                          <TypeIcon />
                          Text Type
                        </ToggleGroupItem>
                      </FormControl>
                    </FormItem>
                  )}
                  {(!postId || value === 'image') && (
                    <FormItem>
                      <FormControl>
                        <ToggleGroupItem
                          value="image"
                          disabled={!!postId && value === 'image'}
                        >
                          <ImageIcon />
                          Image Type
                        </ToggleGroupItem>
                      </FormControl>
                    </FormItem>
                  )}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {renderSurveyForm(form.getValues('type'))}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              router.back()
            }}
          >
            Cancel
          </Button>
          <Button type="submit">{postId ? 'Edit' : 'Post'}</Button>
        </div>
      </form>
    </Form>
  )
}
