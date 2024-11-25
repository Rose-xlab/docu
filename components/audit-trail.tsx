"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface AuditEvent {
  id: string
  user: string
  action: string
  document: string
  timestamp: string
}

const auditEvents: AuditEvent[] = [
  { id: "1", user: "Alice", action: "Viewed", document: "Financial Report Q2", timestamp: "2023-07-26 09:30" },
  { id: "2", user: "Bob", action: "Edited", document: "Marketing Plan", timestamp: "2023-07-26 10:15" },
  { id: "3", user: "Charlie", action: "Shared", document: "Product Roadmap", timestamp: "2023-07-26 11:00" },
  { id: "4", user: "David", action: "Downloaded", document: "Legal Contract", timestamp: "2023-07-26 13:45" },
]

export function AuditTrail() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredEvents = auditEvents.filter(event =>
    event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.document.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audit Trail</CardTitle>
        <CardDescription>Track all actions performed on documents</CardDescription>
      </CardHeader>
      <CardContent>
        <Input
          placeholder="Search audit events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Document</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEvents.map((event) => (
              <TableRow key={event.id}>
                <TableCell>{event.user}</TableCell>
                <TableCell>{event.action}</TableCell>
                <TableCell>{event.document}</TableCell>
                <TableCell>{event.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

