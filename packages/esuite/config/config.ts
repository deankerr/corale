const devPrefix = process.env.NODE_ENV === 'development' ? '🔸' : ''

export const appConfig = {
  siteTitle: `${devPrefix}e⋆suite`,
  siteDescription: "it's the e⋆suite",
} as const
