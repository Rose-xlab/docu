"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import {
  Lock,
  Calendar as CalendarIcon,
  KeyRound,
  Eye,
  Download,
  Shield,
  FileWarning,
  Info,
  RefreshCw,
  Users,
  Fingerprint,
  Layers,
  Printer,
  Copy,
  Edit3,
  Globe,
  Smartphone,
  Wifi,
  Trash2,
} from "lucide-react"
import { format } from "date-fns"

interface Document {
  id: string
  name: string
  protection: {
    watermark: boolean
    watermarkText?: string
    screenshot: boolean
    expiryDate?: string
    downloadLimit?: number
    passwordProtected: boolean
    password?: string
    printingAllowed: boolean
    copyAllowed: boolean
    editingAllowed: boolean
    ipRestriction?: string[]
    deviceLimit?: number
    twoFactorAuth: boolean
    encryptionLevel: "none" | "basic" | "advanced"
    offlineAccess: boolean
    autoDestruct: boolean
    autoDestructDate?: string
  }
}

interface DocumentProtectionProps {
  document: Document
  onUpdate: (document: Document) => void
}

export function DocumentProtection({ document, onUpdate }: DocumentProtectionProps) {
  const [settings, setSettings] = useState(document.protection)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [tempPassword, setTempPassword] = useState("")

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      if (settings.passwordProtected && !settings.password && !tempPassword) {
        throw new Error("Password is required when password protection is enabled")
      }

      if (settings.downloadLimit && settings.downloadLimit < 0) {
        throw new Error("Download limit cannot be negative")
      }

      const updatedDocument = {
        ...document,
        protection: {
          ...settings,
          password: settings.passwordProtected ? (tempPassword || settings.password) : undefined
        }
      }

      await onUpdate(updatedDocument)
      
      toast({
        title: "Protection Settings Updated",
        description: "Document security settings have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error Updating Settings",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGeneratePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    const length = 12
    let password = ""
    for (let i = 0; i < length; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setTempPassword(password)
    toast({
      title: "Password Generated",
      description: "A secure password has been generated.",
    })
  }

  const getProtectionLevel = () => {
    let score = 0
    if (settings.passwordProtected) score += 2
    if (settings.watermark) score += 1
    if (settings.screenshot === false) score += 1
    if (settings.expiryDate) score += 1
    if (settings.downloadLimit) score += 1
    if (settings.twoFactorAuth) score += 2
    if (settings.encryptionLevel === "advanced") score += 2
    if (settings.ipRestriction?.length) score += 1
    if (!settings.offlineAccess) score += 1

    if (score >= 8) return { level: "High", color: "green" }
    if (score >= 5) return { level: "Medium", color: "yellow" }
    return { level: "Low", color: "red" }
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="container mx-auto py-6 space-y-8">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Document Protection</CardTitle>
                <CardDescription className="text-blue-100">
                  Configure security settings for {document.name}
                </CardDescription>
              </div>
              <Badge 
                variant={getProtectionLevel().level === "High" ? "default" : 
                       getProtectionLevel().level === "Medium" ? "secondary" : 
                       "destructive"}
                className="text-sm py-1"
              >
                {getProtectionLevel().level} Protection
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {/* Access Protection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-blue-600">
                <Shield className="mr-2 h-5 w-5" />
                Access Protection
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Password Protection</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.passwordProtected}
                      onCheckedChange={(checked) => {
                        handleSettingChange("passwordProtected", checked)
                        if (!checked) setTempPassword("")
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.passwordProtected ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                {settings.passwordProtected && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Set Password</Label>
                    <div className="flex space-x-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                        placeholder="Enter password"
                        className="flex-grow"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={handleGeneratePassword}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                    {tempPassword && (
                      <div className="text-sm text-muted-foreground">
                        Password strength: {
                          tempPassword.length >= 12 && 
                          /[A-Z]/.test(tempPassword) && 
                          /[a-z]/.test(tempPassword) && 
                          /[0-9]/.test(tempPassword) && 
                          /[^A-Za-z0-9]/.test(tempPassword) 
                            ? "Strong" 
                            : "Weak"
                        }
                      </div>
                    )}
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Two-Factor Authentication</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.twoFactorAuth}
                      onCheckedChange={(checked) => handleSettingChange("twoFactorAuth", checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.twoFactorAuth ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Encryption Level</Label>
                  <Select
                    value={settings.encryptionLevel}
                    onValueChange={(value: "none" | "basic" | "advanced") => 
                      handleSettingChange("encryptionLevel", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select encryption level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="basic">Basic (128-bit)</SelectItem>
                      <SelectItem value="advanced">Advanced (256-bit)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Content Protection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-green-600">
                <Layers className="mr-2 h-5 w-5" />
                Content Protection
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Watermark</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.watermark}
                      onCheckedChange={(checked) => handleSettingChange("watermark", checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.watermark ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                {settings.watermark && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Watermark Text</Label>
                    <Input
                      value={settings.watermarkText || ""}
                      onChange={(e) => handleSettingChange("watermarkText", e.target.value)}
                      placeholder="Enter watermark text"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Screenshot Protection</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!settings.screenshot}
                      onCheckedChange={(checked) => handleSettingChange("screenshot", !checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {!settings.screenshot ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Document Permissions</Label>
                <div className="grid gap-2 md:grid-cols-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.printingAllowed}
                      onCheckedChange={(checked) => handleSettingChange("printingAllowed", checked)}
                    />
                    <Label className="text-sm">Allow Printing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.copyAllowed}
                      onCheckedChange={(checked) => handleSettingChange("copyAllowed", checked)}
                    />
                    <Label className="text-sm">Allow Copy/Paste</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.editingAllowed}
                      onCheckedChange={(checked) => handleSettingChange("editingAllowed", checked)}
                    />
                    <Label className="text-sm">Allow Editing</Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Access Limitations */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center text-yellow-600">
                <Users className="mr-2 h-5 w-5" />
                Access Limitations
              </h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Document Expiry</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={!!settings.expiryDate}
                      onCheckedChange={(checked) => {
                        if (!checked) handleSettingChange("expiryDate", undefined)
                        else handleSettingChange("expiryDate", format(new Date(), "yyyy-MM-dd"))
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.expiryDate ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  {settings.expiryDate && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {settings.expiryDate}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="
w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={settings.expiryDate ? new Date(settings.expiryDate) : undefined}
                          onSelect={(date) => 
                            handleSettingChange("expiryDate", date ? format(date, "yyyy-MM-dd") : undefined)
                          }
                          disabled={(date) => 
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Download Limit</Label>
                  <div className="flex space-x-2">
                    <Input
                      type="number"
                      min="0"
                      value={settings.downloadLimit || ""}
                      onChange={(e) => handleSettingChange("downloadLimit", parseInt(e.target.value))}
                      placeholder="Enter download limit"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Info className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Set maximum number of downloads allowed</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Device Limit</Label>
                  <Input
                    type="number"
                    min="0"
                    value={settings.deviceLimit || ""}
                    onChange={(e) => handleSettingChange("deviceLimit", parseInt(e.target.value))}
                    placeholder="Enter device limit"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">IP Restriction</Label>
                  <Input
                    value={settings.ipRestriction?.join(", ") || ""}
                    onChange={(e) => handleSettingChange("ipRestriction", 
                      e.target.value.split(",").map(ip => ip.trim()).filter(Boolean)
                    )}
                    placeholder="Enter allowed IP addresses (comma-separated)"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Offline Access</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.offlineAccess}
                      onCheckedChange={(checked) => handleSettingChange("offlineAccess", checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.offlineAccess ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Auto Destruct</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={settings.autoDestruct}
                      onCheckedChange={(checked) => {
                        handleSettingChange("autoDestruct", checked)
                        if (!checked) handleSettingChange("autoDestructDate", undefined)
                      }}
                    />
                    <span className="text-sm text-gray-600">
                      {settings.autoDestruct ? "Enabled" : "Disabled"}
                    </span>
                  </div>
                  {settings.autoDestruct && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {settings.autoDestructDate || "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={settings.autoDestructDate ? new Date(settings.autoDestructDate) : undefined}
                          onSelect={(date) => 
                            handleSettingChange("autoDestructDate", date ? format(date, "yyyy-MM-dd") : undefined)
                          }
                          disabled={(date) => 
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              </div>
            </div>
          </CardContent>

          {/* Protection Summary */}
          <CardFooter className="bg-gray-50 dark:bg-gray-800 p-6 space-y-4">
            <div className="w-full p-4 rounded-lg bg-white dark:bg-gray-700 shadow-inner">
              <h4 className="font-medium mb-3 text-lg text-blue-600 dark:text-blue-400">Protection Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-green-500" />
                  <span className="text-sm">
                    {settings.passwordProtected ? "Password Protected" : "No Password"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">
                    {settings.encryptionLevel} Encryption
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">
                    {settings.screenshot ? "Screenshots Allowed" : "Screenshots Blocked"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Download className="h-5 w-5 text-purple-500" />
                  <span className="text-sm">
                    {settings.downloadLimit 
                      ? `${settings.downloadLimit} Downloads Limit`
                      : "Unlimited Downloads"}
                  </span>
                </div>
                {settings.expiryDate && (
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-5 w-5 text-red-500" />
                    <span className="text-sm">
                      Expires on {settings.expiryDate}
                    </span>
                  </div>
                )}
                {settings.autoDestruct && (
                  <div className="flex items-center space-x-2">
                    <Trash2 className="h-5 w-5 text-red-500" />
                    <span className="text-sm">
                      Auto Destruct on {settings.autoDestructDate}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between w-full">
              <Button
                variant="outline"
                onClick={() => {
                  setSettings(document.protection)
                  setTempPassword("")
                }}
                disabled={isLoading}
              >
                Reset Changes
              </Button>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Save Protection Settings
                  </>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </ScrollArea>
  )
}

