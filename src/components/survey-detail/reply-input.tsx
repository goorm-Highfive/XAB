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

const replySchema = z.object({
  replyContent: z
    .string()
    .min(1, 'Please enter a comment.')
    .max(500, 'Comments must be 500 characters or fewer.'),
})

type ReplyFormValues = z.infer<typeof replySchema>

function ReplyInput({ username }: { username: string }) {
  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { replyContent: '' },
  })

  const onSubmit = (values: ReplyFormValues) => {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-[25px] flex items-center"
      >
        <div className="mr-3 h-8 w-8 flex-shrink-0 overflow-hidden rounded-full">
          <Image src={defaultProfile} alt="" />
        </div>
        <FormField
          name="replyContent"
          control={form.control}
          render={({ field }) => (
            <FormItem className="relative flex-auto">
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  className="h-[40px] rounded-[30px] border-0 bg-primary-foreground pl-5 pr-[40px]"
                  placeholder={`@${username}에게 답글 달기`}
                />
              </FormControl>
              <FormMessage className="pl-7" />
              <Button
                type="submit"
                variant="ghost"
                className="absolute right-2 top-[-4] w-[30px] hover:bg-transparent"
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

export { ReplyInput }
