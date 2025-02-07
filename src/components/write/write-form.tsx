//~/component/write/write-form
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import { ToggleGroup, ToggleGroupItem } from '~/components/ui/toggle-group'
import { ImageIcon, TypeIcon } from 'lucide-react'
import { createClient } from '~/utils/supabase/client'
import { WritePayload, writeSchema } from '~/schema/write'

import { TextSurvey } from '~/components/write/text-write'
import { ImageSurvey } from '~/components/write/image-write'
import { createPostAction, updatePostAction } from '~/actions/post-actions'

interface WriteFormProps {
  onClose: () => void
}

function WriteForm({ onClose }: WriteFormProps) {
  const supabase = createClient()
  const [previewA, setPreviewA] = useState<string | undefined>(undefined)
  const [previewB, setPreviewB] = useState<string | undefined>(undefined)
  const [postId, setPostId] = useState<string | null>(null)

  const form = useForm<WritePayload>({
    resolver: zodResolver(writeSchema),
    defaultValues: {
      body: '',
      type: '',
      textA: '',
      textB: '',
    },
  })

  // URL 쿼리 파라미터에 postId가 있으면 기존 게시물 데이터를 불러옵니다.
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const postIdParam = urlParams.get('postId')
    if (postIdParam) {
      setPostId(postIdParam)
      const fetchPostData = async () => {
        try {
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
            toast.error('게시물 데이터를 불러오지 못했습니다.')
            return
          }
          const abTest = postData.ab_tests?.[0] || {}
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
          setPreviewA(abTest?.variant_a_url || undefined)
          setPreviewB(abTest?.variant_b_url || undefined)
        } catch (error) {
          console.error('게시물 데이터 불러오기 오류:', error)
          toast.error('예기치 못한 오류가 발생했습니다.')
        }
      }
      fetchPostData()
    }
  }, [form, supabase])

  const onSubmit = async (values: WritePayload) => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData?.user) {
        toast.error('사용자 정보를 찾을 수 없습니다.')
        return
      }
      const userId = userData.user.id

      if (!postId) {
        // 새 게시물 작성 (생성)
        await createPostAction(values, userId)
        toast.success('게시물이 성공적으로 업로드되었습니다.')
        onClose() // 제출 후 모달 닫기
      } else {
        // 기존 게시물 수정
        await updatePostAction(Number(postId), values)
        toast.success('게시물이 성공적으로 수정되었습니다.')
        onClose() // 제출 후 모달 닫기
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message)
        toast.error(error.message)
      }
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
                    <ToggleGroupItem
                      value="text"
                      disabled={!!postId && value === 'text'}
                    >
                      <TypeIcon />
                      Text Type
                    </ToggleGroupItem>
                  )}
                  {(!postId || value === 'image') && (
                    <ToggleGroupItem
                      value="image"
                      disabled={!!postId && value === 'image'}
                    >
                      <ImageIcon />
                      Image Type
                    </ToggleGroupItem>
                  )}
                </ToggleGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.getValues('type') === 'text' && <TextSurvey form={form} />}
        {form.getValues('type') === 'image' && (
          <ImageSurvey
            form={form}
            previewA={previewA}
            previewB={previewB}
            setPreviewA={setPreviewA}
            setPreviewB={setPreviewB}
          />
        )}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {postId ? (
            <Button type="submit">Edit</Button>
          ) : (
            <Button type="submit">Post</Button>
          )}
        </div>
      </form>
    </Form>
  )
}

export { WriteForm }
