'use client'

import { cn } from '@/lib/utils'
import type { Image } from '@corale/api'
import NextImage from 'next/image'
import { forwardRef } from 'react'
import imageLoader from './image-loader'

type Props = { image: Image } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>

export const IImage = forwardRef<HTMLImageElement, Props>(({ image, className, children, ...props }, ref) => {
  return (
    <div
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
      }}
      className="max-h-full w-full overflow-hidden"
    >
      <NextImage
        alt=""
        src={`/i/${image.xid}`}
        placeholder={image?.blurDataUrl ? 'blur' : 'empty'}
        blurDataURL={image?.blurDataUrl}
        width={image.width}
        height={image.height}
        className={cn('h-full w-full object-contain', className)}
        {...props}
        ref={ref}
        loader={imageLoader}
      />
      {children}
    </div>
  )
})
IImage.displayName = 'IImageBordered'
