import { ConvexError } from 'convex/values'
import type { EMessage } from '../types'

export function getMessageName(message: EMessage) {
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  if (message.role === 'system') return 'System'
  return 'Assistant'
}

export function getURLIfValid(url: string) {
  try {
    return new URL(url)
  } catch {
    return null
  }
}

export function getAppHostname() {
  const hostname = process.env.NEXT_PUBLIC_APP_HOSTNAME ?? process.env.APP_HOSTNAME
  if (!hostname) throw new ConvexError('APP_HOSTNAME is not set')
  return hostname
}

export function extractValidUrlsFromText(text: string): URL[] {
  const ignoredUrls = [getAppHostname(), 'www.w3.org/2000/svg']

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const matches = text.match(urlRegex) || []
  return matches
    .map(getURLIfValid)
    .filter((url): url is URL => url !== null && !ignoredUrls.some((ignored) => url.href.includes(ignored)))
}

export function hasDelimiter(text: string) {
  return text.includes('\n') || text.includes('.') || text.includes('?') || text.includes('!') || text.length >= 200
}
