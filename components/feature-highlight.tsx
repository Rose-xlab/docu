import Image from 'next/image'
import { Button } from "@/components/ui/button"

export function FeatureHighlight() {
  return (
    <section className="container py-24">
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Secure Data Rooms</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Create virtual data rooms for secure document sharing and collaboration. Control access, track engagement, and manage permissions all in one place.
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Granular access controls
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time activity tracking
            </li>
            <li className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Customizable security settings
            </li>
          </ul>
          <Button size="lg">Learn More</Button>
        </div>
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image 
            src="/placeholder.svg?height=400&width=600" 
            alt="Secure Data Room Interface" 
            layout="fill" 
            objectFit="cover"
          />
        </div>
      </div>
    </section>
  )
}

