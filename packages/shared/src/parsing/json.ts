export function parseJSON(input: string): unknown {
  try {
    return JSON.parse(input)
  } catch (error) {
    return undefined
  }
}
