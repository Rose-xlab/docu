import { Metadata } from "next"
import { DashboardShell } from "@/components/dashboard-shell"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TeamManagement } from "@/components/team-management"
import { ActivityLog } from "@/components/activity-log"
import { AccessSettings } from "@/components/access-settings"
import { ContentLibrary } from "@/components/content-library"

export const metadata: Metadata = {
  title: "Data Room Details - DocSecure",
  description: "Manage your data room",
}

export default function DataRoomPage({ params }: { params: { id: string } }) {
  return (
    <DashboardShell>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Data Room: {params.id}</h1>
      </div>
      <Tabs defaultValue="content">
        <TabsList className="mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="content">
          <ContentLibrary />
        </TabsContent>
        <TabsContent value="team">
          <TeamManagement />
        </TabsContent>
        <TabsContent value="activity">
          <ActivityLog />
        </TabsContent>
        <TabsContent value="settings">
          <AccessSettings />
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

