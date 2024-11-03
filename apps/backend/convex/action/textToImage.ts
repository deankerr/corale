import { ApiError, fal, ValidationError } from '@fal-ai/client'
import { generateObject } from 'ai'
import { omit } from 'convex-helpers'
import { v } from 'convex/values'
import { z } from 'zod'
import { internal } from '../_generated/api'
import type { TextToImageInputs } from '../entities/types'
import { internalAction } from '../functions'
import { createAIProvider } from '../lib/ai'
import { getErrorMessage } from '../lib/utils'
import { defaultSizes, imageModels } from '../provider/fal/models'
import { FalTextToImageResponse } from '../provider/fal/schema'

export const run = internalAction({
  args: {
    generationId: v.id('generations_v2'),
  },
  handler: async (ctx, { generationId }): Promise<void> => {
    try {
      const generation = await ctx.runMutation(internal.entities.generations.internal.activate, {
        generationId,
      })
      const runConfig = generation.input as TextToImageInputs

      const image_size =
        runConfig.workflow === 'generate_dimensions'
          ? await generateDimensions({
              prompt: runConfig.prompt,
            })
          : runConfig.width && runConfig.height
            ? {
                width: runConfig.width,
                height: runConfig.height,
              }
            : getSize(runConfig.size ?? 'square', runConfig.modelId)

      const input = {
        prompt: runConfig.prompt,
        negative_prompt: runConfig.negativePrompt,
        num_images: runConfig.n,
        image_size,
        seed: runConfig.seed,
        guidance_scale: runConfig.guidanceScale,
        steps: runConfig.steps,
        loras: runConfig.loras,
        enable_safety_checker: false,
      }

      let model = runConfig.modelId
      if (runConfig.modelId === 'fal-ai/flux/dev' && input?.loras && input.loras.length > 0) {
        model = 'fal-ai/flux-lora'
      }
      console.log(model, input)

      const response = await fal.subscribe(model, {
        input,
      })
      console.log('response', response)
      const output = FalTextToImageResponse.parse(response)

      await ctx.runMutation(internal.entities.generations.internal.complete, {
        generationId,
        results: output.data.images.map((image) => ({
          url: image.url,
          width: image.width,
          height: image.height,
          contentType: 'image',
        })),
        output,
      })
    } catch (err) {
      console.error(err)

      if (err instanceof ApiError) {
        if ('detail' in err.body && typeof err.body.detail === 'string') {
          const message = `[API Error] ${err.message}: ${err.body.detail}`
          await ctx.runMutation(internal.entities.generations.internal.fail, {
            generationId,
            errors: [{ message, code: 'api_error', status: err.status }],
          })
          return
        }
      }

      if (err instanceof ValidationError) {
        const message = `[Validation Error] ${err.message}: ${err.fieldErrors.map((e) => `${e.loc.join('.')}: ${e.msg}`).join('; ')}`
        await ctx.runMutation(internal.entities.generations.internal.fail, {
          generationId,
          errors: [{ message, code: 'validation_error', status: err.status }],
        })
        return
      }

      await ctx.runMutation(internal.entities.generations.internal.fail, {
        generationId,
        errors: [{ message: getErrorMessage(err), code: 'unknown', status: 500 }],
      })
    }
  },
})

const getSize = (size: string, modelId: string) => {
  const model = imageModels.find((model) => model.modelId === modelId)
  return model?.inputs.sizes.find((s) => s.name === size)
}

const generateDimensions = async (args: { prompt: string }) => {
  const model = createAIProvider({ id: 'anthropic/claude-3-haiku:beta' })

  const response = await generateObject({
    model,
    system:
      'You will be given a prompt that has been entered by a user for image generation. Respond with a JSON object containing a recommended dimensions for the image, being square, portrait, or landscape. If it is unclear what the user is asking for, use your best judgement to choose the most appropriate dimensions.',
    schema: z.object({
      dimensions: z.enum(['square', 'portrait', 'landscape']).describe('The recommended dimensions for the image.'),
    }),
    messages: [
      {
        role: 'user',
        content: args.prompt,
      },
    ],
  })

  const result = omit(response, ['rawResponse', 'toJsonResponse'])
  console.log(result)

  return defaultSizes.find((size) => size.name === result.object.dimensions)
}
