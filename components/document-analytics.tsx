"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts"
import {
  BarChart2,
  Users,
  Clock,
  TrendingUp,
  Filter,
  ChevronUp,
  ChevronDown,
} from "lucide-react"

interface Analytics {
  totalViews: number
  uniqueViews: number
  averageTimeSpent: number
  locations?: {
    country: string
    views: number
  }[]
  devices?: {
    type: string
    count: number
  }[]
  timeData?: {
    date: string
    views: number
    uniqueViews: number
    shares: number
  }[]
  engagement?: {
    totalTime: number
    completionRate: number
    bounceRate: number
    averagePages: number
  }
  userSegments?: {
    segment: string
    users: number
  }[]
  peakHours?: {
    hour: number
    traffic: number
  }[]
}

interface Document {
  id: string
  name: string
  analytics: Analytics
}

interface DocumentAnalyticsProps {
  document: Document
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

export function DocumentAnalytics({ document }: DocumentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [isLoading, setIsLoading] = useState(false)

  const analytics = document.analytics

  const engagementScore = Math.round(
    ((analytics.engagement?.completionRate ?? 0) * 0.4 +
    (1 - (analytics.engagement?.bounceRate ?? 0)) * 0.3 +
    ((analytics.engagement?.averagePages ?? 0) / 10) * 0.3) * 100
  )

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="space-y-8 p-8 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-6xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Document Analytics</CardTitle>
                <CardDescription className="text-blue-100">
                  Performance insights for {document.name}
                </CardDescription>
              </div>
              <Select
                value={timeRange}
                onValueChange={(value: '24h' | '7d' | '30d' | '90d') => setTimeRange(value)}
              >
                <SelectTrigger className="w-[180px] bg-white text-gray-900">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white dark:bg-gray-800 shadow-md transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Views</p>
                      <h3 className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</h3>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        +{Math.round(analytics.totalViews * 0.1)} from last period
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-md transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg. Time Spent</p>
                      <h3 className="text-2xl font-bold">
                        {Math.round(analytics.averageTimeSpent / 60)}m {Math.round(analytics.averageTimeSpent % 60)}s
                      </h3>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        +2m from last period
                      </p>
                    </div>
                    <Clock className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-md transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Engagement Score</p>
                      <h3 className="text-2xl font-bold">{engagementScore}%</h3>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        +5% from last period
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white dark:bg-gray-800 shadow-md transition-all hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                      <h3 className="text-2xl font-bold">
                        {Math.round((analytics.engagement?.completionRate ?? 0) * 100)}%
                      </h3>
                      <p className="text-xs text-green-500 flex items-center mt-1">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        +3% from last period
                      </p>
                    </div>
                    <BarChart2 className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Views Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.timeData ?? []}>
                          <defs>
                            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="date" />
                          <YAxis />
                          <CartesianGrid strokeDasharray="3 3" />
                          <Tooltip />
                          <Area
                            type="monotone"
                            dataKey="views"
                            stroke="#3b82f6"
                            fillOpacity={1}
                            fill="url(#colorViews)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.locations ?? []}
                            dataKey="views"
                            nameKey="country"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {(analytics.locations ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.devices ?? []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="type" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count">
                            {(analytics.devices ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="engagement" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Reading Pattern</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.timeData ?? []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="uniqueViews" 
                            stroke="#3b82f6" 
                            name="Unique Views"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="shares" 
                            stroke="#10b981" 
                            name="Shares"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Peak Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.peakHours ?? []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="traffic" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Segments</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.userSegments ?? []}
                            dataKey="users"
                            nameKey="segment"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {(analytics.userSegments ?? []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="audience" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Audience analytics content to be implemented.</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="behavior" className="mt-6">
                <Card>
                  <CardHeader>
                
<CardTitle>User Behavior Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">User behavior analytics content to be implemented.</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

