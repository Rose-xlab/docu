"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { FileText, Upload, Download, Eye, UserPlus } from 'lucide-react'

interface ActivityItem {
  id: string
  user: {
    name: string
    email: string
  }
  action: string
  target: string
  timestamp: string
  icon: React.ElementType
}

const activityItems: ActivityItem[] = [
  { id: "1", user: { name: "Alice Johnson", email: "alice@example.com" }, action: "uploaded", target: "Q4 Financial Report.pdf", timestamp: "2 hours ago", icon: Upload },
  { id: "2", user: { name: "Bob Smith", email: "bob@example.com" }, action: "viewed", target: "Marketing Strategy.docx", timestamp: "1 day ago", icon: Eye },
  { id: "3", user: { name: "Charlie Brown", email: "charlie@example.com" }, action: "downloaded", target: "Product Roadmap.pptx", timestamp: "3 days ago", icon: Download },
  { id: "4", user: { name: "David Lee", email: "david@example.com" }, action: "added", target: "New Team Member", timestamp: "1 week ago", icon: UserPlus },
]

export function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredActivities = activityItems.filter(item =>
    item.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.target.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search activities..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <div className="space-y-8">
          {filteredActivities.map((item) => (
            <div key={item.id} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://avatar.vercel.sh/${item.user.email}`} />
                <AvatarFallback>{item.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {item.user.name} {item.action} {item.target}
                </p>
                <p className="text-sm text-muted-foreground">
                  {item.timestamp}
                </p>
              </div>
              <div className="ml-auto font-medium">
                <item.icon className="h-5 w-5 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

