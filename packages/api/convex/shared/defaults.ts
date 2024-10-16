export const defaultSizes = [
  {
    name: 'portrait',
    width: 832,
    height: 1216,
  },
  {
    name: 'square',
    width: 1024,
    height: 1024,
  },
  {
    name: 'landscape',
    width: 1216,
    height: 832,
  },
]

export const defaultImageModelInputs = {
  negativePrompt: false,
  loras: false,
  maxQuantity: 4,
  sizes: defaultSizes,
}

export const defaultImageModel = 'fal-ai/flux/dev'
