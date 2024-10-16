import * as falClient from '@fal-ai/serverless-client'
import * as vb from 'valibot'

import { ENV } from '../lib/env'

falClient.config({
  credentials: ENV.FAL_API_KEY,
})

const Response = vb.object({
  nsfw_probability: vb.number(),
})

export const evaluateNsfwProbability = async (args: { url: string }) => {
  const response = await falClient.subscribe('fal-ai/imageutils/nsfw', {
    input: {
      image_url: args.url,
    },
  })

  const { nsfw_probability } = vb.parse(Response, response)
  return { nsfwProbability: nsfw_probability }
}
