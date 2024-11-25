import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { DocumentList } from "@/components/document-list"
import { BulkOperations } from "@/components/bulk-operations"

export const metadata: Metadata = {
  title: "Documents - DocSecure",
  description: "Manage your documents",
}

export default function DocumentsPage() {
  return (
    <DashboardShell>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Documents</h2>
      <DocumentList />
      <div className="mt-8">
        <BulkOperations />
      </div>
    </DashboardShell>
  )
}

