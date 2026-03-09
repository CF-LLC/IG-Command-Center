import type { Metadata } from 'next'
import './globals.css'
import dynamic from 'next/dynamic'

const Toaster = dynamic(() => import('@/components/ui/toaster').then((m) => m.Toaster), {
  ssr: false,
})

export const metadata: Metadata = {
  title: 'IG Command Center',
  description: 'Instagram management platform for teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
