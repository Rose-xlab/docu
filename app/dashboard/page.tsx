"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartBar,
  Users,
  Clock,
  Files,
  Upload,
  TrendingUp,
  Star,
  Share2,
  RefreshCw,
  Settings,
  Eye,
  FileText,
} from 'lucide-react'
import { DocumentList } from "@/components/document-list"
import { socket } from "@/lib/socket"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface DashboardMetrics {
  totalDocuments: number
  activeShares: number
  totalViews: number
  averageEngagement: number
  recentActivity: {
    type: string
    document: string
    user: string
    timestamp: string
  }[]
  topDocuments: {
    id: string
    name: string
    views: number
    engagement: number
  }[]
}

const defaultMetrics: DashboardMetrics = {
  totalDocuments: 24,
  activeShares: 12,
  totalViews: 1458,
  averageEngagement: 76,
  recentActivity: [
    {
      type: "view",
      document: "Q4 Financial Report.pdf",
      user: "Alice Johnson",
      timestamp: "2024-02-25T10:30:00Z"
    },
    {
      type: "share",
      document: "Product Roadmap.docx",
      user: "Bob Smith",
      timestamp: "2024-02-25T09:15:00Z"
    },
    {
      type: "edit",
      document: "Marketing Strategy.pptx",
      user: "Carol Davis",
      timestamp: "2024-02-24T16:45:00Z"
    },
  ],
  topDocuments: [
    {
      id: "1",
      name: "Company Overview.pdf",
      views: 245,
      engagement: 89
    },
    {
      id: "2",
      name: "Sales Presentation.pptx",
      views: 189,
      engagement: 92
    },
    {
      id: "3",
      name: "Product Specifications.docx",
      views: 156,
      engagement: 78
    },
  ]
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>(defaultMetrics)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate metrics refresh
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <DashboardShell>
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Document Management</h2>
            <p className="text-muted-foreground">
              Manage, track, and analyze your document sharing
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={handleRefresh} disabled={isRefreshing} variant="outline">
              <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="default">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Documents</p>
                  <h3 className="text-2xl font-bold text-purple-600 dark:text-purple-400">{metrics.totalDocuments}</h3>
                </div>
                <Files className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100">
                  +3 this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Shares</p>
                  <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{metrics.activeShares}</h3>
                </div>
                <Share2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                  5 expiring soon
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                  <h3 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">{metrics.totalViews}</h3>
                </div>
                <Eye className="h-8 w-8 text-cyan-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-100">
                  +248 this week
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-900/20 dark:to-green-900/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-1">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg. Engagement</p>
                  <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400">{metrics.averageEngagement}%</h3>
                </div>
                <TrendingUp className="h-8 w-8 text-teal-500" />
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-100">
                  +5% from last week
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Management */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Document Management</CardTitle>
                <CardDescription>
                  Upload, manage, and track your documents
                </CardDescription>
              </div>
              
            </div>
          </CardHeader>
          <CardContent>
            <DocumentList socket={socket} />
          </CardContent>
        </Card>

        {/* Recent Activity & Top Documents */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <Card className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/10 dark:to-blue-900/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-600 dark:text-purple-400">Recent Activity</CardTitle>
              <CardDescription>Latest document interactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="rounded-full bg-purple-100 dark:bg-purple-900/50 p-2">
                        {activity.type === "view" ? (
                          <Eye className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        ) : activity.type === "share" ? (
                          <Share2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <FileText className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.document}</p>
                        <p className="text-xs text-muted-foreground">
                          {activity.user} - {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      {activity.type}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-blue-600 dark:text-blue-400">Top Documents</CardTitle>
              <CardDescription>Most viewed and engaged documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {metrics.topDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-blue-100 dark:bg-blue-900/50 p-2">
                          <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <p className="text-sm font-medium">{doc.name}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200">
                        View Details
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Views: {doc.views}</span>
                        <span className="font-medium">{doc.engagement}% engagement</span>
                      </div>
                      <Progress value={doc.engagement} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  )
}

