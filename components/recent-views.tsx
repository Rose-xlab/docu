"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface RecentView {
  name: string
  email: string
  document: string
  time: string
}

export function RecentViews({ className }: React.HTMLAttributes<HTMLDivElement>) {
  const [recentViews, setRecentViews] = useState<RecentView[]>([])

  useEffect(() => {
    // Simulating an API call to fetch real-time data
    const fetchData = async () => {
      // In a real application, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setRecentViews([
        {
          name: "Olivia Martin",
          email: "olivia.martin@email.com",
          document: "Q4 Financial Report.pdf",
          time: "2 hours ago",
        },
        {
          name: "Jackson Lee",
          email: "jackson.lee@email.com",
          document: "Product Roadmap 2023.pptx",
          time: "4 hours ago",
        },
        {
          name: "Isabella Nguyen",
          email: "isabella.nguyen@email.com",
          document: "Marketing Strategy.docx",
          time: "6 hours ago",
        },
        {
          name: "William Kim",
          email: "william.kim@email.com",
          document: "Legal Contract v2.pdf",
          time: "1 day ago",
        },
      ])
    }

    fetchData()

    // Set up a polling mechanism to fetch updates every 5 minutes
    const intervalId = setInterval(fetchData, 5 * 60 * 1000)

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Views</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {recentViews.map((view) => (
            <div key={view.email} className="flex items-center">
              <Avatar className="h-9 w-9">
                <AvatarImage src={`https://avatar.vercel.sh/${view.email}`} alt={view.name} />
                <AvatarFallback>{view.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">{view.name}</p>
                <p className="text-sm text-muted-foreground">
                  viewed {view.document}
                </p>
              </div>
              <div className="ml-auto font-medium">{view.time}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

