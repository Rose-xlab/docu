"use client"

import React, { useState, useCallback } from 'react'
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Image, Type, RefreshCw, Upload, Eye, EyeOff, Italic, Bold, AlignLeft, AlignCenter, AlignRight, Copy, Save, Trash, Layout, Layers, Grid, FileText, QrCode, Variable, LayoutTemplateIcon as TemplateIcon, Settings2, Maximize, Minimize, MoveHorizontal, MoveVertical, RotateCw, Info } from 'lucide-react'

// Types and Interfaces
interface WatermarkPosition {
  type: "fixed" | "relative"
  x: number
  y: number
  unit: "px" | "%" | "center"
}

interface WatermarkSize {
  width: number
  height: number
  unit: "px" | "%"
  keepAspectRatio: boolean
  autoFit: boolean
}

interface WatermarkTextStyle {
  fontFamily: string
  fontSize: number
  fontWeight: "normal" | "bold"
  fontStyle: "normal" | "italic"
  textAlign: "left" | "center" | "right"
  letterSpacing: number
  lineHeight: number
  textTransform: "none" | "uppercase" | "lowercase"
  textDecoration: "none" | "underline"
}

interface WatermarkVariable {
  type: "text" | "date" | "user" | "page" | "custom"
  value: string
  label: string
  placeholder?: string
}

interface WatermarkLayer {
  type: "text" | "image" | "qr"
  id: string
  enabled: boolean
  content: string
  position: WatermarkPosition
  size: WatermarkSize
  style: WatermarkTextStyle
  opacity: number
  rotation: number
  zIndex: number
  blendMode: string
  repeat: boolean
  repeatSpacing: number
  variables: WatermarkVariable[]
}

interface WatermarkTemplate {
  id: string
  name: string
  preview?: string
  layers: WatermarkLayer[]
  settings: {
    pages: "all" | "first" | "custom"
    selectedPages: number[]
    showOnPrint: boolean
    showOnDownload: boolean
    preventCopy: boolean
    minScale: number
    maxScale: number
    responsive: boolean
  }
}

interface WatermarkSettings {
  enabled: boolean
  templates: WatermarkTemplate[]
  activeTemplate: string
  activeLayers: WatermarkLayer[]
  globalSettings: {
    defaultOpacity: number
    defaultBlendMode: string
    defaultPosition: WatermarkPosition
    preventRemoval: boolean
    trackChanges: boolean
  }
}

interface Document {
  id: string
  name: string
  watermark: WatermarkSettings
  totalPages: number
}

interface WatermarkSettingsProps {
  document: Document
  onUpdate: (document: Document) => void
}

// Constants
const DEFAULT_TEXT_STYLE: WatermarkTextStyle = {
  fontFamily: "Arial, sans-serif",
  fontSize: 24,
  fontWeight: "normal",
  fontStyle: "normal",
  textAlign: "center",
  letterSpacing: 0,
  lineHeight: 1.2,
  textTransform: "none",
  textDecoration: "none"
}

const BLEND_MODES = [
  "normal",
  "multiply",
  "screen",
  "overlay",
  "darken",
  "lighten",
  "color-dodge",
  "color-burn",
  "difference",
  "exclusion"
]

const AVAILABLE_FONTS = [
  { name: "Arial", value: "Arial, sans-serif" },
  { name: "Times New Roman", value: "Times New Roman, serif" },
  { name: "Helvetica", value: "Helvetica, sans-serif" },
  { name: "Georgia", value: "Georgia, serif" },
  { name: "Courier", value: "Courier, monospace" }
]

const DEFAULT_VARIABLES: WatermarkVariable[] = [
  { type: "date", value: "{date}", label: "Current Date" },
  { type: "user", value: "{user}", label: "User Name" },
  { type: "page", value: "{page}", label: "Page Number" },
  { type: "text", value: "{docname}", label: "Document Name" }
]

const DEFAULT_TEMPLATES: WatermarkTemplate[] = [
  {
    id: "confidential",
    name: "Confidential",
    layers: [
      {
        id: "1",
        type: "text",
        enabled: true,
        content: "CONFIDENTIAL",
        position: { type: "relative", x: 50, y: 50, unit: "%" },
        size: { width: 80, height: 40, unit: "%", keepAspectRatio: false, autoFit: true },
        style: {
          ...DEFAULT_TEXT_STYLE,
          fontSize: 48,
          fontWeight: "bold",
          textTransform: "uppercase"
        },
        opacity: 30,
        rotation: -45,
        zIndex: 1,
        blendMode: "multiply",
        repeat: true,
        repeatSpacing: 200,
        variables: []
      }
    ],
    settings: {
      pages: "all",
      selectedPages: [],
      showOnPrint: true,
      showOnDownload: true,
      preventCopy: true,
      minScale: 0.5,
      maxScale: 1.5,
      responsive: true
    }
  },
]

// Helper Components
const LayerPreview = ({ layer }: { layer: WatermarkLayer }) => {
  const getPreviewStyle = () => {
    const style: React.CSSProperties = {
      opacity: layer.opacity / 100,
      transform: `rotate(${layer.rotation}deg)`,
      position: 'absolute',
      mixBlendMode: layer.blendMode as any,
      zIndex: layer.zIndex,
    }

    if (layer.position.type === 'fixed') {
      style.left = `${layer.position.x}${layer.position.unit}`
      style.top = `${layer.position.y}${layer.position.unit}`
    } else {
      style.left = '50%'
      style.top = '50%'
      style.transform += ' translate(-50%, -50%)'
    }

    if (layer.type === 'text') {
      Object.assign(style, {
        fontFamily: layer.style.fontFamily,
        fontSize: `${layer.style.fontSize}px`,
        fontWeight: layer.style.fontWeight,
        fontStyle: layer.style.fontStyle,
        textAlign: layer.style.textAlign,
        letterSpacing: `${layer.style.letterSpacing}px`,
        lineHeight: layer.style.lineHeight,
        textTransform: layer.style.textTransform,
        textDecoration: layer.style.textDecoration,
      })
    }

    return style
  }

  return (
    <div style={getPreviewStyle()}>
      {layer.type === 'text' && layer.content}
      {layer.type === 'image' && (
        <img src={layer.content} alt="Watermark" style={{ maxWidth: '100%', maxHeight: '100%' }} />
      )}
      {layer.type === 'qr' && (
        <div className="bg-black p-2 rounded">
          <QrCode className="h-8 w-8 text-white" />
        </div>
      )}
    </div>
  )
}

export function WatermarkSettings({ document, onUpdate }: WatermarkSettingsProps) {
  // State Management
  const [settings, setSettings] = useState<WatermarkSettings>({
    enabled: document.watermark?.enabled ?? false,
    templates: document.watermark?.templates ?? DEFAULT_TEMPLATES,
    activeTemplate: document.watermark?.activeTemplate ?? 'confidential',
    activeLayers: document.watermark?.activeLayers ?? [],
    globalSettings: document.watermark?.globalSettings ?? {
      defaultOpacity: 50,
      defaultBlendMode: 'multiply',
      defaultPosition: { type: 'relative', x: 50, y: 50, unit: '%' },
      preventRemoval: false,
      trackChanges: true
    }
  })

  const [activeTab, setActiveTab] = useState<'template' | 'custom'>('template')
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null)
  const [previewMode, setPreviewMode] = useState<'single' | 'all'>('single')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [showVariables, setShowVariables] = useState(false)

  // Handlers
  const handleSettingChange = useCallback((
    key: keyof WatermarkSettings,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }, [])

  const handleLayerChange = useCallback((
    layerId: string,
    key: keyof WatermarkLayer,
    value: any
  ) => {
    setSettings(prev => ({
      ...prev,
      activeLayers: prev.activeLayers.map(layer =>
        layer.id === layerId
          ? { ...layer, [key]: value }
          : layer
      )
    }))
  }, [])

  const handleAddLayer = useCallback((type: WatermarkLayer['type']) => {
    const newLayer: WatermarkLayer = {
      id: Date.now().toString(),
      type,
      enabled: true,
      content: type === 'text' ? 'New Watermark' : '',
      position: settings.globalSettings.defaultPosition,
      size: { width: 100, height: 100, unit: '%', keepAspectRatio: true, autoFit: true },
      style: DEFAULT_TEXT_STYLE,
      opacity: settings.globalSettings.defaultOpacity,
      rotation: 0,
      zIndex: settings.activeLayers.length + 1,
      blendMode: settings.globalSettings.defaultBlendMode,
      repeat: false,
      repeatSpacing: 200,
      variables: []
    }

    setSettings(prev => ({
      ...prev,
      activeLayers: [...prev.activeLayers, newLayer]
    }))
    setSelectedLayer(newLayer.id)
  }, [settings.globalSettings, settings.activeLayers])

  const handleRemoveLayer = useCallback((layerId: string) => {
    setSettings(prev => ({
      ...prev,
      activeLayers: prev.activeLayers.filter(layer => layer.id !== layerId)
    }))
    if (selectedLayer === layerId) {
      setSelectedLayer(null)
    }
  }, [selectedLayer])

  const handleSaveTemplate = useCallback(() => {
    const templateName = prompt('Enter template name:')
    if (templateName) {
      const newTemplate: WatermarkTemplate = {
        id: Date.now().toString(),
        name: templateName,
        layers: settings.activeLayers,
        settings: {
          pages: 'all',
          selectedPages: [],
          showOnPrint: true,
          showOnDownload: true,
          preventCopy: true,
          minScale: 0.5,
          maxScale: 1.5,
          responsive: true
        }
      }

      setSettings(prev => ({
        ...prev,
        templates: [...prev.templates, newTemplate]
      }))

      toast({
        title: 'Template Saved',
        description: `Template "${templateName}" has been saved successfully.`
      })
    }
  }, [settings.activeLayers])

  const handleLoadTemplate = useCallback((templateId: string) => {
    const template = settings.templates.find(t => t.id === templateId)
    if (template) {
      setSettings(prev => ({
        ...prev,
        activeTemplate: templateId,
        activeLayers: template.layers
      }))
      setSelectedLayer(null)
    }
  }, [settings.templates])

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate({
        ...document,
        watermark: settings
      })
      toast({
        title: 'Settings Saved',
        description: 'Watermark settings have been updated successfully.'
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save watermark settings.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const getVariableValue = useCallback((variable: WatermarkVariable) => {
    switch (variable.type) {
      case 'date':
        return new Date().toLocaleDateString()
      case 'user':
        return 'Current User' // Replace with actual user name
      case 'page':
        return currentPage.toString()
      case 'custom':
        return variable.placeholder || variable.value
      default:
        return variable.value
    }
  }, [currentPage])

  return (
    <ScrollArea className="h-[calc(100vh-4rem)] w-full">
      <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Watermark Settings</CardTitle>
                <CardDescription className="text-gray-100">
                  Configure watermark appearance and behavior
                </CardDescription>
              </div>
              <Switch
                checked={settings.enabled}
                onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
                className="bg-white"
              />
            </div>
          </CardHeader>

          {settings.enabled && (
            <CardContent className="space-y-6 p-6">
              <Tabs value={activeTab} onValueChange={(value: 'template' | 'custom') => setActiveTab(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="template" className="text-lg">
                    <TemplateIcon className="w-5 h-5 mr-2" />
                    Templates
                  </TabsTrigger>
                  <TabsTrigger value="custom" className="text-lg">
                    <Settings2 className="w-5 h-5 mr-2" />
                    Custom Design
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="template">
                  <ScrollArea className="h-[400px] pr-4">
                    <div className="grid grid-cols-2 gap-4">
                      {settings.templates.map(template => (
                        <Button
                          key={template.id}
                          variant={settings.activeTemplate === template.id ? "default" : "outline"}
                          className="h-auto p-4 flex flex-col items-start space-y-2 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                          onClick={() => handleLoadTemplate(template.id)}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="font-medium text-lg">{template.name}</span>
                            {template.id !== 'confidential' && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (confirm('Delete this template?')) {
                                    setSettings(prev => ({
                                      ...prev,
                                      templates: prev.templates.filter(t => t.id !== template.id)
                                    }))
                                  }
                                }}
                              >
                                <Trash className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                          <div className="relative w-full h-24 border rounded bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            {template.preview ? (
                              <img
                                src={template.preview}
                                alt={template.name}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full text-sm text-gray-500 dark:text-gray-400">
                                Preview not available
                              </div>
                            )}
                          </div>
                        </Button>
                      ))}
                    </div>
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="custom">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="space-x-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAddLayer('text')}
                          className="bg-white dark:bg-gray-700"
                        >
                          <Type className="w-4 h-4 mr-2" />
                          Add Text
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAddLayer('image')}
                          className="bg-white dark:bg-gray-700"
                        >
                          <Image className="w-4 h-4 mr-2" />
                          Add Image
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleAddLayer('qr')}
                          className="bg-white dark:bg-gray-700"
                        >
                          <QrCode className="w-4 h-4 mr-2" />
                          Add QR Code
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        onClick={handleSaveTemplate}
                        className="bg-white dark:bg-gray-700"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save as Template
                      </Button>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-200 dark:bg-gray-700 p-4 border-b">
                        <h3 className="font-medium text-lg">Layers</h3>
                      </div>
                      <ScrollArea className="h-[200px]">
                        {settings.activeLayers.map((layer, index) => (
                          <div
                            key={layer.id}
                            className={`p-4 border-b flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
                              selectedLayer === layer.id ? 'bg-blue-50 dark:bg-blue-900' : ''
                            }`}
                            onClick={() => setSelectedLayer(layer.id)}
                          >
                            <div className="flex items-center space-x-4">
                              <Switch
                                checked={layer.enabled}
                                onCheckedChange={(checked) =>
                                  handleLayerChange(layer.id, 'enabled', checked)
                                }
                              />
                              {layer.type === 'text' && <Type className="w-4 h-4" />}
                              {layer.type === 'image' && <Image className="w-4 h-4" />}
                              {layer.type === 'qr' && <QrCode className="w-4 h-4" />}
                              <span className="text-sm font-medium">
                                {layer.type === 'text'
                                  ? layer.content.substring(0, 20) + (layer.content.length > 20 ? '...' : '')
                                  : `${layer.type.charAt(0).toUpperCase() + layer.type.slice(1)} Layer ${index + 1}`}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const newZIndex = prompt('Enter new layer order (1 = top):', 
                                    (settings.activeLayers.length - index).toString())
                                  if (newZIndex) {
                                    handleLayerChange(layer.id, 'zIndex', 
                                      parseInt(newZIndex))
                                  }
                                }}
                              >
                                <Layers className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveLayer(layer.id)
                                }}
                              >
                                <Trash className="w-4 h-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>

                    {selectedLayer && (
                      <div className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-200 dark:bg-gray-700 p-4 border-b">
                          <h3 className="font-medium text-lg">Layer Settings</h3>
                        </div>
                        <ScrollArea className="h-[400px]">
                          <div className="p-4 space-y-4">
                            {settings.activeLayers.find(l => l.id === selectedLayer)?.type === 'text' && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Text Content</Label>
                                  <div className="flex space-x-2">
                                    <Input
                                      value={settings.activeLayers.find(l => l.id === selectedLayer)?.content}
                                      onChange={(e) => handleLayerChange(selectedLayer, 'content', e.target.value)}
                                      className="flex-grow"
                                    />
                                    <Button
                                      variant="outline"
                                      onClick={() => setShowVariables(!showVariables)}
                                      className="bg-white dark:bg-gray-700"
                                    >
                                      <Variable className="w-4 h-4" />
                                    </Button>
                                  </div>
                                  {showVariables && (
                                    <div className="mt-2 p-2 border rounded-lg bg-gray-50 dark:bg-gray-800">
                                      <div className="grid grid-cols-2 gap-2">
                                        {DEFAULT_VARIABLES.map(variable => (
                                          <Button
                                            key={variable.value}
                                            variant="outline"
                                            className="justify-start text-sm"
                                            onClick={() => {
                                              const layer = settings.activeLayers.find(l => l.id === selectedLayer)
                                              if (layer) {
                                                handleLayerChange(selectedLayer, 'content',
                                                  layer.content + ' ' + variable.value)
                                              }
                                            }}
                                          >
                                            {variable.label}
                                          </Button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Font Family</Label>
                                    <Select
                                      value={settings.activeLayers.find(l => l.id === selectedLayer)?.style.fontFamily}
                                      onValueChange={(value) => handleLayerChange(selectedLayer, 'style', {
                                        ...settings.activeLayers.find(l => l.id === selectedLayer)?.style,
                                        fontFamily: value
                                      })}
                                    >
                                      <SelectTrigger className="w-full">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {AVAILABLE_FONTS.map(font => (
                                          <SelectItem
                                            key={font.value}
                                            value={font.value}
                                            style={{ fontFamily: font.value }}
                                          >
                                            {font.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>

                                  <div className="space-y-2">
                                    <Label className="text-sm font-medium">Font Size</Label>
                                    <div className="flex items-center space-x-2">
                                      <Slider
                                        min={8}
                                        max={144}
                                        step={1}
                                        value={[settings.activeLayers.find(l => l.id === selectedLayer)?.style.fontSize || 24]}
                                        onValueChange={([value]) => handleLayerChange(selectedLayer, 'style', {
                                          ...settings.activeLayers.find(l => l.id === selectedLayer)?.style,
                                          fontSize: value
                                        })}
                                        className="flex-grow"
                                      />
                                      <span className="w-12 text-sm">
                                        {settings.activeLayers.find(l => l.id === selectedLayer)?.style.fontSize}px
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                  <Button
                                    variant={settings.activeLayers.find(l => 
                                      l.id === selectedLayer)?.style.fontWeight === 'bold' 
                                      ? 'default' 
                                      : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => {
                                      const layer = settings.activeLayers.find(l => l.id === selectedLayer)
                                      if (layer) {
                                        handleLayerChange(selectedLayer, 'style', {
                                          ...layer.style,
                                          fontWeight: layer.style.fontWeight === 'bold' ? 'normal' : 'bold'
                                        })
                                      }
                                    }}
                                  >
                                    <Bold className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant={settings.activeLayers.find(l => 
                                      l.id === selectedLayer)?.style.fontStyle === 'italic' 
                                      ? 'default' 
                                      : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => {
                                      const layer = settings.activeLayers.find(l => l.id === selectedLayer)
                                      if (layer) {
                                        handleLayerChange(selectedLayer, 'style', {
                                          ...layer.style,
                                          fontStyle: layer.style.fontStyle === 'italic' ? 'normal' : 'italic'
                                        })
                                      }
                                    }}
                                  >
                                    <Italic className="w-4 h-4" />
                                  </Button>
                                  <Separator orientation="vertical" className="h-6" />
                                  <Button
                                    variant={settings.activeLayers.find(l => 
                                      l.id === selectedLayer)?.style.textAlign === 'left' 
                                      ? 'default' 
                                      : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => handleLayerChange(selectedLayer, 'style', {
                                      ...settings.activeLayers.find(l => l.id === selectedLayer)?.style,
                                      textAlign: 'left'
                                    })}
                                  >
                                    <AlignLeft className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant={settings.activeLayers.find(l => 
                                      l.id === selectedLayer)?.style.textAlign === 'center' 
                                      ? 'default' 
                                      : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => handleLayerChange(selectedLayer, 'style', {
                                      ...settings.activeLayers.find(l => l.id === selectedLayer)?.style,
                                      textAlign: 'center'
                                    })}
                                  >
                                    <AlignCenter className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant={settings.activeLayers.find(l => 
                                      l.id === selectedLayer)?.style.textAlign === 'right' 
                                      ? 'default' 
                                      : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => handleLayerChange(selectedLayer, 'style', {
                                      ...settings.activeLayers.find(l => l.id === selectedLayer)?.style,
                                      textAlign: 'right'
                                    })}
                                  >
                                    <AlignRight className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            )}

                            <div className="space-y-4">
                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Opacity</Label>
                                <div className="flex items-center space-x-2">
                                  <Slider
                                    min={0}
                                    max={100}
                                    step={1}
                                    value={[settings.activeLayers.find(l => l.id === selectedLayer)?.opacity || 100]}
                                    onValueChange={([value]) => handleLayerChange(selectedLayer, 'opacity', value)}
                                    className="flex-grow"
                                  />
                                  <span className="w-12 text-sm">
                                    {settings.activeLayers.find(l => l.id === selectedLayer)?.opacity}%
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Rotation</Label>
                                <div className="flex items-center space-x-2">
                                  <Slider
                                    min={0}
                                    max={360}
                                    step={1}
                                    value={[settings.activeLayers.find(l => l.id === selectedLayer)?.rotation || 0]}
                                    onValueChange={([value]) => handleLayerChange(selectedLayer, 'rotation', value)}
                                    className="flex-grow"
                                  />
                                  <span className="w-12 text-sm">
                                    {settings.activeLayers.find(l => l.id === selectedLayer)?.rotation}°
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-sm font-medium">Blend Mode</Label>
                                <Select
                                  value={settings.activeLayers.find(l => l.id === selectedLayer)?.blendMode}
                                  onValueChange={(value) => handleLayerChange(selectedLayer, 'blendMode', value)}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {BLEND_MODES.map(mode => (
                                      <SelectItem key={mode} value={mode}>
                                        {mode}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={settings.activeLayers.find(l => l.id === selectedLayer)?.repeat}
                                  onCheckedChange={(checked) => handleLayerChange(selectedLayer, 'repeat', checked)}
                                />
                                <Label className="text-sm font-medium">Repeat Watermark</Label>
                              </div>

                              {settings.activeLayers.find(l => l.id === selectedLayer)?.repeat && (
                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Repeat Spacing</Label>
                                  <div className="flex items-center space-x-2">
                                    <Slider
                                      min={50}
                                      max={500}
                                      step={10}
                                      value={[settings.activeLayers.find(l => l.id === selectedLayer)?.repeatSpacing || 200]}
                                      onValueChange={([value]) => handleLayerChange(selectedLayer, 'repeatSpacing', value)}
                                      className="flex-grow"
                                    />
                                    <span className="w-12 text-sm">
                                      {settings.activeLayers.find(l => l.id === selectedLayer)?.repeatSpacing}px
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </ScrollArea>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          )}
          <CardFooter className="flex justify-between bg-gray-50 dark:bg-gray-800">
            <Button variant="outline" onClick={() => {
              setSettings({
                enabled: document.watermark?.enabled ?? false,
                templates: document.watermark?.templates ?? DEFAULT_TEMPLATES,
                activeTemplate: document.watermark?.activeTemplate ?? 'confidential',
                activeLayers: document.watermark?.activeLayers ?? [],
                globalSettings: document.watermark?.globalSettings ?? {
                  defaultOpacity: 50,
                  defaultBlendMode: 'multiply',
                  defaultPosition: { type: 'relative', x: 50, y: 50, unit: '%' },
                  preventRemoval: false,
                  trackChanges: true
                }
              })
            }} disabled={isLoading}>
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
      </div>
    </ScrollArea>
  )
}