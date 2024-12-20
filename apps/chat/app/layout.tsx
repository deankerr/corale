import '@corale/ui/globals.css'
import { ConvexClientProvider } from '@/components/convex-client-provider'
import { ThemeProvider } from '@corale/ui/components/theme-provider'
import { Provider as JotaiProvider } from 'jotai'
import type { Metadata } from 'next'
import localFont from 'next/font/local'

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
})
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
})

export const metadata: Metadata = {
  title: 'corale chat',
  description: 'corale chat',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConvexClientProvider>
          <JotaiProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
            </ThemeProvider>
          </JotaiProvider>
        </ConvexClientProvider>
      </body>
    </html>
  )
}
