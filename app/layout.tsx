import type { Metadata } from 'next'
import './globals.css'
import Providers from '@/components/Providers'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Khoj - AI-Powered Bengali Fact Checking Platform',
  description: 'বাংলা ভাষায় সত্যতা যাচাইয়ের জন্য AI-চালিত প্ল্যাটফর্ম',
  keywords: 'fact checking, bengali, AI, khoj, সত্যতা যাচাই, বাংলা',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="bn" dir="ltr">
      <body className="font-solaiman-lipi">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
