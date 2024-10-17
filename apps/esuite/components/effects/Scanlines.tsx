import type { SVGProps } from 'react'

export const Scanlines = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props}>
    <pattern id="myPattern" patternUnits="userSpaceOnUse" width="10" height="7">
      <line x1="0" y="0" x2="10" y2="0" stroke="currentColor" strokeWidth="1" />
    </pattern>

    <rect id="myRect" x="0" y="0" width="100%" height="100%" fill="url(#myPattern)" />
  </svg>
)
