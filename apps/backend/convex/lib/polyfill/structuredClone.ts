import structuredClone from '@ungap/structured-clone'

export function polyfillStructuredClone() {
  if (!('structuredClone' in globalThis)) {
    globalThis.structuredClone = structuredClone
  }
}
