"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, Heart, Star, Smile, Frown, Meh } from 'lucide-react'

interface Reaction {
 id: string
 icon: React.ElementType
 count: number
 active: boolean
}

export function DocumentReactions() {
 const [reactions, setReactions] = useState<Reaction[]>([
   { id: 'like', icon: ThumbsUp, count: 15, active: false },
   { id: 'dislike', icon: ThumbsDown, count: 2, active: false },
   { id: 'love', icon: Heart, count: 8, active: false },
   { id: 'star', icon: Star, count: 5, active: false },
   { id: 'smile', icon: Smile, count: 10, active: false },
   { id: 'frown', icon: Frown, count: 1, active: false },
   { id: 'meh', icon: Meh, count: 3, active: false },
 ])

 const handleReaction = (id: string) => {
   setReactions(reactions.map(reaction => 
     reaction.id === id
       ? { ...reaction, count: reaction.active ? reaction.count - 1 : reaction.count + 1, active: !reaction.active }
       : reaction
   ))
 }

 return (
   <Card className="w-[350px]">
     <CardHeader>
       <CardTitle>Document Reactions</CardTitle>
       <CardDescription>Share your thoughts on this document</CardDescription>
     </CardHeader>
     <CardContent>
       <div className="flex flex-wrap gap-2">
         {reactions.map((reaction) => (
           <Button
             key={reaction.id}
             variant={reaction.active ? "secondary" : "outline"}
             size="sm"
             onClick={() => handleReaction(reaction.id)}
             className="flex items-center space-x-1"
           >
             <reaction.icon className="h-4 w-4" />
             <span>{reaction.count}</span>
           </Button>
         ))}
       </div>
     </CardContent>
     <CardFooter>
       <p className="text-sm text-muted-foreground">React to share your opinion with others</p>
     </CardFooter>
   </Card>
 )
}

