import * as vb from 'valibot'

const schema = vb.object({
  APP_HOSTNAME: vb.string(),
  CLERK_JWT_ISSUER_DOMAIN: vb.string(),
  CLERK_SECRET_KEY: vb.string(),
  CLERK_WEBHOOK_SECRET: vb.string(),
  WORKERS_IMAGE_CLASSIFICATION_URL: vb.string(),
  WORKERS_API_KEY: vb.string(),
  // * endpoint keys
  ELEVENLABS_API_KEY: vb.string(),
  FAL_API_KEY: vb.string(),
  OPENAI_API_KEY: vb.string(),
  OPENROUTER_API_KEY: vb.string(),
})

export const ENV = vb.parse(schema, process.env)
