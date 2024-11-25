// components/ui/color-picker.tsx
"use client"

import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
  className?: string
}

const predefinedColors = [
  "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
  "#FFFF00", "#00FFFF", "#FF00FF", "#C0C0C0", "#808080",
  "#800000", "#808000", "#008000", "#800080", "#008080",
  "#000080", "#FFA500", "#A52A2A", "#800020", "#40E0D0"
]

export function ColorPicker({ color, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value)
  }

  const handlePredefinedColorClick = (predefinedColor: string) => {
    onChange(predefinedColor)
    setIsOpen(false)
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[220px] justify-start text-left font-normal", className)}
        >
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded border"
              style={{ backgroundColor: color }}
            />
            <span>{color}</span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Pick a color</h4>
            <p className="text-sm text-muted-foreground">
              Choose from predefined colors or enter a custom hex value.
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="custom-color">Custom Color</Label>
            <Input
              id="custom-color"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="h-10"
            />
          </div>
          <div className="grid gap-2">
            <Label>Predefined Colors</Label>
            <div className="grid grid-cols-5 gap-2">
              {predefinedColors.map((predefinedColor) => (
                <Button
                  key={predefinedColor}
                  variant="outline"
                  className="w-full p-0 h-8"
                  onClick={() => handlePredefinedColorClick(predefinedColor)}
                >
                  <div
                    className="w-full h-full rounded-sm"
                    style={{ backgroundColor: predefinedColor }}
                  />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}