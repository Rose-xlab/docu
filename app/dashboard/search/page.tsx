import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { AdvancedSearch } from "@/components/advanced-search"

export const metadata: Metadata = {
  title: "Advanced Search - DocSecure",
  description: "Search across all your documents",
}

export default function SearchPage() {
  return (
    <DashboardShell>
      <h2 className="text-3xl font-bold tracking-tight mb-6">Advanced Search</h2>
      <AdvancedSearch />
    </DashboardShell>
  )
}

