"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DatePicker } from "@/components/ui/date-picker"

export function ShareDocument({ documentId }: { documentId: string }) {
  const [allowDownload, setAllowDownload] = useState(false)
  const [requireEmailVerification, setRequireEmailVerification] = useState(false)
  const [expiryDate, setExpiryDate] = useState<Date | undefined>(undefined)
  const [password, setPassword] = useState("")
  const [recipients, setRecipients] = useState<string[]>([])

  const handleShare = () => {
    // Implement sharing logic here
    console.log("Sharing with options:", { 
      documentId, 
      allowDownload, 
      requireEmailVerification, 
      expiryDate, 
      password, 
      recipients 
    })
    // This would typically involve an API call to your backend
  }

  const handleAddRecipient = (email: string) => {
    setRecipients([...recipients, email])
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share Document</CardTitle>
        <CardDescription>Configure sharing options for your document</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="allow-download"
            checked={allowDownload}
            onCheckedChange={setAllowDownload}
          />
          <Label htmlFor="allow-download">Allow download</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="require-email-verification"
            checked={requireEmailVerification}
            onCheckedChange={setRequireEmailVerification}
          />
          <Label htmlFor="require-email-verification">Require email verification</Label>
        </div>
        <div className="space-y-1">
          <Label htmlFor="expiry-date">Expiry date</Label>
          <DatePicker
            id="expiry-date"
            selected={expiryDate}
            onSelect={setExpiryDate}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Password protect (optional)</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="recipients">Recipients</Label>
          <div className="flex space-x-2">
            <Input
              id="recipients"
              placeholder="Enter email address"
            />
            <Button onClick={() => handleAddRecipient((document.getElementById('recipients') as HTMLInputElement).value)}>
              Add
            </Button>
          </div>
          <div className="mt-2">
            {recipients.map((recipient, index) => (
              <Badge key={index} className="mr-1 mb-1">{recipient}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleShare}>Share Document</Button>
      </CardFooter>
    </Card>
  )
}

