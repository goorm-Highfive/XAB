'use client'

import { HTMLInputTypeAttribute } from 'react'
import { useFormContext } from 'react-hook-form'

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'

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
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { CustomFormField }
