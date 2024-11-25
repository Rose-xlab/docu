"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  FileText, FolderKanban, PieChart, Settings, Shield, 
  Users, Search, UserPlus, MessagesSquare, BarChart2, 
  LineChart, TrendingUp, Globe, Activity
} from 'lucide-react'

const navItems = [
  { href: "/dashboard", icon: FileText, label: "Overview" },
  { href: "/dashboard/documents", icon: FolderKanban, label: "Documents" },
  { 
    href: "/dashboard/analytics", 
    icon: PieChart, 
    label: "Analytics",
    subItems: [
      { href: "/dashboard/analytics/overview", icon: BarChart2, label: "Overview" },
      { href: "/dashboard/analytics/documents", icon: LineChart, label: "Documents Analytics" },
      { href: "/dashboard/analytics/engagement", icon: Activity, label: "Engagement" },
      { href: "/dashboard/analytics/global", icon: Globe, label: "Global Reach" },
      { href: "/dashboard/analytics/trends", icon: TrendingUp, label: "Trends" }
    ]
  },
  { href: "/dashboard/security", icon: Shield, label: "Security" },
  { 
    href: "/dashboard/collaboration", 
    icon: Users, 
    label: "Collaboration",
    subItems: [
      { href: "/dashboard/collaboration/team", icon: UserPlus, label: "Team Management" },
      { href: "/dashboard/collaboration/documents", icon: MessagesSquare, label: "Document Collaboration" }
    ]
  },
  { href: "/dashboard/search", icon: Search, label: "Advanced Search" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 w-64 h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 border-r border-gray-200 dark:border-gray-700">
      <ScrollArea className="h-full">
        <div className="p-6">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-2xl mb-8 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent hover:from-purple-500 hover:to-blue-500 transition-colors"
          >
            DocSecure
          </Link>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              const Icon = item.icon
              
              return (
                <div key={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={`w-full justify-start gap-3 text-left font-medium ${
                      isActive
                        ? "bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:text-purple-600 dark:hover:text-purple-400"
                    } transition-all duration-200 ease-in-out`}
                    asChild
                  >
                    <Link href={item.href}>
                      <Icon className={`h-5 w-5 ${
                        isActive 
                          ? "text-purple-600 dark:text-purple-400" 
                          : "text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400"
                      }`} />
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                  
                  {item.subItems && (isActive || item.subItems.some(sub => pathname === sub.href)) && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href
                        const SubIcon = subItem.icon
                        
                        return (
                          <Button
                            key={subItem.href}
                            variant={isSubActive ? "secondary" : "ghost"}
                            className={`w-full justify-start gap-3 text-sm ${
                              isSubActive 
                                ? "bg-white/50 dark:bg-gray-800/50 text-purple-600 dark:text-purple-400" 
                                : "hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-purple-600 dark:hover:text-purple-400"
                            }`}
                            asChild
                          >
                            <Link href={subItem.href}>
                              <SubIcon className={`h-4 w-4 ${
                                isSubActive 
                                  ? "text-purple-600 dark:text-purple-400" 
                                  : "text-gray-400"
                              }`} />
                              <span>{subItem.label}</span>
                            </Link>
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </nav>
  )
}