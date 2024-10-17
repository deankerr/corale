import { atom } from 'jotai'

export type NextJsSlide = {
  type: 'image'
  src: string
  width: number
  height: number
  imageFit?: 'contain' | 'cover'
  blurDataURL?: string
}

export const lightboxSlidesAtom = atom<NextJsSlide[]>([])
export const lightboxOpenAtom = atom<boolean | undefined>(undefined)
