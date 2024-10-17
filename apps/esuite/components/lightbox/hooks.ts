import { useSetAtom } from 'jotai'

import { lightboxOpenAtom, lightboxSlidesAtom } from './atoms'

import type { NextJsSlide } from '@corale/esuite/components/lightbox/atoms'

export const useLightbox = () => {
  const setLightboxOpen = useSetAtom(lightboxOpenAtom)
  const setLightboxSlides = useSetAtom(lightboxSlidesAtom)

  return ({ slides, index }: { slides: NextJsSlide[]; index: number }) => {
    const slidesRotatedToIndex = [...slides.slice(index), ...slides.slice(0, index)]
    setLightboxSlides(slidesRotatedToIndex)
    setLightboxOpen(true)
  }
}
