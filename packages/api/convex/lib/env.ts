import { z } from 'zod'

const schema = z.object({
  APP_HOSTNAME: z.string(),
  CLERK_JWT_ISSUER_DOMAIN: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),

  ELEVENLABS_API_KEY: z.string(),
  FAL_KEY: z.string(),
  OPENROUTER_API_KEY: z.string(),
})

export const ENV = schema.parse(process.env)
