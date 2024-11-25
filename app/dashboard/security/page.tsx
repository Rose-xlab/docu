import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { AuditTrail } from "@/components/audit-trail"
import { DocumentExpiration } from "@/components/document-expiration"
import { WatermarkSettings } from "@/components/watermark-settings"
import { ScreenshotProtection } from "@/components/screenshot-protection"

export const metadata: Metadata = {
  title: "Security - DocSecure",
  description: "Manage security settings for your documents",
}

export default function SecurityPage() {
  return (
    <DashboardShell>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Security Settings</h2>
      <div className="grid gap-8 md:grid-cols-2">
        <AuditTrail />
        <DocumentExpiration />
      </div>
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <WatermarkSettings />
        <ScreenshotProtection />
      </div>
    </DashboardShell>
  )
}

