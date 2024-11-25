// components/screenshot-protection.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { toast } from "@/components/ui/use-toast"
import {
  Camera,
  ShieldAlert,
  Eye,
  MonitorX,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

interface Document {
  id: string
  name: string
  screenshotProtection: {
    enabled: boolean
    method: "blur" | "block" | "watermark"
    customMessage?: string
    blockPrintScreen: boolean
    preventDownload: boolean
    hideContent: boolean
    notifyOnAttempt: boolean
  }
}

interface ScreenshotProtectionProps {
  document: Document
  onUpdate: (document: Document) => void
}

export function ScreenshotProtection({ document, onUpdate }: ScreenshotProtectionProps) {
  const [settings, setSettings] = useState(document.screenshotProtection)
  const [isLoading, setIsLoading] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate({
        ...document,
        screenshotProtection: settings
      })

      toast({
        title: "Settings Saved",
        description: "Screenshot protection settings have been updated"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Screenshot Protection</CardTitle>
        <CardDescription>
          Configure protection against unauthorized screen captures
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Enable Protection */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Screenshot Protection</Label>
            <p className="text-sm text-muted-foreground">
              Prevent unauthorized screen captures
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
          />
        </div>

        {settings.enabled && (
          <>
            {/* Protection Method */}
            <div className="space-y-2">
              <Label>Protection Method</Label>
              <Select
                value={settings.method}
                onValueChange={(value: "blur" | "block" | "watermark") =>
                  handleSettingChange("method", value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="blur">Blur Content</SelectItem>
                  <SelectItem value="block">Block Screenshot</SelectItem>
                  <SelectItem value="watermark">Show Watermark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Message */}
            <div className="space-y-2">
              <Label>Custom Warning Message</Label>
              <Input
                value={settings.customMessage || ""}
                onChange={(e) => handleSettingChange("customMessage", e.target.value)}
                placeholder="Enter message shown on screenshot attempt"
              />
            </div>

            {/* Additional Protection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Block Print Screen</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable print screen functionality
                  </p>
                </div>
                <Switch
                  checked={settings.blockPrintScreen}
                  onCheckedChange={(checked) =>
                    handleSettingChange("blockPrintScreen", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Prevent Download</Label>
                  <p className="text-sm text-muted-foreground">
                    Disable document download
                  </p>
                </div>
                <Switch
                  checked={settings.preventDownload}
                  onCheckedChange={(checked) =>
                    handleSettingChange("preventDownload", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Hide Content</Label>
                  <p className="text-sm text-muted-foreground">
                    Hide content when window loses focus
                  </p>
                </div>
                <Switch
                  checked={settings.hideContent}
                  onCheckedChange={(checked) =>
                    handleSettingChange("hideContent", checked)
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify on Attempt</Label>
                  <p className="text-sm text-muted-foreground">
                    Send notification on capture attempts
                  </p>
                </div>
                <Switch
                  checked={settings.notifyOnAttempt}
                  onCheckedChange={(checked) =>
                    handleSettingChange("notifyOnAttempt", checked)
                  }
                />
              </div>
            </div>
          </>
        )}

        {/* Protection Summary */}
        {settings.enabled && (
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium mb-2">Protection Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Camera className="h-4 w-4 mr-2 text-green-500" />
                {settings.method === "blur" && "Content will be blurred on capture attempt"}
                {settings.method === "block" && "Screenshots will be blocked"}
                {settings.method === "watermark" && "Watermark will be visible in screenshots"}
              </div>
              <div className="flex items-center text-sm">
                <ShieldAlert className="h-4 w-4 mr-2 text-blue-500" />
                Additional protections enabled: {[
                  settings.blockPrintScreen && "Print Screen blocked",
                  settings.preventDownload && "Downloads prevented",
                  settings.hideContent && "Content hiding",
                  settings.notifyOnAttempt && "Attempt notifications"
                ].filter(Boolean).join(", ")}
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setSettings(document.screenshotProtection)}
          disabled={isLoading}
        >
          Reset
        </Button>
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
      </CardFooter>
    </Card>
  )
}