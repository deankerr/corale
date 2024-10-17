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

const data = [
  {
    modelId: 'fal-ai/flux/dev',
    coverImage: 'https://storage.googleapis.com/falserverless/gallery/flux-dev-thumb.webp',
    name: 'FLUX.1 [dev]',
    description: 'FLUX.1, a 12B parameters text-to-image model with outstanding aesthetics.',
    creatorName: 'Black Forest Labs',
    link: 'https://fal.ai/models/fal-ai/flux/dev',
    pricing: {
      type: 'perMegapixel',
      value: '0.025',
    },
    inputs: {
      loras: true,
    },
  },
  {
    modelId: 'fal-ai/flux/schnell',
    coverImage: 'https://storage.googleapis.com/falserverless/gallery/flux-schnell-thumb.webp',
    name: 'FLUX.1 [schnell]',
    description: 'A distilled version of FLUX.1 that operates up to 10 times faster.',
    creatorName: 'Black Forest Labs',
    link: 'https://fal.ai/models/fal-ai/flux/schnell',
    pricing: {
      type: 'perMegapixel',
      value: '0.003',
    },
  },
  {
    modelId: 'fal-ai/flux-pro',
    coverImage: 'https://storage.googleapis.com/falserverless/gallery/flux-pro-thumb.webp',
    name: 'FLUX.1 [pro]',
    description: 'The pro version of FLUX.1, served in partnership with BFL.',
    creatorName: 'Black Forest Labs',
    link: 'https://fal.ai/models/fal-ai/flux-pro',
    pricing: {
      type: 'perMegapixel',
      value: '0.05',
    },
    inputs: {
      maxQuantity: 1,
    },
  },
  {
    modelId: 'fal-ai/aura-flow',
    coverImage: 'https://v2.fal.media/files/ca17a9704d9f4d6eb1ff0c1c9526e897_b1abc7da53e949698e9c8186963f80c4.png',
    name: 'AuraFlow',
    description: 'Fully open flow-based text to image model.',
    creatorName: 'fal.ai',
    link: 'https://fal.ai/models/fal-ai/aura-flow',
    pricing: {
      type: 'perSecond',
      value: '0.00111',
    },
    inputs: {
      maxQuantity: 2,
      sizes: [
        {
          name: 'square',
          width: 1024,
          height: 1024,
        },
      ],
    },
  },
  {
    modelId: 'fal-ai/stable-diffusion-v3-medium',
    coverImage: 'https://storage.googleapis.com/falserverless/landing/sd3-sample-03.webp',
    name: 'Stable Diffusion V3',
    description: 'Run SD3 at the speed of light.',
    creatorName: 'Stability AI',
    link: 'https://fal.ai/models/fal-ai/stable-diffusion-v3-medium',
    pricing: {
      type: 'perRequest',
      value: '0.035',
    },
    inputs: {
      maxQuantity: 1,
      negativePrompt: true,
    },
  },
  {
    modelId: 'fal-ai/fast-lightning-sdxl',
    coverImage: 'https://storage.googleapis.com/falserverless/gallery/stable-diffusion-xl-lightning.webp',
    coverImageAnimated:
      'https://storage.googleapis.com/falserverless/gallery/stable-diffusion-xl-lightning-animated.webp',
    name: 'SDXL Lightning',
    description: 'Run SDXL at the speed of light.',
    creatorName: 'Stability AI + Bytedance',
    link: 'https://fal.ai/models/stable-diffusion-xl-lightning',
    pricing: {
      type: 'perSecond',
      value: '0.00111',
    },
  },
  {
    modelId: 'fal-ai/hyper-sdxl',
    coverImage: 'https://fal.media/files/kangaroo/LM0fy_9qT_8FlKrWhR7Zt.jpeg',
    name: 'Hyper SDXL',
    description: "Hyper-charge SDXL's performance and creativity.",
    creatorName: 'Stability AI + Bytedance',
    link: 'https://fal.ai/models/hyper-sdxl',
    pricing: {
      type: 'perSecond',
      value: '0.00111',
    },
  },
  {
    modelId: 'fal-ai/pixart-sigma',
    coverImage: 'https://storage.googleapis.com/falserverless/gallery/pixart-sigma.jpeg',
    name: 'PixArt-Σ',
    description: 'Weak-to-Strong Training of Diffusion Transformer for 4K Text-to-Image Generation.',
    link: 'https://fal.ai/models/pixart-sigma',
    pricing: {
      type: 'perSecond',
      value: '0.000575',
    },
    inputs: {
      negativePrompt: true,
    },
  },
]

export const imageModels = data.map((model) => ({
  ...model,
  inputs: {
    ...defaultImageModelInputs,
    ...model.inputs,
  },
}))
