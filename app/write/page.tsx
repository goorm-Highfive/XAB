'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ImageIcon, TypeIcon } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
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

export default function Write() {
  const supabase = createClient()
  const router = useRouter()

  const [previewA, setPreviewA] = useState<string | undefined>(undefined)
  const [previewB, setPreviewB] = useState<string | undefined>(undefined)

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
      type: undefined,
      textA: '',
      textB: '',
    },
  })

  const onSubmit = async (values: WritePayload) => {
    try {
      const { data: userData } = await supabase.auth.getUser()

      if (!userData.user) {
        console.error('userData가 없습니다.')
        return
      }

      const userId = userData.user.id

      // post 데이터 추가
      const { data: postsData, error: postError } = await supabase
        .from('posts')
        .insert({ user_id: userId, caption: values.body })
        .select('id')

      if (postError) throw new Error(postError.message)

      console.log('Post inserted successfully:', postsData)

      const postId = postsData[0].id // 방금 올린 post의 id

      // survey를 선택 했을 때
      switch (values.type) {
        case 'text': {
          const { error: textError } = await supabase.from('ab_tests').insert({
            post_id: postId,
            description_a: values.textA,
            description_b: values.textB,
          })

          if (textError) {
            toast.error(`Failed to upload post. Please try again`)
            throw new Error(textError.message)
          }
          console.log('Post inserted successfully')
          break
        }

        case 'image': {
          const imageAPath = `images/${postId}/option-A${Date.now()}`
          const imageBPath = `images/${postId}/option-B${Date.now()}`

          const imageAurl = values.imageA
            ? await uploadImage(values.imageA, imageAPath)
            : undefined

          const imageBurl = values.imageB
            ? await uploadImage(values.imageB, imageBPath)
            : undefined

          const { error: imageError } = await supabase.from('ab_tests').insert({
            post_id: postId,
            variant_a_url: imageAurl,
            variant_b_url: imageBurl,
          })

          if (imageError) {
            toast.error('Failed to upload post. Please try again.')
            throw new Error(imageError.message)
          }
          console.log('AB_Testsinserted successfully')
          break
        }

        default:
          console.log('survey type을 추가하지 않음')
      }

      console.log('Values:', values)
      router.back()
    } catch (error) {
      console.error('An error occurred:', (error as Error).message)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          render={({ field: { onChange, ...field } }) => (
            <FormItem className="space-y-3">
              <FormLabel className="flex items-center gap-2">
                <span className="text-base font-semibold">A/B Test Survey</span>
                <span className="text-muted-foreground">
                  (Choose option type)
                </span>
              </FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  onValueChange={(value) => {
                    form.reset({
                      type: value as WritePayload['type'],
                      body: form.getValues('body'),
                    })
                    setPreviewA(undefined)
                    setPreviewB(undefined)
                    onChange(value)
                  }}
                  defaultValue={field.value}
                  className="flex justify-start gap-2"
                  variant="outline"
                >
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="text">
                        <TypeIcon />
                        Text Type
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
                  <FormItem>
                    <FormControl>
                      <ToggleGroupItem value="image">
                        <ImageIcon />
                        Image Type
                      </ToggleGroupItem>
                    </FormControl>
                  </FormItem>
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
          <Button type="submit">Post</Button>
        </div>
      </form>
    </Form>
  )
}
