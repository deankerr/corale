'use client'

import { forwardRef } from 'react'
import { cn } from '@corale/esuite/app/lib/utils'
import NextImage from 'next/image'

import imageLoader from './image-loader'

import type { EImage } from '@corale/api/convex/types'

type Props = { image: EImage } & Partial<React.ComponentPropsWithoutRef<typeof NextImage>>

export const IImage = forwardRef<HTMLImageElement, Props>(
  ({ image, className, children, ...props }, ref) => {
    return (
      <div
        style={{
          aspectRatio: `${image.width} / ${image.height}`,
        }}
        className="max-h-full w-full overflow-hidden"
      >
        <NextImage
          alt=""
          src={`/i/${image.id}`}
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
  },
)
IImage.displayName = 'IImageBordered'
