import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { CollaborationTools } from "@/components/collaboration-tools"
import { DocumentComparison } from "@/components/document-comparison"

export const metadata: Metadata = {
  title: "Collaboration - DocSecure",
  description: "Collaborate on your documents",
}

export default function CollaborationPage() {
  return (
    <DashboardShell>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Collaboration</h2>
      <div className="grid gap-8 md:grid-cols-2">
        <CollaborationTools />
        <DocumentComparison />
      </div>
    </DashboardShell>
  )
}

