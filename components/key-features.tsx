import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Shield, BarChart2, Zap } from 'lucide-react'

export function KeyFeatures() {
  return (
    <section className="container py-24">
      <h2 className="text-3xl font-bold text-center mb-12">Why Choose Our Platform?</h2>
      
      <div className="grid gap-12 lg:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <Shield className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Unparalleled Security</h3>
          <p className="text-muted-foreground">
            End-to-end encryption, access controls, and dynamic watermarking keep your documents safe.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <BarChart2 className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Deep Analytics</h3>
          <p className="text-muted-foreground">
            Gain insights with detailed engagement metrics, geographical data, and real-time notifications.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <Zap className="h-12 w-12 text-primary mb-4" />
          <h3 className="text-xl font-semibold mb-2">Seamless Collaboration</h3>
          <p className="text-muted-foreground">
            Share, update, and collaborate on documents effortlessly with intuitive tools and integrations.
          </p>
        </div>
      </div>

      <div className="mt-24">
        <h3 className="text-2xl font-bold text-center mb-8">See Our Platform in Action</h3>
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image 
            src="/placeholder.svg" 
            alt="Platform Demo" 
            layout="fill" 
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="lg">Watch Demo</Button>
          </div>
        </div>
      </div>
    </section>
  )
}

