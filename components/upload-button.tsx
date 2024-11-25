"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, FileUp, Cloud } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "@/components/ui/use-toast"

export function UploadButton() {
  const [isUploading, setIsUploading] = useState(false)

  const handleLocalUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      // Implement file upload logic here
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulating upload
      setIsUploading(false)
      toast({
        title: "File Uploaded",
        description: `${file.name} has been successfully uploaded.`,
      })
    }
  }

  const handleCloudImport = () => {
    // Implement cloud import logic here
    toast({
      title: "Cloud Import",
      description: "Cloud import feature is not implemented yet.",
    })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>
          <label className="flex w-full cursor-pointer items-center">
            <FileUp className="mr-2 h-4 w-4" />
            <span>Local Upload</span>
            <input
              type="file"
              className="hidden"
              onChange={handleLocalUpload}
              disabled={isUploading}
            />
          </label>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={handleCloudImport}>
          <Cloud className="mr-2 h-4 w-4" />
          <span>Import from Cloud</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

