"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Document {
  id: string
  name: string
  type: string
  size: string
}

const documents: Document[] = [
  { id: "1", name: "Financial Report Q2.pdf", type: "PDF", size: "2.5 MB" },
  { id: "2", name: "Marketing Plan.docx", type: "Word", size: "1.8 MB" },
  { id: "3", name: "Product Roadmap.pptx", type: "PowerPoint", size: "4.2 MB" },
  { id: "4", name: "Legal Contract.pdf", type: "PDF", size: "0.9 MB" },
]

export function BulkOperations() {
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([])

  const toggleDocument = (documentId: string) => {
    setSelectedDocuments(prev =>
      prev.includes(documentId)
        ? prev.filter(id => id !== documentId)
        : [...prev, documentId]
    )
  }

  const toggleAll = () => {
    setSelectedDocuments(prev =>
      prev.length === documents.length ? [] : documents.map(doc => doc.id)
    )
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on:`, selectedDocuments)
    // Implement bulk action logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Operations</CardTitle>
        <CardDescription>Manage multiple documents at once</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedDocuments.length === documents.length}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Size</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedDocuments.includes(doc.id)}
                    onCheckedChange={() => toggleDocument(doc.id)}
                  />
                </TableCell>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.type}</TableCell>
                <TableCell>{doc.size}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button disabled={selectedDocuments.length === 0}>Bulk Actions</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleBulkAction("share")}>Share</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("download")}>Download</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkAction("delete")}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardFooter>
    </Card>
  )
}

