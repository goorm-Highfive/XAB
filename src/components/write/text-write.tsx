// components/survey/TextSurvey.tsx
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { Textarea } from '~/components/ui/textarea'
import { UseFormReturn } from 'react-hook-form'
import { WritePayload } from '~/schema/write'

interface TextSurveyProps {
  form: UseFormReturn<WritePayload>
}

export function TextSurvey({ form }: TextSurveyProps) {
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
}
