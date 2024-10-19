import 'yet-another-react-lightbox/styles.css'
import Image, { StaticImageData } from 'next/image'
import LightboxComponent, {
  isImageFitCover,
  isImageSlide,
  LightboxExternalProps,
  RenderSlideProps,
  Slide,
  useLightboxProps,
  useLightboxState,
} from 'yet-another-react-lightbox'
import imageLoader from '../images/image-loader'

/**
 * The purpose of this intermediate component is to load the Lightbox and
 * its CSS dynamically only when the lightbox becomes interactive
 */
export default function Lightbox(props: Omit<LightboxExternalProps, 'plugins'>) {
  return <LightboxComponent render={{ slide: NextJsImage }} {...props} />
}

function NextJsImage({ slide, offset, rect }: RenderSlideProps) {
  const {
    on: { click },
    carousel: { imageFit },
  } = useLightboxProps()

  const { currentIndex } = useLightboxState()

  const cover = isImageSlide(slide) && isImageFitCover(slide, imageFit)

  if (!isNextJsImage(slide)) return undefined

  const width = !cover ? Math.round(Math.min(rect.width, (rect.height / slide.height) * slide.width)) : rect.width

  const height = !cover ? Math.round(Math.min(rect.height, (rect.width / slide.width) * slide.height)) : rect.height

  return (
    <div style={{ position: 'relative', width, height }}>
      <Image
        fill
        alt=""
        src={slide}
        loading="eager"
        draggable={false}
        placeholder={slide.blurDataURL ? 'blur' : undefined}
        blurDataURL={slide.blurDataURL}
        style={{
          objectFit: cover ? 'cover' : 'contain',
          cursor: click ? 'pointer' : undefined,
        }}
        sizes={`${Math.ceil((width / window.innerWidth) * 100)}vw`}
        onClick={offset === 0 ? () => click?.({ index: currentIndex }) : undefined}
        loader={imageLoader}
      />
    </div>
  )
}

function isNextJsImage(slide: Slide): slide is StaticImageData {
  return isImageSlide(slide) && typeof slide.width === 'number' && typeof slide.height === 'number'
}
