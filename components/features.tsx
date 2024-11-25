import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Users, BarChart2, RefreshCw, Link2, Ban, FileUp, FolderKanban, Search, Cloud, Bell, MapPin, Eye, UserCheck, Download, Palette, MessageSquare, Zap } from 'lucide-react'

const features = [
  {
    title: "Secure Data Rooms",
    description: "Create and manage secure spaces for document sharing with granular access controls.",
    icon: FolderKanban,
  },
  {
    title: "Advanced Analytics",
    description: "Gain deep insights into document engagement with detailed viewer analytics.",
    icon: BarChart2,
  },
  {
    title: "Customizable Sharing",
    description: "Share documents via secure links or email with customizable permissions and expiry dates.",
    icon: Link2,
  },
  {
    title: "Version Control",
    description: "Keep track of document changes with built-in version control and history.",
    icon: RefreshCw,
  },
  {
    title: "Real-time Notifications",
    description: "Get instant alerts when your documents are viewed or shared.",
    icon: Bell,
  },
  {
    title: "Watermarking",
    description: "Add dynamic watermarks to your documents for enhanced security.",
    icon: Shield,
  },
  {
    title: "Full-Text Search",
    description: "Quickly find documents with powerful full-text search capabilities.",
    icon: Search,
  },
  {
    title: "Custom Branding",
    description: "Personalize the viewer interface with your own branding elements.",
    icon: Palette,
  },
]

export function Features() {
  return (
    <section className="container py-16" id="features">
      <h2 className="text-3xl font-bold text-center mb-12">Powerful Features for Secure Document Sharing</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}

