"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Document {
  id: string
  name: string
  expirationDate: string
  status: "active" | "expired" | "expiring soon"
}

const documents: Document[] = [
  { id: "1", name: "Financial Report Q2.pdf", expirationDate: "2023-08-15", status: "active" },
  { id: "2", name: "Marketing Plan.docx", expirationDate: "2023-07-30", status: "expiring soon" },
  { id: "3", name: "Product Roadmap.pptx", expirationDate: "2023-09-01", status: "active" },
  { id: "4", name: "Legal Contract.pdf", expirationDate: "2023-07-20", status: "expired" },
]

export function DocumentExpiration() {
  const [newExpirationDate, setNewExpirationDate] = useState("")

  const handleUpdateExpiration = (documentId: string) => {
    console.log(`Updating expiration for document ${documentId} to ${newExpirationDate}`)
    // Implement update logic here
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Expiration</CardTitle>
        <CardDescription>Manage document lifecycles and expirations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Expiration Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell>{doc.name}</TableCell>
                <TableCell>{doc.expirationDate}</
TableCell>
                <TableCell>
                  <Badge
                    variant={doc.status === "active" ? "default" : doc.status === "expiring soon" ? "warning" : "destructive"}
                  >
                    {doc.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="date"
                      value={newExpirationDate}
                      onChange={(e) => setNewExpirationDate(e.target.value)}
                    />
                    <Button onClick={() => handleUpdateExpiration(doc.id)}>Update</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <Button>Set Global Expiration Policy</Button>
      </CardFooter>
    </Card>
  )
}

