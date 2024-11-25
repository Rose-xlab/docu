"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { AnalyticsOverview } from "@/components/analytics-overview"

export default function OverviewPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
        <p className="text-muted-foreground">
          High-level analytics insights across all documents
        </p>
      </div>
      <AnalyticsOverview />
    </DashboardShell>
  )
}