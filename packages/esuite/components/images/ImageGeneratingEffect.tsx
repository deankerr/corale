import { cn } from '@/lib/utils'

export const ImageGeneratingEffect = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={cn(
        'border-gray-a3 pointer-events-none flex aspect-square w-full max-w-full overflow-hidden rounded-xl border',
        className,
      )}
    >
      <div className="animate-shimmerDown from-gold-1 via-gold-3 to-gold-1 absolute bottom-[100%] h-[200%] w-full bg-gradient-to-b"></div>

      <div className="animate-starfieldDown absolute inset-0 bg-[url('/textures/stardust.png')]"></div>
      <div className="animate-starfieldDown absolute -top-full h-full w-full bg-[url('/textures/stardust.png')]"></div>

      <div className="absolute flex h-[700px] w-[700px] bg-[url('/noise.svg')]"></div>
    </div>
  )
}
