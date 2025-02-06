'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Send } from 'lucide-react'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { addComment } from '~/actions/comment-action' // 서버 액션 임포트

import defaultProfile from '~/assets/svgs/default-profile.svg'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '~/components/ui/form'

const commentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Please enter a comment.')
    .max(500, 'Max 500 characters.'),
})

type CommentFormValues = z.infer<typeof commentSchema>

type SurveyCommentInputProps = {
  postId: number
}

function SurveyCommentInput({ postId }: SurveyCommentInputProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: '' },
  })

  const handleSubmit = async (data: CommentFormValues) => {
    if (!isSubmitting) {
      setIsSubmitting(true)
      try {
        await addComment(postId, data.comment)
        toast.success('Comment added successfully.')
        form.reset()
      } catch (error) {
        console.log(error)
        toast.error('Failed to add comment.')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-5 flex border-t pt-5"
      >
        <div className="mr-3 mt-1 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
          <Image src={defaultProfile} alt="default profile" />
        </div>
        <FormField
          name="comment"
          render={({ field }) => (
            <FormItem className="relative flex-auto">
              <FormControl>
                <Input
                  type="text"
                  className="h-10 rounded-lg border bg-gray-100 pl-5 pr-12"
                  placeholder="Add a comment..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="pl-5" />
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                <Send />
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export { SurveyCommentInput }
