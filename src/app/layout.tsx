import type { Metadata, Viewport } from 'next'
import { Noto_Sans_JP, DM_Mono } from 'next/font/google'
import './globals.css'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
  variable: '--font-zen',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ダイエット習慣ログ',
  description: '毎日の食習慣を記録して、健康的な体づくりをサポート',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4e7c4e',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja" className={`${notoSansJP.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-cream min-h-screen antialiased">
        {children}
      </body>
    </html>
  )
}
