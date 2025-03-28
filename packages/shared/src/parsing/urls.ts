const urlRegex = /https?:\/\/[^\s]+/g

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.tiff', '.avif'])

export function createURL(url: string | URL, base?: string | URL): URL | undefined {
  try {
    return new URL(url, base)
  } catch (error) {
    return undefined
  }
}

export function parseURLsFromString(input: string): URL[] {
  const matches = input.match(urlRegex)
  if (!matches) return []
  return matches.map((match) => createURL(match)).filter((url) => url !== undefined)
}

export function isIPAddress(input: URL | string): boolean {
  const url = createURL(input)
  if (!url) return false

  const hostname = url.hostname
  const isLikeIPV4 = hostname.split('.').every((part) => !isNaN(Number(part)))
  const isLikeIPV6 = hostname.includes(':') || hostname.includes('[')

  return isLikeIPV4 || isLikeIPV6
}

export function isImageURL(input: URL | string): boolean {
  const url = createURL(input)
  if (!url) return false

  const pathname = url.pathname.toLowerCase()
  return [...imageExtensions].some((ext) => pathname.endsWith(ext))
}
