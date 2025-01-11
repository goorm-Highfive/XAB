import { z } from 'zod'

export const writeSchema = z
  .object({
    body: z.string().optional(),
    type: z.enum(['text', 'image'], undefined).optional(),
    textA: z.string().optional(),
    textB: z.string().optional(),
    imageA: z.instanceof(File).optional(),
    imageB: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    // type이 없는 경우, body 필수
    if (!data.type && !((data.body?.trim().length ?? 0) > 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          'If you do not choose a survey option type, you must write the text',
        path: ['body'],
      })
    }

    // type이 text일 때 textA와 textB 필수
    if (data.type === 'text') {
      if (!((data.textA?.trim().length ?? 0) > 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'textA is required when type is "text"',
          path: ['textA'],
        })
      }
      if (!((data.textB?.trim().length ?? 0) > 0)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'textB is required when type is "text"',
          path: ['textB'],
        })
      }
    }

    // type이 image -> imageA, imageB 필수
    if (data.type === 'image') {
      if (!data.imageA) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'imageA is required when type is "image"',
          path: ['imageA'],
        })
      }
      if (!data.imageB) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'imageB is required when type is "image"',
          path: ['imageB'],
        })
      }
    }
  })

export type WritePayload = z.infer<typeof writeSchema>
