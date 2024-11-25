"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, FolderKanban, PieChart, Settings, Share, Upload, History, Shield, Users, Search } from 'lucide-react'

const navItems = [
  { href: "/dashboard", icon: FileText, label: "Overview" },
  { href: "/dashboard/documents", icon: FolderKanban, label: "Documents" },
  { href: "/dashboard/analytics", icon: PieChart, label: "Analytics" },
  
  { href: "/dashboard/security", icon: Shield, label: "Security" },
  { href: "/dashboard/collaboration", icon: Users, label: "Collaboration" },
  { href: "/dashboard/search", icon: Search, label: "Advanced Search" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 w-64 h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700">
      <ScrollArea className="h-full">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-colors">
            DocSecure
          </Link>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant={isActive ? "secondary" : "ghost"}
                  className={`w-full justify-start gap-3 text-left font-medium ${
                    isActive
                      ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                  } transition-all duration-200 ease-in-out`}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className={`h-5 w-5 ${isActive ? "text-purple-600 dark:text-purple-400" : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"}`} />
                    <span>{item.label}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </nav>
  )
}

