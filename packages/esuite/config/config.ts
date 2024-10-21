const devPrefix =
  process.env.NODE_ENV === 'development' ? '🔧' : process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview' ? '🔸' : ''

export const appConfig = {
  siteTitle: `${devPrefix}e⋆suite`,
  siteDescription: "it's the e⋆suite",
} as const
