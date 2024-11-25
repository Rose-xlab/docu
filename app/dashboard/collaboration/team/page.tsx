// app/dashboard/collaboration/team/page.tsx
"use client"

import { DocumentCollaborationSystem } from "@/components/document-collaboration-system"

export default function TeamManagementPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Team Management</h1>
      <DocumentCollaborationSystem defaultTab="team" />
    </div>
  )
}