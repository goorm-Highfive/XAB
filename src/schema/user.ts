import { z } from 'zod'

const passwordSchema = z.string().min(8, { message: 'At least 8 chatacters.' })

const passwordConfirmSchema = z
  .string()
  .min(8, { message: 'At least 8 chatacters.' })

const emailSchema = z
  .string()
  .min(1, { message: 'Email required.' })
  .email({ message: 'Invalid email.' })

const userNameSchema = z
  .string()
  .min(1, { message: 'Name required.' })
  .min(3, { message: 'Name must be at least 3 characters long.' })
  .max(20, { message: 'Less than 20 characters' })

const createdAtSchema = z.date()

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'password not matched',
        path: ['password'],
      })
    }
  })

export const signUpSchema = z
  .object({
    userName: userNameSchema,
    email: emailSchema,
    password: passwordSchema,
    passwordConfirm: passwordConfirmSchema,
    createdAt: createdAtSchema,
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['passwordConfirm'], // passwordConfirm 필드에 에러 추가
      })
    }
  })

export const checkEmailSchema = z.object({
  email: emailSchema,
})

export type LoginPayload = z.infer<typeof loginSchema>
export type SignUpPayload = z.infer<typeof signUpSchema>
export type UpdatePasswordPayload = z.infer<typeof updatePasswordSchema>
export type CheckEmailPayload = z.infer<typeof checkEmailSchema>
