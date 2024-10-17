import { cn } from '@/app/lib/utils'

export const ImageGeneratingEffect = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'pointer-events-none flex aspect-square w-full max-w-full overflow-hidden rounded-xl border border-grayA-3',
        className,
      )}
    >
      <div className="absolute bottom-[100%] h-[200%] w-full animate-shimmerDown bg-gradient-to-b from-gold-1 via-gold-3 to-gold-1"></div>

      <div className="absolute inset-0 animate-starfieldDown bg-[url('/textures/stardust.png')]"></div>
      <div className="absolute -top-full h-full w-full animate-starfieldDown bg-[url('/textures/stardust.png')]"></div>

      <div className="absolute flex h-[700px] w-[700px] bg-[url('/noise.svg')]"></div>
    </div>
  )
}
