"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const engagementData = [
  { date: '2024-01', engagement: 65 },
  { date: '2024-02', engagement: 75 },
  { date: '2024-03', engagement: 85 },
]

export default function EngagementPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Engagement</h1>
        <p className="text-muted-foreground">
          User interaction and engagement metrics
        </p>
      </div>
      <Card className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="engagement" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </DashboardShell>
  )
}