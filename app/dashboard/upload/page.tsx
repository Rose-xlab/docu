import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { UploadButton } from "@/components/upload-button"

export const metadata: Metadata = {
  title: "Upload - DocSecure",
  description: "Upload new documents to your secure storage",
}

export default function UploadPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Upload Documents</h2>
      </div>
      <div className="flex items-center space-x-2">
        <UploadButton />
      </div>
      {/* Add more upload-related components here */}
    </DashboardShell>
  )
}

