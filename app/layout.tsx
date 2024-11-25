import { Inter } from 'next/font/google'
import type { Metadata } from "next"
import { cn } from "@/lib/utils"

import "./globals.css"
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: "DocSecure - Secure Document Sharing & Analytics",
    template: "%s | DocSecure",
  },
  description: "Share documents securely. Create data rooms with granular permissions. Your #1 platform for document management and analytics.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        {children}
      </body>
    </html>
  )
}

