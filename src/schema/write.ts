import { z } from 'zod'

export const writeSchema = z
  .object({
    postId: z.string().optional(),
    body: z.string().optional(),
    type: z.enum(['text', 'image', '']).optional(),
    textA: z.string().optional(),
    textB: z.string().optional(),
    imageA: z.instanceof(File).optional(),
    imageB: z.instanceof(File).optional(),
  })
  .superRefine((data, ctx) => {
    const isEdit = !data.postId // postId가 존재하면 편집 모드

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

    // type이 image일 때
    if (data.type === 'image') {
      if (isEdit) {
      } else {
        // 새로 작성 모드: imageA와 imageB 모두 필수
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
    }
  })

export type WritePayload = z.infer<typeof writeSchema>
