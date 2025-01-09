'use client'

import Link from 'next/link'
import { HTMLInputTypeAttribute } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type FormProps = {
  name: string
  label: string
  placeholder?: string
  description?: string
  type?: HTMLInputTypeAttribute
} & (
  | {
      addLinkTitle?: undefined
      addLinkHref?: undefined
    }
  | {
      addLinkTitle: string
      addLinkHref: string
    }
)

function CustomFormField({
  name,
  label,
  placeholder,
  description,
  type,
  addLinkTitle,
  addLinkHref,
}: FormProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="flex items-center">
            <Label className="font-semibold">{label}</Label>
            {addLinkTitle ? (
              <Link
                href={addLinkHref}
                className="ml-auto inline-block cursor-pointer text-xs text-gray-500 underline-offset-4 hover:underline"
              >
                {addLinkTitle}
              </Link>
            ) : null}
          </div>
          <FormControl>
            <Input
              type={type}
              placeholder={placeholder}
              className="py-5"
              {...field}
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { CustomFormField }
