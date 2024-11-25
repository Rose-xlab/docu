"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FolderKanban, MoreHorizontal, Users, Eye, Clock, Shield } from 'lucide-react'
import Link from "next/link"

interface DataRoom {
  id: string
  name: string
  documents: number
  members: number
  lastActivity: string
  created: string
}

const dataRooms: DataRoom[] = [
  { id: "1", name: "Project Alpha", documents: 15, members: 5, lastActivity: "2 hours ago", created: "2023-06-01" },
  { id: "2", name: "Financial Reports 2023", documents: 8, members: 3, lastActivity: "1 day ago", created: "2023-07-15" },
  { id: "3", name: "Marketing Campaign", documents: 12, members: 7, lastActivity: "3 hours ago", created: "2023-08-22" },
]

export function DataRoomList() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredDataRooms = dataRooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Rooms</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <Input
            placeholder="Search data rooms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Button>
            <FolderKanban className="mr-2 h-4 w-4" />
            New Data Room
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Documents</TableHead>
              <TableHead>Members</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredDataRooms.map((room) => (
              <TableRow key={room.id}>
                <TableCell className="font-medium">{room.name}</TableCell>
                <TableCell>{room.documents}</TableCell>
                <TableCell>{room.members}</TableCell>
                <TableCell>{room.lastActivity}</TableCell>
                <TableCell>{room.created}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/data-rooms/${room.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/data-rooms/${room.id}/team`}>
                          <Users className="mr-2 h-4 w-4" />
                          Manage Team
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/data-rooms/${room.id}/activity`}>
                          <Clock className="mr-2 h-4 w-4" />
                          View Activity
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/data-rooms/${room.id}/settings`}>
                          <Shield className="mr-2 h-4 w-4" />
                          Access Settings
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

