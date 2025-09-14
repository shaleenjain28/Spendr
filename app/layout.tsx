import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/navbar'
import { AuthProvider } from '@/contexts/AuthContext'
import { ConditionalNavbar } from '@/components/conditional-navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '$pendr - Sales & Marketing Optimizer',
  description: 'AI-powered marketing campaign optimization and analysis platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ConditionalNavbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
