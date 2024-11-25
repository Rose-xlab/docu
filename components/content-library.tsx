"use client"

import { useState } from "react"
import { Folder, File, ChevronRight, ChevronDown, Plus, Trash } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

const initialFiles: FileNode[] = [
  {
    id: "1",
    name: "Documents",
    type: "folder",
    children: [
      { id: "2", name: "Report.pdf", type: "file" },
      { id: "3", name: "Presentation.pptx", type: "file" },
      {
        id: "4",
        name: "Projects",
        type: "folder",
        children: [
          { id: "5", name: "Project A", type: "folder", children: [] },
          { id: "6", name: "Project B", type: "folder", children: [] },
        ],
      },
    ],
  },
  {
    id: "7",
    name: "Images",
    type: "folder",
    children: [
      { id: "8", name: "logo.png", type: "file" },
      { id: "9", name: "banner.jpg", type: "file" },
    ],
  },
]

function FileTree({ files, level = 0, onAddItem, onDeleteItem }: { 
  files: FileNode[]
  level?: number
  onAddItem: (parentId: string, itemType: "file" | "folder") => void
  onDeleteItem: (id: string) => void
}) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  const toggleFolder = (id: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  return (
    <ul className="space-y-1">
      {files.map((file) => (
        <li key={file.id} style={{ marginLeft: `${level * 20}px` }}>
          {file.type === "folder" ? (
            <div>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  className="w-full justify-start p-2"
                  onClick={() => toggleFolder(file.id)}
                >
                  {expandedFolders.has(file.id) ? (
                    <ChevronDown className="mr-2 h-4 w-4" />
                  ) : (
                    <ChevronRight className="mr-2 h-4 w-4" />
                  )}
                  <Folder className="mr-2 h-4 w-4" />
                  {file.name}
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Item</DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-around">
                      <Button onClick={() => onAddItem(file.id, "file")}>Add File</Button>
                      <Button onClick={() => onAddItem(file.id, "folder")}>Add Folder</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="ghost" size="sm" onClick={() => onDeleteItem(file.id)}>
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
              {expandedFolders.has(file.id) && file.children && (
                <FileTree files={file.children} level={level + 1} onAddItem={onAddItem} onDeleteItem={onDeleteItem} />
              )}
            </div>
          ) : (
            <div className="flex items-center">
              <Button variant="ghost" className="w-full justify-start p-2">
                <File className="mr-2 h-4 w-4" />
                {file.name}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDeleteItem(file.id)}>
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export function ContentLibrary() {
  const [files, setFiles] = useState(initialFiles)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddItem = (parentId: string, itemType: "file" | "folder") => {
    // Implement logic to add new file or folder
    console.log(`Adding new ${itemType} to parent ${parentId}`)
  }

  const handleDeleteItem = (id: string) => {
    // Implement logic to delete file or folder
    console.log(`Deleting item ${id}`)
  }

  return (
    <div className="h-[600px] border rounded-md">
      <div className="p-4 border-b">
        <Input
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[calc(600px-65px)]">
        <div className="p-4">
          <FileTree files={files} onAddItem={handleAddItem} onDeleteItem={handleDeleteItem} />
        </div>
      </ScrollArea>
    </div>
  )
}

