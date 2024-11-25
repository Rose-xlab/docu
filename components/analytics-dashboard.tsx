import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ViewsMap } from "@/components/views-map"
import { DocumentReactions } from "@/components/document-reactions"
import * as Icons from 'lucide-react'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6']

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

const MetricCard = ({ title, value, trend, icon: IconName, color }: {
  title: string
  value: string | number
  trend: number
  icon: keyof typeof Icons
  color: string
}) => {
  const IconComponent = Icons[IconName]
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
            <p className={`text-xs flex items-center mt-1 ${trend >= 0 ? "text-green-500" : "text-red-500"}`}>
              {trend >= 0 ? <Icons.TrendingUp className="w-3 h-3 mr-1" /> : <Icons.TrendingDown className="w-3 h-3 mr-1" />}
              {Math.abs(trend)}% from last period
            </p>
          </div>
          <IconComponent className={`w-8 h-8 ${color}`} />
        </div>
      </CardContent>
    </Card>
  )
}

export function ModernAnalyticsDashboard({ documents }: { documents: Document[] }) {
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    to: new Date()
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d' | '90d'>('7d')
  const [activeTab, setActiveTab] = useState("overview")

  const aggregateMetrics = useMemo(() => {
    return documents.reduce((acc, doc) => ({
      totalViews: acc.totalViews + doc.analytics.totalViews,
      uniqueVisitors: acc.uniqueVisitors + doc.analytics.uniqueViews,
      avgTimeSpent: acc.avgTimeSpent + doc.analytics.averageTimeSpent,
      totalReactions: acc.totalReactions + doc.analytics.reactions.reduce((sum, r) => 
        sum + r.like + r.love + r.star + r.insightful, 0),
      engagementScore: acc.engagementScore + (
        (doc.analytics.engagement.completionRate * 0.4 +
        (1 - doc.analytics.engagement.bounceRate) * 0.3 +
        (doc.analytics.engagement.averagePages / 10) * 0.3) * 100
      ) / documents.length
    }), {
      totalViews: 0,
      uniqueVisitors: 0,
      avgTimeSpent: 0,
      totalReactions: 0,
      engagementScore: 0
    })
  }, [documents])

  const filteredDocs = useMemo(() => 
    documents.filter(doc => 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase())
    ), [documents, searchTerm]
  )

  const aggregatedTimeData = useMemo(() => {
    const timeDataMap = new Map()
    documents.forEach(doc => {
      doc.analytics.timeData.forEach(data => {
        if (!timeDataMap.has(data.date)) {
          timeDataMap.set(data.date, {
            date: data.date,
            views: 0,
            uniqueViews: 0,
            shares: 0
          })
        }
        const existing = timeDataMap.get(data.date)
        existing.views += data.views
        existing.uniqueViews += data.uniqueViews
        existing.shares += data.shares
      })
    })
    return Array.from(timeDataMap.values())
  }, [documents])

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="p-8 space-y-8">
        {/* Header Controls */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <DateRangePicker from={dateRange.from} to={dateRange.to} onSelect={setDateRange} />
            <div className="relative w-64">
              <Icons.Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          <Select value={timeRange} onValueChange={(value: '24h' | '7d' | '30d' | '90d') => setTimeRange(value)}>
            <SelectTrigger className="w-[180px]">
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

        {/* Metric Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Views"
            value={aggregateMetrics.totalViews.toLocaleString()}
            trend={12.5}
            icon="Eye"
            color="text-blue-500"
          />
          <MetricCard
            title="Unique Visitors"
            value={aggregateMetrics.uniqueVisitors.toLocaleString()}
            trend={8.2}
            icon="Users"
            color="text-green-500"
          />
          <MetricCard
            title="Engagement Score"
            value={`${Math.round(aggregateMetrics.engagementScore)}%`}
            trend={5.1}
            icon="TrendingUp"
            color="text-purple-500"
          />
          <MetricCard
            title="Total Reactions"
            value={aggregateMetrics.totalReactions.toLocaleString()}
            trend={15.3}
            icon="Heart"
            color="text-red-500"
          />
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Overall Performance</CardTitle>
                <CardDescription>Views and engagement metrics over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={aggregatedTimeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="views" stroke="#3b82f6" name="Views" />
                    <Line type="monotone" dataKey="uniqueViews" stroke="#10b981" name="Unique Views" />
                    <Line type="monotone" dataKey="shares" stroke="#8b5cf6" name="Shares" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Global Reach</CardTitle>
                </CardHeader>
                <CardContent>
                  <ViewsMap
                    className="h-[300px] mb-6"
                    viewLocations={documents.flatMap(doc => doc.analytics.locations)}
                  />
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
                        data={documents[0]?.analytics.devices}
                        dataKey="count"
                        nameKey="type"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {documents[0]?.analytics.devices.map((entry, index) => (
                          <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
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

          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Document Performance</CardTitle>
                <CardDescription>Detailed analytics for individual documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredDocs
                    .sort((a, b) => b.analytics.totalViews - a.analytics.totalViews)
                    .map(doc => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer"
                        onClick={() => setSelectedDoc(doc)}
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{doc.title}</h4>
                          <div className="flex space-x-4 mt-1">
                            <span className="text-sm text-gray-500">
                              {doc.analytics.totalViews.toLocaleString()} views
                            </span>
                            <span className="text-sm text-gray-500">
                              {Math.round(doc.analytics.engagement.completionRate * 100)}% completion
                            </span>
                          </div>
                        </div>
                        <Button variant="outline">View Details</Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {selectedDoc && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{selectedDoc.title}</CardTitle>
                    <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
                      <Icons.X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="engagement">Engagement</TabsTrigger>
                      <TabsTrigger value="reactions">Reactions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                      <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                          <CardHeader>
                            <CardTitle>Views Over Time</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart data={selectedDoc.analytics.timeData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis />
                                <Tooltip />
                                <Area type="monotone" dataKey="views" fill="#3b82f6" stroke="#3b82f6" />
                              </AreaChart>
                            </ResponsiveContainer>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle>Engagement Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex justify-between items-center">
                                <span>Completion Rate</span>
                                <span className="font-bold">
                                  {(selectedDoc.analytics.engagement.completionRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Bounce Rate</span>
                                <span className="font-bold">
                                  {(selectedDoc.analytics.bounceRate * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Average Pages</span>
                                <span className="font-bold">
                                  {selectedDoc.analytics.engagement.averagePages.toFixed(1)}
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="engagement">
                      <div className="grid gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>User Segments</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={selectedDoc.analytics.userSegments}
                                  dataKey="users"
                                  nameKey="segment"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label
                                >
                                  {selectedDoc.analytics.userSegments.map((entry, index) => (
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
                            <CardTitle>Peak Hours</CardTitle>
                          </CardHeader>
                          <CardContent className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={selectedDoc.analytics.peakHours}>
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

                    <TabsContent value="reactions">
                      <div className="grid gap-6">
                        <DocumentReactions
                          documentId={selectedDoc.id}
                          currentUser={selectedDoc.analytics.currentUser}
                        />
                        <Card>
                          <CardHeader>
                            <CardTitle>Reactions by Location</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ViewsMap
                              className="h-[400px]"
                              viewLocations={selectedDoc.analytics.locations}
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>User Engagement Trends</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={aggregatedTimeData}>
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
                  <CardTitle>Reactions Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={documents[0]?.analytics.reactions}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="like" stackId="a" fill="#3b82f6" />
                      <Bar dataKey="love" stackId="a" fill="#ef4444" />
                      <Bar dataKey="star" stackId="a" fill="#f59e0b" />
                      <Bar dataKey="insightful" stackId="a" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Global Engagement Map</CardTitle>
              </CardHeader>
              <CardContent className="h-[500px]">
                <ViewsMap
                  className="h-full"
                  viewLocations={documents.flatMap(doc => doc.analytics.locations)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}