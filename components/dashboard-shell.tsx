import { DashboardNav } from "@/components/dashboard-nav"
import { UserNav } from "@/components/user-nav"

export function DashboardShell({ children }: { children: React.ReactNode }) {
 return (
   <div className="flex flex-col min-h-screen lg:flex-row">
     <DashboardNav />
     <div className="flex-1">
       <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container flex h-14 items-center">
           <div className="mr-4 hidden lg:flex">
             <UserNav />
           </div>
           <div className="flex flex-1 items-center justify-between space-x-2 lg:justify-end">
             <div className="w-full flex-1 lg:w-auto lg:flex-none">
               {/* Add a search component here if needed */}
             </div>
             <UserNav />
           </div>
         </div>
       </header>
       <main className="container py-6 lg:py-8 space-y-6">
         {children}
       </main>
     </div>
   </div>
 )
}

