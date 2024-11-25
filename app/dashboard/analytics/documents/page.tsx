"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { DocumentAnalytics } from "@/components/document-analytics"

export default function DocumentsPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Documents Analytics</h1>
        <p className="text-muted-foreground">
          Document-specific performance metrics and insights
        </p>
      </div>
      <DocumentAnalytics document={{}} />
    </DashboardShell>
  )
}