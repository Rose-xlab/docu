// app/dashboard/analytics/_components/analytics-layout.tsx
"use client"

import { Card } from "@/components/ui/card"

interface AnalyticsLayoutProps {
  children: React.ReactNode
  title: string
}

export function AnalyticsLayout({ children, title }: AnalyticsLayoutProps) {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <Card className="p-6">
        {children}
      </Card>
    </div>
  )
}