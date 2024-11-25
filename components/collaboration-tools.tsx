"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import {
  MessageSquare,
  Users,
  Send,
  Edit,
  Trash2,
  MoreVertical,
  UserPlus,
  AtSign,
  ThumbsUp,
  Reply,
  Link as LinkIcon,
  FileText,
  Clock,
  EyeOff,
  Flag,
  UserX,
  Settings,
  X,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'editor' | 'viewer'
  isOnline: boolean
  lastActive?: string
}

interface Comment {
  id: string
  userId: string
  parentId?: string
  text: string
  timestamp: string
  edited?: boolean
  mentions: string[]
  reactions: {
    [key: string]: string[] // userId[]
  }
  attachments?: {
    name: string
    url: string
    type: string
  }[]
}

interface CollaborationState {
  users: User[]
  comments: Comment[]
  currentUser: User
  mentionSearch: string
  replyingTo?: string
  editingComment?: string
  showUserList: boolean
}

const initialState: CollaborationState = {
  currentUser: {
    id: "1",
    name: "Current User",
    email: "current@example.com",
    role: "owner",
    isOnline: true
  },
  users: [
    {
      id: "1",
      name: "Current User",
      email: "current@example.com",
      role: "owner",
      isOnline: true
    },
    {
      id: "2",
      name: "Alice Johnson",
      email: "alice@example.com",
      role: "editor",
      isOnline: true,
      lastActive: "2 minutes ago"
    },
    {
      id: "3",
      name: "Bob Smith",
      email: "bob@example.com",
      role: "viewer",
      isOnline: false,
      lastActive: "1 hour ago"
    }
  ],
  comments: [
    {
      id: "1",
      userId: "2",
      text: "Great work on this document! @Current User what do you think about section 3?",
      timestamp: new Date().toISOString(),
      mentions: ["Current User"],
      reactions: {
        "👍": ["1", "3"],
        "❤️": ["2"]
      }
    },
    {
      id: "2",
      userId: "1",
      parentId: "1",
      text: "Thanks @Alice Johnson! I think we should add more details to that section.",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      mentions: ["Alice Johnson"],
      reactions: {
        "👍": ["2"]
      }
    }
  ],
  mentionSearch: "",
  showUserList: false
}

const reactionEmojis = ["👍", "❤️", "🎉", "🤔", "👀", "🚀"]

export function CollaborationTools() {
  const [state, setState] = useState<CollaborationState>(initialState)
  const [newComment, setNewComment] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [state.comments])

  const handleAddComment = () => {
    if (newComment.trim() === "") return

    const mentions = (newComment.match(/@(\w+\s?\w+)/g) || [])
      .map(mention => mention.slice(1))
    
    const newCommentObj: Comment = {
      id: Date.now().toString(),
      userId: state.currentUser.id,
      text: newComment,
      timestamp: new Date().toISOString(),
      mentions,
      reactions: {},
      parentId: state.replyingTo
    }

    setState(prev => ({
      ...prev,
      comments: [...prev.comments, newCommentObj],
      replyingTo: undefined
    }))
    setNewComment("")

    // Notify mentioned users
    mentions.forEach(mention => {
      const mentionedUser = state.users.find(u => u.name === mention)
      if (mentionedUser) {
        toast({
          title: "User Mentioned",
          description: `${mention} has been notified of your mention`
        })
      }
    })
  }

  const handleEditComment = (commentId: string, newText: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment =>
        comment.id === commentId
          ? { ...comment, text: newText, edited: true }
          : comment
      ),
      editingComment: undefined
    }))
  }

  const handleDeleteComment = (commentId: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.filter(c => c.id !== commentId)
    }))
    toast({
      title: "Comment Deleted",
      description: "The comment has been removed"
    })
  }

  const handleReaction = (commentId: string, emoji: string) => {
    setState(prev => ({
      ...prev,
      comments: prev.comments.map(comment => {
        if (comment.id === commentId) {
          const reactions = { ...comment.reactions }
          const userList = reactions[emoji] || []
          const userIndex = userList.indexOf(state.currentUser.id)

          if (userIndex === -1) {
            reactions[emoji] = [...userList, state.currentUser.id]
          } else {
            reactions[emoji] = userList.filter(id => id !== state.currentUser.id)
            if (reactions[emoji].length === 0) {
              delete reactions[emoji]
            }
          }

          return { ...comment, reactions }
        }
        return comment
      })
    }))
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      // Simulate file upload
      const attachments = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type
      }))

      toast({
        title: "Files Attached",
        description: `${files.length} file(s) have been attached to your comment`
      })
    }
  }

  const renderComment = (comment: Comment) => {
    const user = state.users.find(u => u.id === comment.userId)
    if (!user) return null

    return (
      <div
        key={comment.id}
        className={`mb-6 group ${comment.parentId ? "ml-12" : ""}`}
      >
        <div className="flex items-start space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.name}`} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-semibold">{user.name}</span>
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
                {user.isOnline && (
                  <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                    Online
                  </Badge>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {comment.userId === state.currentUser.id && (
                    <>
                      <DropdownMenuItem
                        onClick={() => setState(prev => ({
                          ...prev,
                          editingComment: comment.id
                        }))}
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem
                    onClick={() => setState(prev => ({
                      ...prev,
                      replyingTo: comment.id
                    }))}
                  >
                    <Reply className="mr-2 h-4 w-4" />
                    Reply
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LinkIcon className="mr-2 h-4 w-4" />
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600">
                    <Flag className="mr-2 h-4 w-4" />
                    Report
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {state.editingComment === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  defaultValue={comment.text}
                  className="min-h-[100px] w-full p-2 border rounded-md"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleEditComment(comment.id, e.currentTarget.value)
                    }
                  }}
                />
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id, comment.text)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setState(prev => ({
                      ...prev,
                      editingComment: undefined
                    }))}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                
                {/* Reactions */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {Object.entries(comment.reactions).map(([emoji, users]) => (
                    <TooltipProvider key={emoji}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                            onClick={() => handleReaction(comment.id, emoji)}
                          >
                            {emoji} {users.length}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {users.map(userId => 
                            state.users.find(u => u.id === userId)?.name
                          ).join(", ")}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8">
                        <AtSign className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      {reactionEmojis.map(emoji => (
                        <DropdownMenuItem
                          key={emoji}
                          onClick={() => handleReaction(comment.id, emoji)}
                        >
                          {emoji}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <Clock className="h-3 w-3" />
                  <time dateTime={comment.timestamp}>
                    {new Date(comment.timestamp).toLocaleString()}
                  </time>
                  {comment.edited && <span>(edited)</span>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg">
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Document Collaboration</CardTitle>
            <CardDescription className="text-purple-100">
              Real-time collaboration and discussions
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-white text-purple-600 hover:bg-purple-100">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite
                </Button>
              </DialogTrigger>
              <DialogContent>
<DialogHeader>
                  <DialogTitle>Invite Collaborators</DialogTitle>
                  <DialogDescription>
                    Add team members to collaborate on this document
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Email addresses (comma separated)"
                      type="text"
                    />
                    <select
                      className="w-full p-2 border rounded-md"
                      defaultValue="viewer"
                    >
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={() => {
                    toast({
                      title: "Invitations Sent",
                      description: "Team members will receive an email invitation"
                    })
                  }}>
                    Send Invites
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="bg-white text-purple-600 hover:bg-purple-100">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem>
                  <Users className="h-4 w-4 mr-2" />
                  Manage Access
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Clock className="h-4 w-4 mr-2" />
                  View History
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <EyeOff className="h-4 w-4 mr-2" />
                  Mute Notifications
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <UserX className="h-4 w-4 mr-2" />
                  Leave Document
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Active Users Bar */}
        <div className="mb-6 flex items-center space-x-2 overflow-x-auto pb-2">
          {state.users.filter(u => u.isOnline).map(user => (
            <TooltipProvider key={user.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center space-x-1 bg-purple-100 dark:bg-purple-900 p-1 rounded-full">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.name}`} />
                      <AvatarFallback>{user.name[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-medium pr-2 text-purple-800 dark:text-purple-200">{user.name}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p>{user.role}</p>
                    <p>{user.isOnline ? "Online" : `Last seen ${user.lastActive}`}</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
        </div>

        {/* Comments Section */}
        <ScrollArea 
          className="h-[500px] pr-4 border rounded-lg bg-gray-50 dark:bg-gray-900" 
          ref={scrollRef}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className={`space-y-4 p-4 ${isDragging ? 'border-2 border-dashed border-purple-500 rounded-lg' : ''}`}>
            {state.comments.map(renderComment)}
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="bg-gray-50 dark:bg-gray-900 border-t p-4">
        <div className="w-full space-y-4">
          {/* Reply indicator */}
          {state.replyingTo && (
            <div className="flex items-center justify-between bg-blue-100 dark:bg-blue-900 p-2 rounded-md">
              <span className="text-sm text-blue-800 dark:text-blue-200">
                Replying to {state.users.find(u => 
                  u.id === state.comments.find(c => c.id === state.replyingTo)?.userId
                )?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setState(prev => ({ ...prev, replyingTo: undefined }))}
                className="text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Comment input */}
          <div className="flex items-start space-x-2">
            <div className="flex-1 space-y-2">
              <Textarea
                placeholder={state.replyingTo ? "Write a reply..." : "Add a comment... (@ to mention, drag & drop files)"}
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value)
                  // Handle @ mentions
                  const lastWord = e.target.value.split(" ").pop() || ""
                  if (lastWord.startsWith("@")) {
                    setState(prev => ({
                      ...prev,
                      mentionSearch: lastWord.slice(1),
                      showUserList: true
                    }))
                  } else {
                    setState(prev => ({ ...prev, showUserList: false }))
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleAddComment()
                  }
                }}
                className="min-h-[100px] w-full p-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              
              {/* Mention suggestions */}
              {state.showUserList && (
                <Card className="absolute bottom-full mb-2 w-64 max-h-48 overflow-y-auto">
                  <CardContent className="p-2">
                    {state.users
                      .filter(user => 
                        user.name.toLowerCase().includes(state.mentionSearch.toLowerCase())
                      )
                      .map(user => (
                        <button
                          key={user.id}
                          className="flex items-center space-x-2 p-2 w-full hover:bg-purple-100 dark:hover:bg-purple-900 rounded-md transition-colors"
                          onClick={() => {
                            const words = newComment.split(" ")
                            words[words.length - 1] = `@${user.name}`
                            setNewComment(words.join(" ") + " ")
                            setState(prev => ({ ...prev, showUserList: false }))
                          }}
                        >
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={user.avatar || `https://avatar.vercel.sh/${user.name}`} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{user.name}</span>
                        </button>
                      ))}
                  </CardContent>
                </Card>
              )}

              {/* Attachment preview */}
              {/* Add file attachment preview here */}
            </div>

            <div className="space-y-2">
              <Button onClick={handleAddComment} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Send className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="border-purple-600 text-purple-600 hover:bg-purple-100">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}

