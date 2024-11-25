"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, UserPlus, Mail } from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: string
  lastActive: string
}

const teamMembers: TeamMember[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", lastActive: "2 hours ago" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", lastActive: "1 day ago" },
  { id: "3", name: "Charlie Brown", email: "charlie@example.com", role: "Viewer", lastActive: "3 days ago" },
]

export function TeamManagement() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search team members..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredMembers.map((member) => (
            <TableRow key={member.id}>
              <TableCell className="font-medium">
                <div className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={`https://avatar.vercel.sh/${member.email}`} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  {member.name}
                </div>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>{member.lastActive}</TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Edit Permissions
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      Remove from Data Room
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

