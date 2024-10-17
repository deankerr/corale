'use client'

import { lightboxOpenAtom, lightboxSlidesAtom } from '@corale/esuite/components/lightbox/atoms'
import { useAtom, useAtomValue } from 'jotai'
import dynamic from 'next/dynamic'

const Lightbox = dynamic(() => import('./Lightbox'))

export const LightboxProvider = () => {
  const [open, setOpen] = useAtom(lightboxOpenAtom)
  const slides = useAtomValue(lightboxSlidesAtom)

  return (
    open !== undefined && (
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
        styles={{ root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, .8)' } }}
        controller={{ closeOnBackdropClick: true }}
      />
    )
  )
}
