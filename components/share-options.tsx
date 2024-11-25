"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Share,
  Link2,
  Copy,
  Mail,
  Calendar,
  Lock,
  RefreshCw,
  Users,
  Globe,
  Shield,
  Trash2,
  Eye,
  Printer,
  Download,
  Bell,
  UserPlus,
} from "lucide-react"

interface ShareSettings {
  type: "link" | "email" | "embed"
  expirationDate?: string
  password?: string
  allowedEmails: string[]
  trackViews: boolean
  notifyOnAccess: boolean
  allowDownload: boolean
  allowPrint: boolean
  requireSignIn: boolean
  customMessage?: string
  shareLink?: string
  embedCode?: string
}

interface Document {
  id: string
  name: string
  sharing: ShareSettings
}

interface ShareOptionsProps {
  document: Document
  onUpdate: (document: Document) => void
}

export function ShareOptions({ document, onUpdate }: ShareOptionsProps) {
  const [settings, setSettings] = useState<ShareSettings>(document.sharing)
  const [isLoading, setIsLoading] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [newEmail, setNewEmail] = useState("")

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const generateShareLink = () => {
    // In a real app, this would call an API to generate a secure share link
    const link = `https://yourdomain.com/share/${document.id}/${Date.now()}`
    handleSettingChange("shareLink", link)
    return link
  }

  const generateEmbedCode = () => {
    // Generate embed code based on current settings
    const embedCode = `<iframe src="https://yourdomain.com/embed/${document.id}" width="100%" height="600" frameborder="0"></iframe>`
    handleSettingChange("embedCode", embedCode)
    return embedCode
  }

  const handleAddEmail = () => {
    if (!newEmail.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    setSettings(prev => ({
      ...prev,
      allowedEmails: [...prev.allowedEmails, newEmail]
    }))
    setNewEmail("")
  }

  const handleCopyLink = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied!",
      description: "Link has been copied to clipboard"
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate({
        ...document,
        sharing: settings
      })

      toast({
        title: "Settings Saved",
        description: "Share settings have been updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save share settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container mx-auto py-6">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Share Settings</CardTitle>
                <CardDescription className="text-blue-100">
                  Configure how {document.name} can be shared
                </CardDescription>
              </div>
              <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
                <DialogTrigger asChild>
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    <Share className="mr-2 h-4 w-4" />
                    Share Document
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Share Document</DialogTitle>
                    <DialogDescription>
                      Choose how you want to share this document
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label className="text-right">Share Link</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={settings.shareLink || generateShareLink()}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyLink(settings.shareLink || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-right">Embed Code</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          value={settings.embedCode || generateEmbedCode()}
                          readOnly
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopyLink(settings.embedCode || "")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <DialogFooter className="sm:justify-start">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowShareDialog(false)}
                    >
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-blue-600">
                <Globe className="mr-2 h-5 w-5" />
                Share Method
              </h3>
              <Select
                value={settings.type}
                onValueChange={(value: "link" | "email" | "embed") =>
                  handleSettingChange("type", value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="link">
                    <div className="flex items-center">
                      <Link2 className="mr-2 h-4 w-4" />
                      Share via Link
                    </div>
                  </SelectItem>
                  <SelectItem value="email">
                    <div className="flex items-center">
                      <Mail className="mr-2 h-4 w-4" />
                      Share via Email
                    </div>
                  </SelectItem>
                  <SelectItem value="embed">
                    <div className="flex items-center">
                      <Globe className="mr-2 h-4 w-4" />
                      Embed Document
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-green-600">
                <Shield className="mr-2 h-5 w-5" />
                Access Control
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <Label>Require Sign In</Label>
                  </div>
                  <Switch
                    checked={settings.requireSignIn}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requireSignIn", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4 text-gray-500" />
                    <Label>Track Views</Label>
                  </div>
                  <Switch
                    checked={settings.trackViews}
                    onCheckedChange={(checked) =>
                      handleSettingChange("trackViews", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-gray-500" />
                    <Label>Notify on Access</Label>
                  </div>
                  <Switch
                    checked={settings.notifyOnAccess}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifyOnAccess", checked)
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-yellow-600">
                <Lock className="mr-2 h-5 w-5" />
                Permissions
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-gray-500" />
                    <Label>Allow Download</Label>
                  </div>
                  <Switch
                    checked={settings.allowDownload}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowDownload", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between space-x-2">
                  <div className="flex items-center space-x-2">
                    <Printer className="h-4 w-4 text-gray-500" />
                    <Label>Allow Print</Label>
                  </div>
                  <Switch
                    checked={settings.allowPrint}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowPrint", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {settings.type === "email" && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center text-purple-600">
                    <Mail className="mr-2 h-5 w-5" />
                    Email Recipients
                  </h3>
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter email address"
                        value={newEmail}
                        onChange={(e) => setNewEmail(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleAddEmail}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add
                      </Button>
                    </div>
                    <ScrollArea className="h-[200px] border rounded-md p-4">
                      <div className="space-y-2">
                        {settings.allowedEmails.map(email => (
                          <div
                            key={email}
                            className="flex items-center justify-between p-2 bg-muted rounded-md"
                          >
                            <div className="flex items-center space-x-2">
                              <Mail className="h-4 w-4 text-gray-500" />
                              <span>{email}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSettings(prev => ({
                                  ...prev,
                                  allowedEmails: prev.allowedEmails.filter(e => e !== email)
                                }))
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </>
            )}

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center text-indigo-600">
                <Mail className="mr-2 h-5 w-5" />
                Custom Message
              </h3>
              <div className="space-y-2">
                <Label>Message for Recipients</Label>
                <Input
                  value={settings.customMessage || ""}
                  onChange={(e) => handleSettingChange("customMessage", e.target.value)}
                  placeholder="Add a message for recipients"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 flex justify-between">
            <Button
              variant="outline"
              onClick={() => setSettings(document.sharing)}
              disabled={isLoading}
            >
              Reset
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={isLoading}
              className="bg-gradient-to-
r from-blue-600 to-purple-600 text-white"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  )
}

