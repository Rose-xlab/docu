"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalyticsTemplateProps {
  children: React.ReactNode
}

export default function AnalyticsTemplate({ children }: AnalyticsTemplateProps) {
  return (
    <div className="p-6">
      <Card className="p-6">
        {children}
      </Card>
    </div>
  )
}