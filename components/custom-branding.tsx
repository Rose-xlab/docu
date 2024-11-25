"use client"

import { useState } from "react"
import { Upload, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { ColorPicker } from "@/components/ui/color-picker"
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

const fontOptions = [
  { value: "inter", label: "Inter" },
  { value: "arial", label: "Arial" },
  { value: "helvetica", label: "Helvetica" },
  { value: "times-new-roman", label: "Times New Roman" },
  { value: "georgia", label: "Georgia" },
  { value: "roboto", label: "Roboto" },
]

export function CustomBranding() {
  // State for form values
  const [logoUrl, setLogoUrl] = useState("")
  const [primaryColor, setPrimaryColor] = useState("#000000")
  const [secondaryColor, setSecondaryColor] = useState("#ffffff")
  const [fontFamily, setFontFamily] = useState("inter")
  
  // UI states
  const [isLoading, setIsLoading] = useState(false)
  const [logoError, setLogoError] = useState(false)

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsLoading(true)
      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        const fakeUrl = URL.createObjectURL(file)
        setLogoUrl(fakeUrl)
        toast({
          title: "Logo uploaded successfully",
          description: "Your logo has been updated.",
        })
      } catch (error) {
        toast({
          title: "Error uploading logo",
          description: "Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleLogoError = () => {
    setLogoError(true)
    setLogoUrl("")
  }

  const handleSaveSettings = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const settings = {
        logoUrl,
        primaryColor,
        secondaryColor,
        fontFamily
      }
      
      console.log("Saving branding settings:", settings)
      
      toast({
        title: "Settings saved",
        description: "Your branding changes have been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Error saving settings",
        description: "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setLogoUrl("")
    setPrimaryColor("#000000")
    setSecondaryColor("#ffffff")
    setFontFamily("inter")
    toast({
      title: "Settings reset",
      description: "Your branding settings have been reset to default.",
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Branding</CardTitle>
        <CardDescription>
          Customize the look and feel of your document viewer
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Logo Section */}
        <div className="space-y-4">
          <Label>Logo</Label>
          {logoUrl && !logoError && (
            <div className="relative w-48 h-24 mb-4 border rounded-lg overflow-hidden">
              <img
                src={logoUrl}
                alt="Brand Logo"
                className="object-contain w-full h-full"
                onError={handleLogoError}
              />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => setLogoUrl("")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          <div className="flex gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="w-full max-w-xs"
              id="logo-upload"
              disabled={isLoading}
            />
            <Label
              htmlFor="logo-upload"
              className="cursor-pointer"
            >
              <Button asChild variant="outline" disabled={isLoading}>
                <span>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Logo
                </span>
              </Button>
            </Label>
          </div>
          <Input
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            placeholder="Or enter logo URL"
            className="w-full"
          />
        </div>

        {/* Colors Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <ColorPicker
              color={primaryColor}
              onChange={setPrimaryColor}
            />
          </div>
          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <ColorPicker
              color={secondaryColor}
              onChange={setSecondaryColor}
            />
          </div>
        </div>

        {/* Font Section */}
        <div className="space-y-2">
          <Label>Font Family</Label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Select a font" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>System Fonts</SelectLabel>
                {fontOptions.map(font => (
                  <SelectItem 
                    key={font.value} 
                    value={font.value}
                    style={{ fontFamily: font.value }}
                  >
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Preview Section */}
        <div className="space-y-2">
          <Label>Preview</Label>
          <div 
            className="border rounded-lg p-6"
            style={{
              backgroundColor: secondaryColor,
              color: primaryColor,
              fontFamily: fontFamily
            }}
          >
            {logoUrl && !logoError ? (
              <img
                src={logoUrl}
                alt="Brand Preview"
                className="max-h-16 mb-4"
                onError={handleLogoError}
              />
            ) : (
              <div className="h-16 bg-gray-100 rounded mb-4 flex items-center justify-center text-gray-400">
                No Logo Uploaded
              </div>
            )}
            <h3 className="text-xl font-bold mb-2">Sample Document Title</h3>
            <p className="mb-4">
              This is a preview of how your branded content will appear to users.
            </p>
            <Button
              style={{
                backgroundColor: primaryColor,
                color: secondaryColor
              }}
            >
              Sample Button
            </Button>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isLoading}
        >
          Reset to Default
        </Button>
        <Button 
          onClick={handleSaveSettings}
          disabled={isLoading}
        >
          {isLoading ? (
            <>Saving...</>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}