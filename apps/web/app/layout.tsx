import { LightboxProvider } from '@/components/lightbox/LightboxProvider'
import { ClientProviders } from '@/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@/components/util/TailwindBreakpointIndicator'
import { appConfig } from '@/config/config'
import { cn } from '@/lib/utils'
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { OpenPanelComponent } from '@openpanel/nextjs'
import { Theme } from '@radix-ui/themes'
import { SpeedInsights } from '@vercel/speed-insights/next'
import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: `${appConfig.siteTitle} · %s`,
    default: `${appConfig.siteTitle}`,
  },
  description: appConfig.siteDescription,
}

export const viewport: Viewport = {
  themeColor: '#090909',
  colorScheme: 'dark',
}

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
})

const isProd = process.env.NODE_ENV === 'production'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('overscroll-none', sans.variable, mono.variable)}>
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }} dynamic>
          <NuqsAdapter>
            <ClientProviders>
              <Theme
                accentColor="orange"
                grayColor="slate"
                appearance="dark"
                panelBackground="solid"
                className="bg-midnight"
              >
                {children}
                <Toaster position="top-right" theme="light" expand visibleToasts={5} richColors />
                <LightboxProvider />
              </Theme>
            </ClientProviders>
          </NuqsAdapter>
        </ClerkProvider>
        <TailwindBreakpointIndicator />
        <SpeedInsights />
        <OpenPanelComponent
          clientId="6f2e9c18-cc3c-49d1-a2ac-9e482c2e4a66"
          trackScreenViews={isProd}
          trackOutgoingLinks={isProd}
          trackAttributes={true}
        />
      </body>
    </html>
  )
}
