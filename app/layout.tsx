import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'WhisperMap - Anonymous Location-Based Messages',
  description: 'Share and discover anonymous whispers from people nearby',
  manifest: '/manifest.json',
  icons: {
    icon: '/assets/images/anonymous-man.jpg',
    apple: '/assets/images/anonymous-man.jpg',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#3C1E4F' },
    { media: '(prefers-color-scheme: dark)', color: '#0D1B2A' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <Analytics />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
