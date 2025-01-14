import { useState } from 'react'
import Image from 'next/image'
import { Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

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

// 댓글 입력 스키마 정의
const commentSchema = z.object({
  comment: z
    .string()
    .min(1, 'Please enter a comment.')
    .max(500, 'Comments must be 500 characters or fewer.'),
})

type CommentFormValues = z.infer<typeof commentSchema>

function SurveyCommentInput() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { comment: '' },
  })

  const handleSubmit = (data: CommentFormValues) => {
    if (!isSubmitting) {
      setIsSubmitting(true)
      console.log(data)

      setTimeout(() => {
        form.reset()
        setIsSubmitting(false)
      }, 500)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mt-[25px] flex border-t pt-[25px]"
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
                  className="h-[40px] rounded-[30px] border-0 bg-primary-foreground pl-5 pr-[40px]"
                  placeholder="Add a comment..."
                  {...field}
                />
              </FormControl>
              <FormMessage className="pl-5" />
              <Button
                type="submit"
                variant="ghost"
                className="z-1 absolute right-2 top-[-4] w-[30px] hover:bg-transparent"
                disabled={isSubmitting} // 중복 제출 방지
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
