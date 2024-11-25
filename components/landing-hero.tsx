import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, Star } from 'lucide-react'

export function LandingHero() {
  return (
    <div className="container py-32 text-center">
      <div className="mx-auto flex max-w-[58rem] flex-col items-center gap-4">
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          Secure Document Sharing{" "}
          <span className="text-primary">Reimagined</span>
        </h1>
        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
          Share, track, and collaborate on documents with unprecedented control and insights. 
          Your all-in-one platform for secure file management and analytics.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="#features">Explore Features</Link>
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <Badge variant="secondary" className="gap-1">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span>#1 in Document Security</span>
          </Badge>
          <div className="flex items-center gap-0.5">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <Star className="h-4 w-4 fill-primary text-primary" />
            <Star className="h-4 w-4 fill-primary text-primary" />
            <Star className="h-4 w-4 fill-primary text-primary" />
            <Star className="h-4 w-4 fill-primary text-primary" />
          </div>
        </div>
      </div>
    </div>
  )
}

