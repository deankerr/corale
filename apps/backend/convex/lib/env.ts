import { z } from 'zod'

type EnvSchema = {
  APP_HOSTNAME: string
  CLERK_JWT_ISSUER_DOMAIN: string
  CLERK_SECRET_KEY: string
  CLERK_WEBHOOK_SECRET: string
  ELEVENLABS_API_KEY: string
  FAL_KEY: string
  OPENROUTER_API_KEY: string
}

const schema = z.object({
  APP_HOSTNAME: z.string(),
  CLERK_JWT_ISSUER_DOMAIN: z.string(),
  CLERK_SECRET_KEY: z.string(),
  CLERK_WEBHOOK_SECRET: z.string(),
  ELEVENLABS_API_KEY: z.string(),
  FAL_KEY: z.string(),
  OPENROUTER_API_KEY: z.string(),
})

export const ENV: EnvSchema =
  process.env.NODE_ENV === 'test'
    ? {
        APP_HOSTNAME: process.env.APP_HOSTNAME ?? 'test.local',
        CLERK_JWT_ISSUER_DOMAIN: '',
        CLERK_SECRET_KEY: '',
        CLERK_WEBHOOK_SECRET: '',
        ELEVENLABS_API_KEY: '',
        FAL_KEY: '',
        OPENROUTER_API_KEY: '',
      }
    : schema.parse(process.env)
