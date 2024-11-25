import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"

export const metadata: Metadata = {
  title: "Version Control - DocSecure",
  description: "Manage document versions and track changes",
}

export default function VersionControlPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Version Control</h2>
      </div>
      {/* Add version control components here */}
    </DashboardShell>
  )
}

