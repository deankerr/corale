import { SVGProps, useId } from 'react'

const stop1 = 'hsl(var(--rx-orange-8))'
const stop2 = 'hsl(var(--rx-orange-10))'

export const AppLogoIconSquare = ({
  gradientType,
  stopColor1 = stop1,
  stopColor2 = stop2,
  ...props
}: SVGProps<SVGSVGElement> & {
  gradientType?: 'linear' | 'radial'
  stopColor1?: string
  stopColor2?: string
}) => {
  const gradientId = useId()

  return (
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" {...props}>
      <defs>
        {gradientType === 'radial' ? (
          <radialGradient id={gradientId} fx="25%" fy="25%">
            <stop offset="0%" stopColor={stopColor1} />
            <stop offset="100%" stopColor={stopColor2} />
          </radialGradient>
        ) : (
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={stopColor1} />
            <stop offset="100%" stopColor={stopColor2} />
          </linearGradient>
        )}
      </defs>

      {/* Rounded square background */}
      <rect x="0" y="0" width="32" height="32" rx="4" fill={`url(#${gradientId})`} />

      {/* Original logo paths, centered in the square */}
      <g fill="white" transform="matrix(0.024, 0, 0, 0.024, 1.1, 1.1)">
        <path d="m1097.4 847.32h-994.8c-10.078 0-18.238 8.2812-18.238 18.238 0 10.078 8.2812 18.121 18.238 18.121h994.92c10.078 0 18.238-8.1602 18.238-18.121 0-10.078-8.2812-18.238-18.363-18.238z" />
        <path d="m999.24 969.36h-798.48c-10.078 0-18.238 8.2812-18.238 18.238 0 10.078 8.2812 18.238 18.238 18.238h798.36c10.078 0 18.238-8.2812 18.238-18.238 0.12109-9.957-8.1602-18.238-18.121-18.238z" />
        <path d="m753.6 1091.5h-307.2c-10.078 0-18.238 8.1602-18.238 18.121 0 10.078 8.2812 18.238 18.238 18.238h307.2c10.078 0 18.238-8.2812 18.238-18.238 0.125-9.9609-8.1562-18.121-18.234-18.121z" />
        <path d="m97.801 759.36c0.48047 1.3203 1.8008 2.2812 3.4805 2.2812h997.56c1.5586 0 3-0.96094 3.4805-2.2812 5.3984-16.32 9.9609-32.762 13.441-49.078 8.2812-36.602 12.359-74.762 12.359-113.28 0-145.08-58.32-280.2-164.04-380.28-99.363-93.957-227.52-144.72-363.72-144.72-10.199 0-20.398 0.23828-30.602 0.83984-282.6 15.602-505.92 257.76-497.52 539.88 0.96094 33 5.0391 65.762 12.121 97.441 3.4805 16.441 8.0391 32.879 13.441 49.199z" />
      </g>
    </svg>
  )
}
