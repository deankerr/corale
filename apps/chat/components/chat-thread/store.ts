import { parseJSON } from '@corale/shared/parsing/json'
import { useAtom } from 'jotai'
import { atomWithStorage } from 'jotai/utils'
import { useMemo } from 'react'

export function readInputAtom(id: string, name: string) {
  const key = `e-chat-input-${id}-${name}`
  const value = localStorage.getItem(key)
  if (!value) return ''
  const json = parseJSON(value)
  return typeof json === 'string' ? json : ''
}

export function clearInputAtom(id: string, name: string) {
  const key = `e-chat-input-${id}-${name}`
  localStorage.removeItem(key)
}

export const useInputAtom = (id: string, name: string, initialValue = '') => {
  const key = `e-chat-input-${id}-${name}`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const atom = useMemo(() => atomWithStorage(key, initialValue), [key])
  return useAtom(atom)
}
