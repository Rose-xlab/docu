"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocumentVersion {
  id: string
  name: string
  content: string
}

const documentVersions: DocumentVersion[] = [
  { id: "1", name: "Version 1.0", content: "This is the original content of the document." },
  { id: "2", name: "Version 1.1", content: "This is the updated content of the document with some changes." },
  { id: "3", name: "Version 2.0", content: "This is a major revision of the document with significant changes." },
]

export function DocumentComparison() {
  const [selectedVersion1, setSelectedVersion1] = useState(documentVersions[0].id)
  const [selectedVersion2, setSelectedVersion2] = useState(documentVersions[1].id)

  const getVersionContent = (versionId: string) => {
    return documentVersions.find(v => v.id === versionId)?.content || ""
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Comparison</CardTitle>
        <CardDescription>Compare different versions of the document</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4 mb-4">
          <Select value={selectedVersion1} onValueChange={setSelectedVersion1}>
            <SelectTrigger>
              <SelectValue placeholder="Select version 1" />
            </SelectTrigger>
            <SelectContent>
              {documentVersions.map((version) => (
                <SelectItem key={version.id} value={version.id}>{version.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedVersion2} onValueChange={setSelectedVersion2}>
            <SelectTrigger>
              <SelectValue placeholder="Select version 2" />
            </SelectTrigger>
            <SelectContent>
              {documentVersions.map((version) => (
                <SelectItem key={version.id} value={version.id}>{version.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex space-x-4">
          <ScrollArea className="h-[300px] w-1/2 p-4 border rounded">
            <h3 className="font-bold mb-2">{documentVersions.find(v => v.id === selectedVersion1)?.name}</h3>
            <p>{getVersionContent(selectedVersion1)}</p>
          </ScrollArea>
          <ScrollArea className="h-[300px] w-1/2 p-4 border rounded">
            <h3 className="font-bold mb-2">{documentVersions.find(v => v.id === selectedVersion2)?.name}</h3>
            <p>{getVersionContent(selectedVersion2)}</p>
          </ScrollArea>
        </div>
      </CardContent>
      <CardFooter>
        <Button>Generate Diff Report</Button>
      </CardFooter>
    </Card>
  )
}

