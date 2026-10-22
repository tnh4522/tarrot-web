import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MysticTarot AI - Xem Bói Tarot Online Tích Hợp AI',
  description:
    'Khám phá tương lai và nhận sự hướng dẫn từ vũ trụ qua những lá bài Tarot được phân tích bởi AI thông minh. Bói bài Tarot online miễn phí, chính xác và sâu sắc.',
  keywords: ['tarot', 'bói bài', 'tarot online', 'AI tarot', 'xem bói', 'tâm linh', 'bói tarot miễn phí'],
  openGraph: {
    title: 'MysticTarot AI - Xem Bói Tarot Online Tích Hợp AI',
    description: 'Nhận sự hướng dẫn từ vũ trụ qua bài Tarot và AI thông minh',
    type: 'website',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
