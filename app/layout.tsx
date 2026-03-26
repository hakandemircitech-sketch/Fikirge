import type { Metadata } from 'next'
import { Syne, DM_Sans } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  weight: ['400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
})

export const metadata: Metadata = {
  title: 'Fikirge — Fikrinden Markana',
  description:
    'Pazar analizi, rakip haritası, marka kimliği, teknik altyapı — hepsi tek akışta, saniyeler içinde.',
  keywords: ['startup', 'proje', 'pazar analizi', 'marka', 'ai', 'saas'],
  openGraph: {
    title: 'Fikirge',
    description: 'Fikrini yaz. Her şeyini biz oluştururuz.',
    url: 'https://fikirge.com',
    siteName: 'Fikirge',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={`${syne.variable} ${dmSans.variable}`}>
      <body className="font-dm bg-bg text-white antialiased">
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  )
}
