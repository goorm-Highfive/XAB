'use client'

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
}

function CustomFormField({
  name,
  label,
  placeholder,
  description,
  type,
}: FormProps) {
  const { control } = useFormContext()

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Label className="font-semibold">{label}</Label>
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
