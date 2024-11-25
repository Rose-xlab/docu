import { Metadata } from "next"
import { LandingHero } from "@/components/landing-hero"
import { LandingNavbar } from "@/components/landing-navbar"
import { Features } from "@/components/features"
import { FeatureHighlight } from "@/components/feature-highlight"
import { CTASection } from "@/components/cta-section"

export const metadata: Metadata = {
  title: "DocSecure - Secure Document Sharing & Analytics",
  description: "Share documents securely. Create data rooms with granular permissions. Your #1 alternative to DocSend.",
}

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <LandingHero />
        <Features />
        <FeatureHighlight />
        <CTASection />
      </main>
    </div>
  )
}

