"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { AnalyticsOverview } from "@/components/analytics-overview"

export default function AnalyticsPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Get insights into document engagement and user behavior
        </p>
      </div>
      <AnalyticsOverview />
    </DashboardShell>
  )
}