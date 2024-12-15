export function truncateString(value: string, maxLength = 80) {
  if (value.length <= maxLength) return value
  return value.slice(0, maxLength - 3) + '...'
}
