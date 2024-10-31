import { getConvexSiteUrl } from '@/lib/utils'

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (src.startsWith('http')) return `${src}?w=${width}`
  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
    return `${getConvexSiteUrl()}/i/${src}?w=${width}`
  }
  return `${src}?w=${width}`
}
