import svgToDataUri from 'mini-svg-data-uri'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

import radixColors from './config/radix-colors'

import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  plugins: [
    require('@tailwindcss/container-queries'),
    require('tailwindcss-animated'),
    require('tailwindcss-animate'),
    plugin(({ addBase }) => {
      // css reset
      addBase({
        '*': { position: 'relative', minWidth: '0' },
      })
    }),
    plugin(({ addComponents }) => {
      // flex utilities
      addComponents({
        '.flex-start': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'flex-start',
          'align-items': 'center',
        },
        '.flex-center': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.flex-end': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'flex-end',
          'align-items': 'center',
        },
        '.flex-between': {
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'space-between',
          'align-items': 'center',
        },
        '.flex-col-start': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-start',
          'align-items': 'center',
        },
        '.flex-col-center': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'center',
          'align-items': 'center',
        },
        '.flex-col-end': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'flex-end',
          'align-items': 'center',
        },
        '.flex-col-between': {
          display: 'flex',
          'flex-direction': 'column',
          'justify-content': 'space-between',
          'align-items': 'center',
        },
      })
    }),
    plugin(function ({ matchUtilities }: any) {
      // svg backgrounds
      matchUtilities(
        {
          'bg-grid': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-grid-small': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="8" height="8" fill="none" stroke="${value}"><path d="M0 .5H31.5V32"/></svg>`,
            )}")`,
          }),
          'bg-dot': (value: any) => ({
            backgroundImage: `url("${svgToDataUri(
              `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="16" height="16" fill="none"><circle fill="${value}" id="pattern-circle" cx="10" cy="10" r="1.6257413380501518"></circle></svg>`,
            )}")`,
          }),
        },
        { values: radixColors.hex, type: 'color' },
      )
    }),
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: '#000000',
      white: '#ffffff',

      // radix themes
      ...radixColors.css,
      surface: 'var(--color-surface)',
      overlay: 'var(--color-overlay)',
      'panel-solid': 'var(--color-panel-solid)',
      'panel-translucent': 'var(--color-panel-translucent)',
      midnight: '#090909',

      // shadcn/ui
      border: radixColors.css.gray[5],
      input: radixColors.css.gray[6],
      ring: 'var(--focus-8)',
      background: radixColors.css.gray[1],
      foreground: radixColors.css.gray[12],
      primary: {
        DEFAULT: radixColors.css.accent[9],
        foreground: radixColors.css.gray[12],
      },
      secondary: {
        DEFAULT: radixColors.css.gray[3],
        foreground: radixColors.css.gray[12],
      },
      destructive: {
        DEFAULT: radixColors.css.gray[3],
        foreground: radixColors.css.gray[12],
      },
      muted: {
        DEFAULT: radixColors.css.gray[3],
        foreground: radixColors.css.gray[12],
      },
      popover: {
        DEFAULT: radixColors.css.gray[2],
        foreground: radixColors.css.gray[12],
      },
      card: {
        DEFAULT: radixColors.css.gray[2],
        foreground: radixColors.css.gray[12],
      },
      accent: {
        ...radixColors.css.accent,
        DEFAULT: radixColors.css.gray[3],
        foreground: radixColors.css.gray[12],
      },
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    screens: {
      // radix themes breakpoints
      sm: '520px', // Phones (landscape)
      md: '768px', // Tablets (portrait)
      lg: '1024px', // Tablets (landscape)
      xl: '1280px', // Laptops
      '2xl': '1640px', // Desktops
    },

    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      borderColor: {
        DEFAULT: 'var(--gray-5)',
      },
      containers: {
        '2xs': '16rem',
      },
      fontFamily: {
        sans: ['var(--font-sans)', ...fontFamily.sans],
        mono: ['var(--font-mono)', ...fontFamily.mono],
      },
      fontSize: {
        xxs: ['0.625rem', '0.75rem'],
      },
      maxWidth: {
        '8xl': '96rem',
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        shimmerDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(150%)' },
        },
        starfieldDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(100%)' },
        },
        scanlinesDown: {
          from: { transform: 'translateY(0)' },
          to: { transform: 'translateY(10%)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        shimmerDown: 'shimmerDown 8s linear infinite',
        starfieldDown: 'starfieldDown 20s linear infinite',
        scanlinesDown: 'scanlinesDown 20s linear infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
}

export default config
