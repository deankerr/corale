const devImageUrl = process.env.NEXT_PUBLIC_DEV_IMAGE_URL

export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (src.startsWith('http')) return `${src}?w=${width}`
  if (devImageUrl) return `${devImageUrl}${src}?w=${width}&dev=true`
  return `${src}?w=${width}`
}
