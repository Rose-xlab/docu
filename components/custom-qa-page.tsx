// components/custom-qa-page.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd"
import { toast } from "@/components/ui/use-toast"
import {
  GripVertical,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  MessageCircle,
} from "lucide-react"

interface QA {
  id: string
  question: string
  answer: string
  order: number
}

interface Document {
  id: string
  name: string
  qa: {
    enabled: boolean
    items: QA[]
  }
}

interface CustomQAPageProps {
  document: Document
  onUpdate: (document: Document) => void
}

export function CustomQAPage({ document, onUpdate }: CustomQAPageProps) {
  const [qaItems, setQaItems] = useState<QA[]>(document.qa.items)
  const [isLoading, setIsLoading] = useState(false)
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const items = Array.from(qaItems)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    // Update order numbers
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }))

    setQaItems(updatedItems)
  }

  const handleAddQA = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both question and answer",
        variant: "destructive",
      })
      return
    }

    const newItem: QA = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      order: qaItems.length
    }

    setQaItems([...qaItems, newItem])
    setNewQuestion("")
    setNewAnswer("")

    toast({
      title: "Q&A Added",
      description: "New question and answer have been added"
    })
  }

  const handleRemoveQA = (id: string) => {
    setQaItems(qaItems.filter(item => item.id !== id))
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await onUpdate({
        ...document,
        qa: {
          enabled: true,
          items: qaItems
        }
      })

      toast({
        title: "Q&A Updated",
        description: "Changes have been saved successfully"
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Q&A</CardTitle>
        <CardDescription>
          Add frequently asked questions and answers for your document
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Add New Q&A */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Add New Q&A</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="Enter question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Enter answer"
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            <Button onClick={handleAddQA} className="w-full">
              <Plus className="mr-2 h-4 w-4" />
              Add Q&A
            </Button>
          </div>
        </div>

        {/* Q&A List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Current Q&A Items</h3>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="qa-list">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  {qaItems.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="border rounded-lg p-4 bg-card"
                        >
                          <div className="flex items-start space-x-4">
                            <div
                              {...provided.dragHandleProps}
                              className="mt-1.5 cursor-move"
                            >
                              <GripVertical className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex-1 space-y-2">
                              <div>
                                <h4 className="font-medium">Q: {item.question}</h4>
                                <p className="text-sm text-muted-foreground mt-1">
                                  A: {item.answer}
                                </p>
                              </div>
                              <div className="flex justify-end">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleRemoveQA(item.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          
          {qaItems.length === 0 && (
            <div className="text-center p-8 border rounded-lg bg-muted">
              <MessageCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                No Q&A items yet. Add some questions and answers above.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setQaItems(document.qa.items)}
          disabled={isLoading}
        >
          Reset Changes
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}