
import { Navigation } from "@/components/Navigation";
import { Lock, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <header className="h-20 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center space-x-2">
           <div className="bg-primary p-2 rounded-lg text-white">
              <Lock className="h-5 w-5" />
           </div>
           <h1 className="text-xl font-bold tracking-tight text-foreground">
             Parent <span className="text-primary">Portal</span>
           </h1>
        </div>
        <div className="flex items-center space-x-4">
           <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white" />
           </Button>
           <div className="h-10 w-10 rounded-full bg-muted border flex items-center justify-center font-bold text-sm">
             JD
           </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row">
        <aside className="hidden md:block w-64 border-r bg-white p-4">
          <div className="mb-8 px-4 py-2">
            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Main Menu</h2>
          </div>
          <Navigation />
        </aside>

        <main className="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
      
      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  );
}
