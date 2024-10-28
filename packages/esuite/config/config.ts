const devPrefix =
  process.env.NODE_ENV === 'development' ? '🔧' : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? '🔸' : ''

export const appConfig = {
  siteTitle: `${devPrefix}e⋆suite`,
  siteDescription: "it's the e⋆suite",
} as const

export const imageModelConfig = {
  defaultModel: 'fal-ai/flux/dev',
  defaultInputs: {
    negativePrompt: false,
    loras: false,
    maxQuantity: 4,
    sizes: [
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
    ],
  },
}
