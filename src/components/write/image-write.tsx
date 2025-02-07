// components/survey/ImageSurvey.tsx
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { AspectRatio } from '~/components/ui/aspect-ratio'
import Image from 'next/image'
import { UseFormReturn } from 'react-hook-form'
import { WritePayload } from '~/schema/write'

interface ImageSurveyProps {
  form: UseFormReturn<WritePayload>
  previewA?: string
  previewB?: string
  setPreviewA: (url: string | undefined) => void
  setPreviewB: (url: string | undefined) => void
}

export function ImageSurvey({
  form,
  previewA,
  previewB,
  setPreviewA,
  setPreviewB,
}: ImageSurveyProps) {
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
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    className="hover:cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setPreviewA(URL.createObjectURL(file))
                        onChange(file)
                      }
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
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="file"
                    className="hover:cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        setPreviewB(URL.createObjectURL(file))
                        onChange(file)
                      }
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
