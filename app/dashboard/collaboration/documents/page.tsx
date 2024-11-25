// app/dashboard/collaboration/documents/page.tsx
"use client"

import { DocumentCollaborationSystem } from "@/components/document-collaboration-system"

export default function DocumentCollaborationPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Document Collaboration</h1>
      <DocumentCollaborationSystem defaultTab="documents" />
    </div>
  )
}