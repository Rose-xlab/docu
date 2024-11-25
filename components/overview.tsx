"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Eye, BarChart } from "lucide-react"

interface OverviewItem {
  title: string
  icon: React.ElementType
  value: string
  change: string
}

export function Overview() {
  const [items, setItems] = useState<OverviewItem[]>([])

  useEffect(() => {
    // Simulating an API call to fetch real-time data
    const fetchData = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setItems([
        {
          title: "Total Documents",
          icon: FileText,
          value: "34",
          change: "+2 from last month",
        },
        {
          title: "Active Data Rooms",
          icon: Users,
          value: "6",
          change: "+1 from last month",
        },
        {
          title: "Total Views",
          icon: Eye,
          value: "2,345",
          change: "+20.1% from last month",
        },
        {
          title: "Avg. Engagement",
          icon: BarChart,
          value: "4m 13s",
          change: "+1.2% from last month",
        },
      ])
    }

    fetchData()
  }, [])

  return (
    <>
      {items.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {item.title}
            </CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.change}</p>
          </CardContent>
        </Card>
      ))}
    </>
  )
}

