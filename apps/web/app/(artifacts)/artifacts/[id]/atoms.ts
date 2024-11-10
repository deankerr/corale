import { atom } from 'jotai'

export const artifactAtom = atom<{ type: 'svg' | 'html'; content: string } | null>(null)
