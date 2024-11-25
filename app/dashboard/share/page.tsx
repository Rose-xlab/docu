import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { ShareOptions } from "@/components/share-options"

export const metadata: Metadata = {
  title: "Share - DocSecure",
  description: "Share your documents securely",
}

export default function SharePage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Share Documents</h1>
        <p className="text-muted-foreground">
          Set up secure sharing options for your documents
        </p>
      </div>
      <ShareOptions />
    </DashboardShell>
  )
}

