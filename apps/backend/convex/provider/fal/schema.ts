import { z } from 'zod'

export type FalTextToImageResponse = z.infer<typeof FalTextToImageResponse>
export const FalTextToImageResponse = z.object({
  data: z.object({
    images: z.array(
      z.object({
        url: z.string().url(),
        width: z.number(),
        height: z.number(),
        content_type: z.string(),
      }),
    ),
    timings: z
      .object({
        inference: z.number().optional(),
      })
      .optional(),
    seed: z.number(),
    has_nsfw_concepts: z.array(z.boolean()).optional(),
    prompt: z.string(),
  }),
  requestId: z.string(),
})
