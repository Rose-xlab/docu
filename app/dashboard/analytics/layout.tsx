import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Analytics - DocSecure",
  description: "View detailed analytics for your shared documents"
}

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}