import * as vb from 'valibot'

export const ResourceKey = vb.pipe(
  vb.string(),
  vb.transform((input) => {
    const [endpoint, modelId] = vb.parse(vb.tuple([vb.string(), vb.string()]), input.split('::'))
    return { endpoint, modelId }
  }),
)
