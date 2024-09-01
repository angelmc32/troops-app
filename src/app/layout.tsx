import '@/styles/globals.css'

import { type Metadata } from 'next'
import { Inter } from 'next/font/google'

import { cn } from '@/lib/utils'
import { Toaster } from '@/components/ui/sonner'
import OnchainProvider from '@/providers/onchainProvider'

export const metadata: Metadata = {
  title: 'troops',
  description: 'a third space for onchain communities',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          fontSans.variable,
        )}
      >
        <OnchainProvider>
          {children}
          <Toaster richColors />
        </OnchainProvider>
      </body>
    </html>
  )
}
