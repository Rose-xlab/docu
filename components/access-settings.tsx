"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Users,
  Shield,
  Mail,
  Globe,
  Building,
  Clock,
  RefreshCw,
  Calendar as CalendarIcon,
  Plus,
  X,
  UserPlus,
  Lock,
  Eye,
  Settings,
} from "lucide-react"
import { format } from "date-fns"

interface AccessSettings {
  type: "private" | "restricted" | "public"
  allowedUsers: string[]
  allowedDomains?: string[]
  expirationDate?: Date
  requiresLogin: boolean
  accessLevel: "view" | "comment" | "edit"
  allowTeams: boolean
  maxViews?: number
  passwordProtected?: boolean
  password?: string
  notifyOnAccess?: boolean
  trackViews?: boolean
  deviceLimit?: number
  ipRestrictions?: string[]
}

interface Document {
  id: string
  name: string
  access: AccessSettings
}

interface AccessSettingsProps {
  document: Document
  onUpdate: (document: Document) => void
}

const defaultSettings: AccessSettings = {
  type: "private",
  allowedUsers: [],
  allowedDomains: [],
  requiresLogin: true,
  accessLevel: "view",
  allowTeams: false,
  trackViews: true,
  notifyOnAccess: false,
}

export function AccessSettings({ document, onUpdate }: AccessSettingsProps) {
  const [settings, setSettings] = useState<AccessSettings>({
    ...defaultSettings,
    ...document.access,
  })
  
  const [newEmail, setNewEmail] = useState("")
  const [newDomain, setNewDomain] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key: keyof AccessSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const validateEmail = (email: string) => {
    return email
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }

  const handleAddUser = () => {
    if (!validateEmail(newEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      })
      return
    }

    if (settings.allowedUsers.includes(newEmail)) {
      toast({
        title: "Duplicate Email",
        description: "This user already has access",
        variant: "destructive",
      })
      return
    }

    setSettings(prev => ({
      ...prev,
      allowedUsers: [...prev.allowedUsers, newEmail]
    }))
    setNewEmail("")
    toast({
      title: "User Added",
      description: `${newEmail} has been granted access`
    })
  }

  const handleRemoveUser = (email: string) => {
    setSettings(prev => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter(user => user !== email)
    }))
    toast({
      title: "User Removed",
      description: `${email}'s access has been revoked`
    })
  }

  const handleAddDomain = () => {
    const domain = newDomain.trim().toLowerCase()
    
    if (!domain || !domain.includes(".")) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain",
        variant: "destructive",
      })
      return
    }

    if (settings.allowedDomains?.includes(domain)) {
      toast({
        title: "Duplicate Domain",
        description: "This domain is already allowed",
        variant: "destructive",
      })
      return
    }

    setSettings(prev => ({
      ...prev,
      allowedDomains: [...(prev.allowedDomains || []), domain]
    }))
    setNewDomain("")
    toast({
      title: "Domain Added",
      description: `${domain} has been added to allowed domains`
    })
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Validate settings
      if (settings.type === "restricted" && settings.allowedUsers.length === 0) {
        throw new Error("Add at least one user for restricted access")
      }

      if (settings.passwordProtected && !settings.password && !newPassword) {
        throw new Error("Password is required when password protection is enabled")
      }

      const updatedSettings = {
        ...settings,
        password: settings.passwordProtected ? (newPassword || settings.password) : undefined
      }

      await onUpdate({
        ...document,
        access: updatedSettings
      })

      toast({
        title: "Settings Saved",
        description: "Access settings have been updated successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="space-y-8 p-6 pb-16">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Access Settings</h2>
            <p className="text-muted-foreground">
              Manage access control for {document.name}
            </p>
          </div>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Access Control
              </CardTitle>
              <CardDescription>
                Define who can access and interact with this document
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Access Type</Label>
                  <Select
                    value={settings.type}
                    onValueChange={(value: "private" | "restricted" | "public") =>
                      handleSettingChange("type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="private">
                        <div className="flex items-center">
                          <Shield className="mr-2 h-4 w-4" />
                          Private
                        </div>
                      </SelectItem>
                      <SelectItem value="restricted">
                        <div className="flex items-center">
                          <Users className="mr-2 h-4 w-4" />
                          Restricted
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className="flex items-center">
                          <Globe className="mr-2 h-4 w-4" />
                          Public
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Access Level</Label>
                  <Select
                    value={settings.accessLevel}
                    onValueChange={(value: "view" | "comment" | "edit") =>
                      handleSettingChange("accessLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="view">View Only</SelectItem>
                      <SelectItem value="comment">Can Comment</SelectItem>
                      <SelectItem value="edit">Can Edit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {settings.type === "restricted" && (
                <div className="space-y-4">
                  <Label>Allowed Users</Label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter email address"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddUser()
                        }
                      }}
                    />
                    <Button onClick={handleAddUser}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Add
                    </Button>
                  </div>
                  <ScrollArea className="h-[200px] border rounded-md p-4">
                    <div className="space-y-2">
                      {settings.allowedUsers.map(email => (
                        <div
                          key={email}
                          className="flex items-center justify-between p-2 bg-muted rounded-md"
                        >
                          <div className="flex items-center space-x-2">
                            <Mail className="h-4 w-4" />
                            <span>{email}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveUser(email)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      {settings.allowedUsers.length === 0 && (
                        <div className="text-center text-muted-foreground">
                          No users added yet
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Domain Restriction</Label>
                    <p className="text-sm text-muted-foreground">
                      Limit access to specific email domains
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowedDomains !== undefined}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowedDomains", checked ? [] : undefined)
                    }
                  />
                </div>
                {settings.allowedDomains !== undefined && (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Enter domain (e.g., company.com)"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault()
                            handleAddDomain()
                          }
                        }}
                      />
                      <Button onClick={handleAddDomain}>Add</Button>
                    </div>
                    <ScrollArea className="h-[100px]">
                      <div className="flex flex-wrap gap-2">
                        {settings.allowedDomains.map(domain => (
                          <Badge key={domain} variant="secondary">
                            {domain}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0"
                              onClick={() => {
                                setSettings(prev => ({
                                  ...prev,
                                  allowedDomains: prev.allowedDomains?.filter(d => d !== domain)
                                }))
                              }}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="mr-2 h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Password Protection</Label>
                    <p className="text-sm text-muted-foreground">
                      Require a password to access the document
                    </p>
                  </div>
                  <Switch
                    checked={settings.passwordProtected}
                    onCheckedChange={(checked) => {
                      handleSettingChange("passwordProtected", checked)
                      if (!checked) setNewPassword("")
                    }}
                  />
                </div>
                {settings.passwordProtected && (
                  <div className="flex space-x-2">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>
Expiration Date</Label>
                    <p className="text-sm text-muted-foreground">
                      Set an expiration date for access
                    </p>
                  </div>
                  <Switch
                    checked={settings.expirationDate !== undefined}
                    onCheckedChange={(checked) => {
                      handleSettingChange("expirationDate", checked ? new Date() : undefined)
                    }}
                  />
                </div>
                {settings.expirationDate && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {settings.expirationDate ? (
                          format(settings.expirationDate, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={settings.expirationDate}
                        onSelect={(date) => handleSettingChange("expirationDate", date)}
                        disabled={(date) =>
                          date < new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                Additional Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Login</Label>
                    <p className="text-sm text-muted-foreground">
                      Users must sign in to access
                    </p>
                  </div>
                  <Switch
                    checked={settings.requiresLogin}
                    onCheckedChange={(checked) =>
                      handleSettingChange("requiresLogin", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Allow Team Access</Label>
                    <p className="text-sm text-muted-foreground">
                      Members of your team can access
                    </p>
                  </div>
                  <Switch
                    checked={settings.allowTeams}
                    onCheckedChange={(checked) =>
                      handleSettingChange("allowTeams", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Track Views</Label>
                    <p className="text-sm text-muted-foreground">
                      Monitor document access
                    </p>
                  </div>
                  <Switch
                    checked={settings.trackViews}
                    onCheckedChange={(checked) =>
                      handleSettingChange("trackViews", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Access Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified when document is accessed
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifyOnAccess}
                    onCheckedChange={(checked) =>
                      handleSettingChange("notifyOnAccess", checked)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5" />
              Access Summary
            </CardTitle>
            <CardDescription>Overview of current access settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Access Details</h4>
                <div className="space-y-2 text-sm">
                  <p>Type: <Badge variant="outline">{settings.type}</Badge></p>
                  <p>Level: <Badge variant="outline">{settings.accessLevel}</Badge></p>
                  <p>Login Required: <Badge variant="outline">{settings.requiresLogin ? "Yes" : "No"}</Badge></p>
                  <p>Team Access: <Badge variant="outline">{settings.allowTeams ? "Enabled" : "Disabled"}</Badge></p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Restrictions</h4>
                <div className="space-y-2 text-sm">
                  <p>Password: <Badge variant="outline">{settings.passwordProtected ? "Yes" : "No"}</Badge></p>
                  <p>Expiration: <Badge variant="outline">{settings.expirationDate ? format(settings.expirationDate, "PP") : "None"}</Badge></p>
                  <p>Domain Restriction: <Badge variant="outline">{settings.allowedDomains ? "Yes" : "No"}</Badge></p>
                  <p>Tracking: <Badge variant="outline">{settings.trackViews ? "Enabled" : "Disabled"}</Badge></p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  )
}

