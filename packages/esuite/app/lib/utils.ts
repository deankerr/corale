import { clsx } from 'clsx'
import { createTwc } from 'react-twc'
import { twMerge } from 'tailwind-merge'

import type { ClassValue } from 'clsx'

export type { ClassNameValue } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const twx = createTwc({ compose: cn })

function getEnvironment() {
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'production') return 'prod'
  if (process.env.NEXT_PUBLIC_VERCEL_ENV === 'preview') return 'prev'
  if (process.env.NODE_ENV === 'development') return 'dev'
  return 'prod'
}
export const environment = getEnvironment()

export function getConvexSiteUrl() {
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL
  if (!convexUrl) throw new Error('NEXT_PUBLIC_CONVEX_URL is undefined')
  return convexUrl.replace('.cloud', '.site')
}
