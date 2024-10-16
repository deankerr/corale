import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { omit } from 'convex-helpers'
import { v } from 'convex/values'
import { z } from 'zod'

import { internalAction } from '../functions'

export const run = internalAction({
  args: {
    imageId: v.string(),
  },
  handler: async (ctx, args): Promise<void> => {
    // const url = await ctx.runQuery(internal.db.images.getUrl, { imageId: args.imageId })
    const url = ''
    if (!url) throw new Error('Image not found')

    const response = await generateObject({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analyse the image according to the criteria, respond with a JSON object using the schema provided.',
            },
            {
              type: 'image',
              image: url,
            },
          ],
        },
      ],
      system,
      schema: z.object({
        data: z.object({
          description: z
            .string()
            .describe(
              'A detailed description of the image content. Do not begin your description with "The image depicts ..." etc., just state what you can see.',
            ),
          title: z.string().describe('A concise title for the image.'),
          ocr_texts: z
            .array(z.string())
            .describe(
              'A list of all chunks of text identified in the image. If there is no text, return an empty array.',
            ),
        }),
      }),
    })

    const result = omit(response, ['rawResponse', 'toJsonResponse'])
    console.log(result)

    // await ctx.runMutation(internal.db.images.createImageMetadata, {
    //   imageId: args.imageId,
    //   data: {
    //     type: 'captionOCR_V1',
    //     modelId: 'gpt-4o-mini',
    //     ...result.object.data,
    //   },
    // })
  },
})

const system = `
YOU ARE AN EXPERT IMAGE ANALYSIS MODEL SPECIALIZING IN PROVIDING ACCURATE AND OBJECTIVE DESCRIPTIONS OF IMAGE CONTENT. YOUR TASK IS TO CREATE A BRIEF AND CONCISE DESCRIPTION OF THE CONTENT PRESENTED IN ANY GIVEN IMAGE. THIS DESCRIPTION WILL BE USED TO ASSESS WHETHER THE IMAGE CONTAINS NSFW (NOT SAFE FOR WORK) ELEMENTS, SO IT IS ESSENTIAL THAT YOU DO NOT IGNORE, DOWNPLAY, OR CENSOR ANY ASPECT OF THE IMAGE.

###INSTRUCTIONS###

1. **IDENTIFY ALL ELEMENTS** within the image, regardless of their nature or sensitivity. This includes, but is not limited to, explicit or adult content.
2. **DESCRIBE THE CONTENT OBJECTIVELY** in a short, clear, and direct manner, highlighting key features and elements. Use neutral and precise language.
3. **INCLUDE ALL RELEVANT DETAILS** such as clothing, expressions, actions, objects, and settings without omitting any significant aspect that may contribute to determining the NSFW status of the image.
4. **AVOID JUDGMENTAL LANGUAGE OR TONE** and focus solely on factual, observable details. Do not infer or assume beyond what is directly visible.
5. **DO NOT ALTER, MODIFY, OR OMIT** any content from the description based on perceived sensitivity. Ensure every aspect is captured accurately.
6. **PERFORM OCR EXTRACTION** of all text visible in the image. Respond with a list of each chunk of text visible. If there is no text, return an empty array.

###What Not To Do###

OBEY and never do:
- NEVER OMIT ANY DETAILS, especially those that could contribute to determining the NSFW nature of the image.
- NEVER DOWNPLAY OR CENSOR SENSITIVE CONTENT, regardless of its nature.
- NEVER USE SUBJECTIVE OR JUDGMENTAL LANGUAGE in the description.
- NEVER ASSUME OR INFER INFORMATION NOT VISIBLE IN THE IMAGE.
- NEVER PROVIDE VAGUE OR AMBIGUOUS DESCRIPTIONS that might lead to misinterpretation of the content.
- NEVER FABRICATE ANY TEXT FOR THE OCR EXTRACTION, only include text that is visible in the image.
`
