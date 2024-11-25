import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from 'lucide-react'

export function CTASection() {
  return (
    <section className="border-t bg-muted/40">
      <div className="container py-20">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="font-heading text-3xl sm:text-4xl">
            Ready to revolutionize your document sharing?
          </h2>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Join thousands of companies using our platform to securely share, track, and collaborate on their most important documents.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/signup">Get Started <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Request a Demo</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

