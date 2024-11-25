"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const trendData = [
  { month: 'Jan', views: 4000, shares: 2400 },
  { month: 'Feb', views: 3000, shares: 1398 },
  { month: 'Mar', views: 2000, shares: 9800 },
]

export default function TrendsPage() {
  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Trends</h1>
        <p className="text-muted-foreground">
          Historical analytics and trend analysis
        </p>
      </div>
      <Card className="p-6">
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="views" fill="#8884d8" />
              <Bar dataKey="shares" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </DashboardShell>
  )
}