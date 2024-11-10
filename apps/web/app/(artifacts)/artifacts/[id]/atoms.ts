import { atom } from 'jotai'

export type Artifact = {
  type: 'svg' | 'html'
  title: string
  version: string
  content: string
}

export const artifactAtom = atom<Artifact | null>(null)
