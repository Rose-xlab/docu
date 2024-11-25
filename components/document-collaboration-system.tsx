"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as Icons from 'lucide-react'

interface User {
  id: string
  name: string
  email: string
  role: 'owner' | 'editor' | 'viewer'
  isOnline: boolean
  lastActive?: string
  documents: string[]
  avatar?: string
}

interface Document {
  id: string
  title: string
  collaborators: string[]
  lastModified: string
  status: 'draft' | 'review' | 'published'
  comments: Comment[]
  createdBy: string
}

interface Comment {
  id: string
  userId: string
  text: string
  timestamp: string
  mentions: string[]
  reactions: Record<string, string[]>
  attachments?: Array<{
    name: string
    url: string
    type: string
  }>
}

interface DocumentCollaborationSystemProps {
  defaultTab?: 'team' | 'documents'
}

export function DocumentCollaborationSystem({ defaultTab = 'team' }: DocumentCollaborationSystemProps) {
  const [activeTab, setActiveTab] = useState(defaultTab)
  const [users, setUsers] = useState<User[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [showInviteDialog, setShowInviteDialog] = useState(false)
  const [showDocumentDialog, setShowDocumentDialog] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<string>()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInviteUser = async (email: string, role: string) => {
    setIsLoading(true)
    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role: role as 'editor' | 'viewer',
        isOnline: false,
        documents: [],
        avatar: `https://avatar.vercel.sh/${email}`
      }
      setUsers(prev => [...prev, newUser])
      toast({ title: "User invited successfully" })
    } catch (error) {
      toast({ 
        title: "Error inviting user", 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveUser = async (userId: string) => {
    try {
      setUsers(users.filter(user => user.id !== userId))
      setDocuments(documents.map(doc => ({
        ...doc,
        collaborators: doc.collaborators.filter(id => id !== userId)
      })))
      toast({ title: "User removed successfully" })
    } catch (error) {
      toast({ 
        title: "Error removing user", 
        variant: "destructive" 
      })
    }
  }

  const handleCreateDocument = (title: string) => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title,
      collaborators: [users[0]?.id], // Owner
      lastModified: new Date().toISOString(),
      status: 'draft',
      comments: [],
      createdBy: users[0]?.id
    }
    setDocuments(prev => [...prev, newDoc])
    toast({ title: "Document created successfully" })
  }

  const handleAddToDocument = (userId: string, documentId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === documentId 
        ? { ...doc, collaborators: [...doc.collaborators, userId] }
        : doc
    ))
    setUsers(users.map(user =>
      user.id === userId
        ? { ...user, documents: [...user.documents, documentId] }
        : user
    ))
    toast({ title: "Collaborator added to document" })
  }

  const handleUpdateUserRole = (userId: string, newRole: 'editor' | 'viewer') => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, role: newRole } : user
    ))
    toast({ title: "User role updated" })
  }

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Document Collaboration Platform</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-xs"
            />
            <Button onClick={() => setShowInviteDialog(true)}>
              <Icons.UserPlus className="mr-2 h-4 w-4" />
              Invite User
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="team">Team Management</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="team">
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'owner' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.isOnline ? 'success' : 'secondary'}
                          className={user.isOnline ? 'bg-green-100 text-green-800' : ''}
                        >
                          {user.isOnline ? 'Online' : 'Offline'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          className="text-sm"
                          onClick={() => setSelectedDocument(user.documents[0])}
                        >
                          {user.documents.length} documents
                        </Button>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Icons.MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'editor')}>
                              <Icons.Edit className="mr-2 h-4 w-4" />
                              Make Editor
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateUserRole(user.id, 'viewer')}>
                              <Icons.Eye className="mr-2 h-4 w-4" />
                              Make Viewer
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleRemoveUser(user.id)}
                              className="text-red-600"
                            >
                              <Icons.UserMinus className="mr-2 h-4 w-4" />
                              Remove User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="space-y-4">
              <Button onClick={() => setShowDocumentDialog(true)}>
                <Icons.FileText className="mr-2 h-4 w-4" />
                Create Document
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{doc.title}</h3>
                        <p className="text-sm text-gray-500">
                          {doc.collaborators.length} collaborators
                        </p>
                        <Badge className="mt-2" variant={
                          doc.status === 'published' ? 'default' :
                          doc.status === 'review' ? 'secondary' : 'outline'
                        }>
                          {doc.status}
                        </Badge>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Icons.MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>
                            <Icons.Users className="mr-2 h-4 w-4" />
                            Manage Access
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Icons.History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Icons.Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <ScrollArea className="h-20 mt-4">
                      <div className="flex -space-x-2">
                        {doc.collaborators.map(userId => {
                          const user = users.find(u => u.id === userId)
                          return user ? (
                            <Avatar key={user.id} className="border-2 border-white">
                              <AvatarImage src={user.avatar} />
                              <AvatarFallback>{user.name[0]}</AvatarFallback>
                            </Avatar>
                          ) : null
                        })}
                      </div>
                    </ScrollArea>

                    <CardFooter className="px-0 pt-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Icons.Clock className="mr-1 h-4 w-4" />
                        Last modified {new Date(doc.lastModified).toLocaleDateString()}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Invite User Dialog */}
      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleInviteUser(
              formData.get('email') as string,
              formData.get('role') as string
            )
            setShowInviteDialog(false)
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Email</label>
                <Input required type="email" name="email" />
              </div>
              <div className="space-y-2">
                <label>Role</label>
                <select name="role" className="w-full p-2 border rounded-md">
                  <option value="editor">Editor</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowInviteDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Inviting..." : "Invite"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create Document Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleCreateDocument(formData.get('title') as string)
            setShowDocumentDialog(false)
          }}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Title</label>
                <Input required name="title" />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={() => setShowDocumentDialog(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}