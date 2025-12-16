import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        <footer className="mt-auto border-t border-border bg-card py-6">
          <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8 space-y-1">
            <p className="text-sm text-muted-foreground">© 2025 TP.COM All rights reserved.</p>
            <p className="text-xs font-semibold tracking-wide text-foreground">#MoreTogether</p>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  )
}
