import './globals.css'

import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'
import { cn, environment } from '@corale/esuite/app/lib/utils'
import { AppShell } from '@corale/esuite/components/layout/AppShell'
import { LightboxProvider } from '@corale/esuite/components/lightbox/LightboxProvider'
import { ClientProviders } from '@corale/esuite/components/util/ClientProviders'
import { TailwindBreakpointIndicator } from '@corale/esuite/components/util/TailwindBreakpointIndicator'
import { appConfig } from '@corale/esuite/config/config'
import { OpenPanelComponent } from '@openpanel/nextjs'
import { Theme } from '@radix-ui/themes'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Toaster } from 'sonner'

import type { Metadata, Viewport } from 'next'

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn('overscroll-none', sans.variable, mono.variable)}>
      <body>
        <ClerkProvider appearance={{ baseTheme: dark }}>
          <ClientProviders>
            <Theme
              accentColor="orange"
              grayColor="slate"
              appearance="dark"
              panelBackground="solid"
              className="bg-midnight"
            >
              <AppShell>{children}</AppShell>
              <Toaster position="top-right" theme="light" expand visibleToasts={5} richColors />
              <LightboxProvider />
            </Theme>
          </ClientProviders>
        </ClerkProvider>
        <TailwindBreakpointIndicator />
        <Analytics />
      </body>
    </html>
  )
}

const Analytics = () => {
  if (environment !== 'prod') return null
  return (
    <>
      <SpeedInsights />
      <OpenPanelComponent
        clientId="6f2e9c18-cc3c-49d1-a2ac-9e482c2e4a66"
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
      />
    </>
  )
}
