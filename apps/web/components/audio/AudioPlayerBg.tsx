import { SVGProps } from 'react'

export const AudioPlayerBg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className="main"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    viewBox="0 0 612 459"
    {...props}
  >
    <defs>
      <filter id="blur1" width="120%" height="120%" filterUnits="userSpaceOnUse" x="-10%" y="-10%">
        <feGaussianBlur stdDeviation={75} result="effect1_foregroundBlur" />
      </filter>
    </defs>
    <rect width={612} height={459} fill="#A35829" />
    <g filter="url(#blur1)">
      <circle cy={138} cx={416} r={200} fill="#fc7d58" />
      <circle cy={344} cx={191} r={200} fill="#fc7d58" />
      <circle cy={450} cx={552} r={200} fill="#ff7c24" />
    </g>
  </svg>
)
