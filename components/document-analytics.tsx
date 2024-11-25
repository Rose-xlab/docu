"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ViewsMap } from "@/components/views-map"
import { DocumentReactions } from "@/components/document-reactions"
import * as Icons from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts"

interface ViewLocation {
  id: number
  lat: number
  lng: number
  views: number
  country: string
}

interface Analytics {
  totalViews: number
  uniqueViews: number
  averageTimeSpent: number
  currentUser?: {
    id: string
    name: string
    avatar?: string
  }
  locations: ViewLocation[]
  devices: {
    type: string
    count: number
  }[]
  timeData: {
    date: string
    views: number
    uniqueViews: number
    shares: number
  }[]
  engagement: {
    totalTime: number
    completionRate: number
    bounceRate: number
    averagePages: number
  }
  reactions: {
    date: string
    like: number
    love: number
    star: number
    insightful: number
  }[]
  reactionsByLocation: {
    country: string
    reactions: Record<string, number>
  }[]
  peakHours: {
    hour: number
    traffic: number
  }[]
  userSegments: {
    segment: string
    users: number
  }[]
}

interface Document {
  id: string
  title: string
  analytics: Analytics
}

interface DocumentAnalyticsProps {
  document: Document
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

const defaultAnalytics: Analytics = {
  totalViews: 0,
  uniqueViews: 0,
  averageTimeSpent: 0,
  engagement: {
    totalTime: 0,
    completionRate: 0,
    bounceRate: 0,
    averagePages: 0
  },
  locations: [],
  devices: [],
  timeData: [],
  reactions: [],
  reactionsByLocation: [],
  peakHours: [],
  userSegments: []
}

export function DocumentAnalytics({ document }: DocumentAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'reactions' | 'shares'>('views')
  const analytics = { ...defaultAnalytics, ...document.analytics }

  const engagementScore = Math.round(
    ((analytics.engagement?.completionRate ?? 0) * 0.4 +
    (1 - (analytics.engagement?.bounceRate ?? 0)) * 0.3 +
    ((analytics.engagement?.averagePages ?? 0) / 10) * 0.3) * 100
  )

  const renderMetricCard = (
    title: string,
    value: number | string,
    icon: keyof typeof Icons,
    trend: number,
    color: string
  ) => {
    const IconComponent = Icons[icon]
    return (
      <Card className="bg-white dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
              <p className={`text-xs ${trend >= 0 ? 'text-green-500' : 'text-red-500'} flex items-center mt-1`}>
                {trend >= 0 ? <Icons.ChevronUp className="w-4 h-4 mr-1" /> : <Icons.ChevronDown className="w-4 h-4 mr-1" />}
                {Math.abs(trend)}% from last period
              </p>
            </div>
            <IconComponent className={`h-8 w-8 ${color}`} />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="space-y-8 p-8 pb-16 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-6xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">{document.title} Analytics</CardTitle>
                <CardDescription className="text-blue-100">
                  Comprehensive insights and engagement metrics
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
              {renderMetricCard(
                "Total Views",
                analytics.totalViews.toLocaleString(),
                "Eye",
                15,
                "text-blue-500"
              )}
              {renderMetricCard(
                "Engagement Score",
                `${engagementScore}%`,
                "TrendingUp",
                8,
                "text-green-500"
              )}
              {renderMetricCard(
                "Total Reactions",
                analytics.reactions.reduce((sum, day) => 
                  sum + day.like + day.love + day.star + day.insightful, 0
                ).toLocaleString(),
                "Heart",
                12,
                "text-red-500"
              )}
              {renderMetricCard(
                "Total Shares",
                analytics.timeData.reduce((sum, day) => sum + day.shares, 0).toLocaleString(),
                "Share2",
                20,
                "text-purple-500"
              )}
            </div>

            <Tabs defaultValue="overview" className="mt-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="engagement">Engagement</TabsTrigger>
                <TabsTrigger value="reactions">Reactions</TabsTrigger>
                <TabsTrigger value="geography">Geography</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Trend Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.timeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                          <Line type="monotone" dataKey="shares" stroke="#8b5cf6" name="Shares" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Device Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={analytics.devices}
                            dataKey="count"
                            nameKey="type"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {analytics.devices.map((entry, index) => (
                              <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
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
                      <CardTitle>Peak Hours</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.peakHours}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="hour" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="traffic" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Reactions Tab */}
              <TabsContent value="reactions" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Reaction Trends</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analytics.reactions}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="like" stroke="#3b82f6" name="Like" />
                          <Line type="monotone" dataKey="love" stroke="#ef4444" name="Love" />
                          <Line type="monotone" dataKey="star" stroke="#f59e0b" name="Star" />
                          <Line type="monotone" dataKey="insightful" stroke="#10b981" name="Insightful" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <DocumentReactions
                    documentId={document.id}
                    currentUser={analytics.currentUser}
                  />

                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Reactions by Region</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ViewsMap
                        className="h-[400px]"
                        viewLocations={analytics.locations}
                      />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Engagement Tab */}
              <TabsContent value="engagement" className="mt-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>User Engagement Over Time</CardTitle>
                    </CardHeader>
                    <CardContent className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={analytics.timeData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Area
                            type="monotone"
                            dataKey="uniqueViews"
                            stackId="1"
                            stroke="#3b82f6"
                            fill="#3b82f6"
                          />
                        </AreaChart>
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
                            data={analytics.userSegments}
                            dataKey="users"
                            nameKey="segment"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {analytics.userSegments.map((entry, index) => (
                              <Cell key={entry.segment} fill={COLORS[index % COLORS.length]} />
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
                      <CardTitle>Engagement Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                          <span>Completion Rate</span>
                          <span className="font-bold">
                            {(analytics.engagement.completionRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span>Bounce Rate</span>
                          <span className="font-bold">
                            {(analytics.engagement.bounceRate * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-4">
                          <span>Avg. Pages per Visit</span>
                          <span className="font-bold">
                            {analytics.engagement.averagePages.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Avg. Time Spent</span>
                          <span className="font-bold">
                            {Math.floor(analytics.averageTimeSpent / 60)}m {" "}
                            {Math.round(analytics.averageTimeSpent % 60)}s
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Geography Tab */}
              <TabsContent value="geography" className="mt-6">
  <Card>
    <CardHeader>
      <CardTitle>Global Reach</CardTitle>
    </CardHeader>
    <CardContent>
      <ViewsMap
        className="h-[400px] mb-6"
        viewLocations={analytics.locations}
      />
      <div className="grid md:grid-cols-2 gap-6">
        <div key="top-countries-list">
          <h4 className="font-semibold mb-4">Top Countries</h4>
          <div className="space-y-2">
            {analytics.locations
              .sort((a, b) => b.views - a.views)
              .slice(0, 5)
              .map((location) => (
                <div
                  key={`${location.id}-${location.country}`}
                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                >
                  <span>{location.country}</span>
                  <Badge variant="secondary">
                    {location.views.toLocaleString()} views
                  </Badge>
                </div>
              ))}
          </div>
        </div>
        <div className="h-[300px]" key="countries-chart">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={analytics.locations
                .sort((a, b) => b.views - a.views)
                .slice(0, 5)
              }
              layout="vertical"
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="country" type="category" />
              <Tooltip />
              <Bar dataKey="views" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
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