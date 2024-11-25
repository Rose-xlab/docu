import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { DataRoomList } from "@/components/data-room-list"

export const metadata: Metadata = {
  title: "Data Rooms - DocSecure",
  description: "Manage your secure data rooms",
}

export default function DataRoomsPage() {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Rooms</h1>
          <p className="text-muted-foreground">
            Create and manage secure data rooms for your documents
          </p>
        </div>
      </div>
      <DataRoomList />
    </DashboardShell>
  )
}

