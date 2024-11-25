"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { ViewsMap } from "@/components/views-map"
import { Card } from "@/components/ui/card"

export default function GlobalPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Global Reach</h1>
        <p className="text-muted-foreground">
          Geographical distribution of document access
        </p>
      </div>
      <Card className="p-6">
        <ViewsMap className="h-[500px]" viewLocations={[]} />
      </Card>
    </DashboardShell>
  )
}