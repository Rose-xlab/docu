"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  MoreHorizontal,
  ArrowUpDown,
  Eye,
  Download,
  Ban,
  RefreshCw,
  Upload,
  Settings,
  Share2,
  Shield,
  FileText,
  BarChart,
  Lock,
  Copy,
  Trash2,
  History,
  ImageIcon,
  MessageSquare,
  Users,
  Filter,
  Archive,
  AlertCircle,
  ChevronDown,
  Search,
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Socket } from 'socket.io-client'

// Import feature components
import { ShareOptions } from "@/components/share-options"
import { DocumentProtection } from "@/components/document-protection"
import { AccessSettings } from "@/components/access-settings"
import { AuditTrail } from "@/components/audit-trail"
import { ScreenshotProtection } from "@/components/screenshot-protection"
import { CustomQAPage } from "@/components/custom-qa-page"
import { WatermarkSettings } from "@/components/watermark-settings"
import { DocumentAnalytics } from "@/components/document-analytics"

interface Document {
  id: string
  name: string
  views: number
  status: "active" | "archived"
  createdAt: Date
  allowDownload: boolean
  version: number
  lastViewed?: string
  lastViewedLocation?: string
  sharing: {
    type: "private" | "restricted" | "public"
    allowedUsers: string[]
    allowedDomains?: string[]
    expirationDate?: string
    password?: string
  }
  protection: {
    watermark: boolean
    watermarkText?: string
    screenshot: boolean
    expiryDate?: string
    downloadLimit?: number
    passwordProtected: boolean
    password?: string
  }
  analytics: {
    totalViews: number
    uniqueViews: number
    averageTimeSpent: number
    locations: { country: string; views: number }[]
    devices: { type: string; count: number }[]
  }
  qa: {
    enabled: boolean
    items: {
      id: string
      question: string
      answer: string
      timestamp: string
    }[]
  }
  audit: {
    events: {
      id: string
      type: string
      user: string
      timestamp: string
      details: string
    }[]
  }
}

interface DocumentModalProps {
  document: Document
  mode: 'view' | 'edit' | 'share' | 'protect' | 'analytics'
  isOpen: boolean
  onClose: () => void
  onUpdate: (document: Document) => void
}

function DocumentModal({ document, mode, isOpen, onClose, onUpdate }: DocumentModalProps) {
  const [activeTab, setActiveTab] = useState(mode)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isExpanded ? 'max-w-full h-screen' : 'max-w-4xl'} max-h-[90vh] p-0 overflow-hidden flex flex-col`}>
        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">
                {document.name}
              </DialogTitle>
              <DialogDescription className="text-blue-100">
                Manage document settings and properties
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white hover:bg-white/20"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronDown className="h-4 w-4 rotate-180" />}
            </Button>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as any)} className="flex-1 overflow-hidden">
          <TabsList className="px-6 bg-gray-100 dark:bg-gray-800 border-b">
            <TabsTrigger value="details" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <FileText className="w-4 h-4 mr-2" />
              Details
            </TabsTrigger>
            <TabsTrigger value="share" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </TabsTrigger>
            <TabsTrigger value="protect" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Shield className="w-4 h-4 mr-2" />
              Protect
            </TabsTrigger>
            <TabsTrigger value="access" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <Lock className="w-4 h-4 mr-2" />
              Access
            </TabsTrigger>
            <TabsTrigger value="watermark" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <ImageIcon className="w-4 h-4 mr-2" />
              Watermark
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              <BarChart className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <ScrollArea className="flex-1">
            <div className="p-6">
              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <CardTitle>Document Details</CardTitle>
                    <CardDescription>View and edit document information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Document Info</h4>
                        <div className="space-y-2">
                          <div>Name: {document.name}</div>
                          <div>Version: {document.version}</div>
                          <div>Status: {document.status}</div>
                          <div>Created: {format(document.createdAt, "PPP")}</div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Statistics</h4>
                        <div className="space-y-2">
                          <div>Views: {document.analytics.totalViews}</div>
                          <div>Unique Views: {document.analytics.uniqueViews}</div>
                          <div>Avg Time: {document.analytics.averageTimeSpent}s</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="share">
                <ShareOptions document={document} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="protect">
                <DocumentProtection document={document} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="access">
                <AccessSettings document={document} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="watermark">
                <WatermarkSettings document={document} onUpdate={onUpdate} />
              </TabsContent>

              <TabsContent value="analytics">
                <DocumentAnalytics document={document} />
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function UploadModal({ isOpen, onClose, onUpload }: {
  isOpen: boolean
  onClose: () => void
  onUpload: (file: File) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  const handleFileUpload = async (file: File) => {
    try {
      setIsUploading(true)
      await onUpload(file)
      onClose()
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your document.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your library
          </DialogDescription>
        </DialogHeader>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${dragOver ? 'border-primary bg-primary/5' : 'border-muted'}
            ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => {
            const input = document.createElement('input')
            input.type = 'file'
            input.accept = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx'
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0]
              if (file) handleFileUpload(file)
            }
            input.click()
          }}
        >
          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-1">
            {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-sm text-muted-foreground">
            Supports PDF, Word, PowerPoint, and Excel files up to 50MB
          </p>
        </div>

        <DialogFooter className="sm:justify-start">
          <Button variant="secondary" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function DocumentList({ socket }: { socket: Socket }) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null)
  const [modalMode, setModalMode] = useState<'view' | 'edit' | 'share' | 'protect' | 'analytics'>('view')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoading(true)
      // In a real app, this would be an API call
      const mockDocuments: Document[] = [
        {
          id: "1",
          name: "Project Proposal",
          views: 120,
          status: "active",
          createdAt: new Date("2023-01-15"),
          allowDownload: true,
          version: 1,
          sharing: {
            type: "restricted",
            allowedUsers: ["john@example.com", "jane@example.com"],
          },
          protection: {
            watermark: true,
            watermarkText: "Confidential",
            screenshot: false,
            passwordProtected: true,
            password: "securepass",
          },
          analytics: {
            totalViews: 120,
            uniqueViews: 85,
            averageTimeSpent: 300,
            locations: [
              { country: "USA", views: 50 },
              { country: "UK", views: 30 },
            ],
            devices: [
              { type: "Desktop", count: 70 },
              { type: "Mobile", count: 50 },
            ],
          },
          qa: {
            enabled: true,
            items: [],
          },
          audit: {
            events: [],
          },
        },
        // Add more mock documents as needed
      ]
      setDocuments(mockDocuments)
      setIsLoading(false)
    }

    fetchDocuments()
  }, [])

  useEffect(() => {
    if (!socket) return

    const handleConnect = () => {
      setIsSocketConnected(true)
      toast({
        title: "Connected",
        description: "Real-time updates are now active",
      })
    }

    const handleDisconnect = () => {
      setIsSocketConnected(false)
      toast({
        title: "Disconnected",
        description: "Real-time updates are currently disabled",
        variant: "destructive",
      })
    }

    socket.on('connect', handleConnect)
    socket.on('disconnect', handleDisconnect)
    setIsSocketConnected(socket.connected)

    return () => {
      socket.off('connect', handleConnect)
      socket.off('disconnect', handleDisconnect)
    }
  }, [socket])

  const handleDocumentUpload = async (file: File) => {
    try {
      // In a real app, upload to server/storage
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        views: 0,
        status: "active",
        createdAt: new Date(),
        allowDownload: true,
        version: 1,
        sharing: {
          type: "private",
          allowedUsers: []
        },
        protection: {
          watermark: false,
          screenshot: false,
          passwordProtected: false
        },
        analytics: {
          totalViews: 0,
          uniqueViews: 0,
          averageTimeSpent: 0,
          locations: [],
          devices: []
        },
        qa: {
          enabled: false,
          items: []
        },
        audit: {
          events: []
        }
      }

      if (isSocketConnected) {
        socket.emit('newDocument', newDoc)
      }

      setDocuments(prev => [...prev, newDoc])
      toast({
        title: "Document Uploaded",
        description: `${file.name} has been uploaded successfully`
      })
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload document",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleUpdateDocument = (updatedDoc: Document) => {
    if (!isSocketConnected) {
      toast({
        title: "Connection Error",
        description: "Unable to update document. Please check your connection.",
        variant: "destructive",
      })
      return
    }

    socket.emit('updateDocument', updatedDoc)
    setDocuments(prev => 
      prev.map(doc => doc.id === updatedDoc.id ? updatedDoc : doc)
    )
  }

  const handleBulkAction = (action: 'delete' | 'archive' | 'download') => {
    if (selectedRows.length === 0) {
      toast({
        title: "No Documents Selected",
        description: "Please select documents to perform this action",
        variant: "destructive"
      })
      return
    }

    switch (action) {
      case 'delete':
        if (isSocketConnected) {
          socket.emit('deleteDocuments', selectedRows)
        }
        setDocuments(prev => prev.filter(doc => !selectedRows.includes(doc.id)))
        toast({
          title: "Documents Deleted",
          description: `${selectedRows.length} document(s) have been deleted`
        })
        break

      case 'archive':
        setDocuments(prev => prev.map(doc => 
          selectedRows.includes(doc.id) 
            ? { ...doc, status: "archived" } 
            : doc
        ))
        toast({
          title: "Documents Archived",
          description: `${selectedRows.length} document(s) have been archived`
        })
        break

      case 'download':
        // Implement download logic
        toast({
          title: "Download Started",
          description: `Downloading ${selectedRows.length} document(s)`
        })
        break
    }

    setSelectedRows([])
  }

  const columns: ColumnDef<Document>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>{row.getValue("name")}</span>
          {row.original.protection.passwordProtected && (
            <Lock className="h-4 w-4 text-muted-foreground" />
          )}
          {row.original.protection.watermark && (
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      ),
    },
    {
      accessorKey: "sharing.type",
      header: "Access",
      cell: ({ row }) => {
        const type = row.original.sharing.type
        return (
          <Badge variant={
            type === "public" ? "default" :
            type === "restricted" ? "secondary" :
            "outline"
          }>
            {type}
          </Badge>
        )
      },
    },
    {
      accessorKey: "analytics.totalViews",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Views
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span>{row.original.analytics.totalViews}</span>
        </div>
      ),
    },
    {
      accessorKey: "version",
      header: "Version",
      cell: ({ row }) => (
        <div className="flex items-center space-x-1">
          <span>v{row.getValue("version")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => format(row.getValue("createdAt"), "MMM d, yyyy"),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const document = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => {
                setSelectedDocument(document)
                setModalMode('view')
              }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedDocument(document)
                setModalMode('share')
              }}>
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedDocument(document)
                setModalMode('protect')
              }}>
                <Shield className="mr-2 h-4 w-4" />
                Protection
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {
                setSelectedDocument(document)
                setModalMode('analytics')
              }}>
                <BarChart className="mr-2 h-4 w-4" />
                Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}/documents/${document.id}`
                  )
                  toast({ title: "Link Copied" })
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => {
                  setDocuments(prev => 
                    prev.filter(doc => doc.id !== document.id)
                  )
                  toast({
                    title: "Document Deleted",
                    description: `${document.name} has been deleted`
                  })
                }}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data: documents,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Document Library</CardTitle>
            <CardDescription>Manage and organize your documents</CardDescription>
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </CardHeader>
        <CardContent>
          {/* Top Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="pl-8 max-w-sm"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Checkbox className="mr-2" />
                    Active Only
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox className="mr-2" />
                    Shared Only
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Checkbox className="mr-2" />
                    Protected Only
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={isSocketConnected ? "default" : "destructive"}>
                {isSocketConnected ? "Connected" : "Disconnected"}
              </Badge>
              
              {selectedRows.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Bulk Actions ({selectedRows.length})
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleBulkAction('download')}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkAction('archive')}>
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => handleBulkAction('delete')}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No documents found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {selectedRows.length} of {documents.length} document(s) selected
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      {selectedDocument && (
        <DocumentModal
          document={selectedDocument}
          mode={modalMode}
          isOpen={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onUpdate={handleUpdateDocument}
        />
      )}

      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleDocumentUpload}
      />
    </div>
  )
}