"use client"

import { useState, useEffect } from "react"
import { Bell, Settings, Eye, Edit, MessageSquare, Share2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
interface Notification {
  id: string
  type: 'view' | 'edit' | 'comment' | 'share'
  message: string
  timestamp: string
}


export function InstantNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [notificationSound, setNotificationSound] = useState("default")

  useEffect(() => {
    // In a real application, this would be replaced with a WebSocket connection
    const mockNotifications: Notification[] = [
      { id: '1', type: 'view', message: 'John Doe viewed your document', timestamp: '2 minutes ago' },
      { id: '2', type: 'edit', message: 'Jane Smith edited the financial report', timestamp: '1 hour ago' },
      { id: '3', type: 'comment', message: 'New comment on Project Proposal', timestamp: '3 hours ago' },
      { id: '4', type: 'share', message: 'Marketing team shared a new document with you', timestamp: '1 day ago' },
    ]
    setNotifications(mockNotifications)
  }, [])

  const handleClearNotifications = () => {
    setNotifications([])
  }

  const handleSaveSettings = () => {
    // In a real application, this would send the settings to the backend
    console.log("Saving notification settings:", { enableNotifications, notificationSound })
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Notifications
          <Badge variant="secondary">{notifications.length}</Badge>
        </CardTitle>
        <CardDescription>Stay updated on document activities</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          {notifications.map((notification) => (
            <div key={notification.id} className="mb-4 last:mb-0">
              <div className="flex items-center">
                {notification.type === 'view' && <Eye className="mr-2 h-4 w-4" />}
                {notification.type === 'edit' && <Edit className="mr-2 h-4 w-4" />}
                {notification.type === 'comment' && <MessageSquare className="mr-2 h-4 w-4" />}
                {notification.type === 'share' && <Share2 className="mr-2 h-4 w-4" />}
                <p className="text-sm font-medium">{notification.message}</p>
              </div>
              <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={handleClearNotifications}>
          Clear All
        </Button>
        <Button variant="outline" size="sm" onClick={() => {}}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </CardFooter>
    </Card>
  )
}

export function NotificationSettings() {
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [notificationSound, setNotificationSound] = useState("default")

  const handleSaveSettings = () => {
    // In a real application, this would send the settings to the backend
    console.log("Saving notification settings:", { enableNotifications, notificationSound })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>Customize your notification preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="enable-notifications"
            checked={enableNotifications}
            onCheckedChange={setEnableNotifications}
          />
          <Label htmlFor="enable-notifications">Enable Notifications</Label>
        </div>
        <div className="space-y-1">
          <Label htmlFor="notification-sound">Notification Sound</Label>
          <Select value={notificationSound} onValueChange={setNotificationSound}>
            <SelectTrigger id="notification-sound">
              <SelectValue placeholder="Select sound" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="chime">Chime</SelectItem>
              <SelectItem value="bell">Bell</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </CardFooter>
    </Card>
  )
}

