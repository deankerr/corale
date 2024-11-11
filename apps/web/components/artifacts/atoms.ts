import { atom } from 'jotai'
import type { Artifact } from './types'

export const htmlTextAtom = atom('')

export const artifactDisplayAtom = atom<Artifact | undefined>()
