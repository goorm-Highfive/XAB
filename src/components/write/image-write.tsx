// components/write/image-write.tsx
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
            render={({ field }) => {
              const { value, ...inputProps } = field
              void value // value를 사용하지 않음을 명시적으로 처리하여 ESLint 경고 회피
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      {...inputProps}
                      type="file"
                      className="hover:cursor-pointer"
                      accept="image/*"
                      // file input은 value를 제어할 수 없으므로 명시적으로 undefined로 지정합니다.
                      value={undefined}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setPreviewA(URL.createObjectURL(file))
                          field.onChange(file)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
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
            render={({ field }) => {
              const { value, ...inputProps } = field
              void value // value를 무시
              return (
                <FormItem>
                  <FormControl>
                    <Input
                      {...inputProps}
                      type="file"
                      className="hover:cursor-pointer"
                      accept="image/*"
                      value={undefined}
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) {
                          setPreviewB(URL.createObjectURL(file))
                          field.onChange(file)
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />
        </CardContent>
      </Card>
    </>
  )
}
