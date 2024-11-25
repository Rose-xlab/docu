"use client"

import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from 'lucide-react'

const mockData = {
 weeklyViews: [
   { name: 'Mon', views: 4000, uniqueVisitors: 2400 },
   { name: 'Tue', views: 3000, uniqueVisitors: 1398 },
   { name: 'Wed', views: 2000, uniqueVisitors: 9800 },
   { name: 'Thu', views: 2780, uniqueVisitors: 3908 },
   { name: 'Fri', views: 1890, uniqueVisitors: 4800 },
   { name: 'Sat', views: 2390, uniqueVisitors: 3800 },
   { name: 'Sun', views: 3490, uniqueVisitors: 4300 },
 ],
 monthlyEngagement: [
   { name: 'Week 1', avgTimeOnPage: 120, bounceRate: 35 },
   { name: 'Week 2', avgTimeOnPage: 150, bounceRate: 32 },
   { name: 'Week 3', avgTimeOnPage: 180, bounceRate: 28 },
   { name: 'Week 4', avgTimeOnPage: 200, bounceRate: 25 },
 ]
}

export function AnalyticsDashboard() {
 const [dateRange, setDateRange] = useState({ from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), to: new Date() })
 const [exportFormat, setExportFormat] = useState("csv")

 const handleExport =
() => {
   // In a real application, this would trigger the export process
   console.log("Exporting analytics data:", { dateRange, exportFormat })
 }

 return (
   <div className="space-y-4">
     <div className="flex justify-between items-center">
       <DateRangePicker
         from={dateRange.from}
         to={dateRange.to}
         onSelect={setDateRange}
       />
       <div className="flex items-center space-x-2">
         <Select value={exportFormat} onValueChange={setExportFormat}>
           <SelectTrigger className="w-[100px]">
             <SelectValue placeholder="Export as" />
           </SelectTrigger>
           <SelectContent>
             <SelectItem value="csv">CSV</SelectItem>
             <SelectItem value="pdf">PDF</SelectItem>
             <SelectItem value="json">JSON</SelectItem>
           </SelectContent>
         </Select>
         <Button onClick={handleExport}>
           <Download className="mr-2 h-4 w-4" />
           Export
         </Button>
       </div>
     </div>

     <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Total Views</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">45,231</div>
           <p className="text-xs text-muted-foreground">+20.1% from last month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">17,402</div>
           <p className="text-xs text-muted-foreground">+15.2% from last month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">3m 24s</div>
           <p className="text-xs text-muted-foreground">+2.3% from last month</p>
         </CardContent>
       </Card>
       <Card>
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
           <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
         </CardHeader>
         <CardContent>
           <div className="text-2xl font-bold">24.3%</div>
           <p className="text-xs text-muted-foreground">-1.5% from last month</p>
         </CardContent>
       </Card>
     </div>

     <Card className="col-span-4">
       <CardHeader>
         <CardTitle>Weekly Overview</CardTitle>
         <CardDescription>Document views and unique visitors over the past week</CardDescription>
       </CardHeader>
       <CardContent className="h-[300px]">
         <ResponsiveContainer width="100%" height="100%">
           <BarChart data={mockData.weeklyViews}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="name" />
             <YAxis />
             <Tooltip />
             <Legend />
             <Bar dataKey="views" fill="#8884d8" />
             <Bar dataKey="uniqueVisitors" fill="#82ca9d" />
           </BarChart>
         </ResponsiveContainer>
       </CardContent>
     </Card>

     <Card className="col-span-4">
       <CardHeader>
         <CardTitle>Monthly Engagement</CardTitle>
         <CardDescription>Average time on page and bounce rate over the past month</CardDescription>
       </CardHeader>
       <CardContent className="h-[300px]">
         <ResponsiveContainer width="100%" height="100%">
           <LineChart data={mockData.monthlyEngagement}>
             <CartesianGrid strokeDasharray="3 3" />
             <XAxis dataKey="name" />
             <YAxis yAxisId="left" />
             <YAxis yAxisId="right" orientation="right" />
             <Tooltip />
             <Legend />
             <Line yAxisId="left" type="monotone" dataKey="avgTimeOnPage" stroke="#8884d8" activeDot={{ r: 8 }} />
             <Line yAxisId="right" type="monotone" dataKey="bounceRate" stroke="#82ca9d" />
           </LineChart>
         </ResponsiveContainer>
       </CardContent>
     </Card>
   </div>
 )
}

