
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShieldCheck, Gamepad2, BookOpen, BarChart3, Settings, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const isKidPath = pathname?.startsWith("/kid");
  const isParentPath = pathname?.startsWith("/parent");

  const kidLinks = [
    { href: "/kid/dashboard", label: "My Hub", icon: Gamepad2 },
    { href: "/kid/eye-health", label: "Eye Care", icon: ShieldCheck },
    { href: "/kid/story-chain", label: "Stories", icon: BookOpen },
    { href: "/kid/achievements", label: "Rewards", icon: Trophy },
  ];

  const parentLinks = [
    { href: "/parent/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/parent/settings", label: "Control Center", icon: Settings },
  ];

  const links = isKidPath ? kidLinks : isParentPath ? parentLinks : [];

  if (links.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t h-20 px-4 md:h-auto md:relative md:bg-transparent md:border-none md:p-6 z-50">
      <div className="flex justify-around items-center h-full max-w-lg mx-auto md:flex-col md:items-start md:space-y-4">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 rounded-xl transition-all w-full md:flex-row md:justify-start md:space-x-3 md:px-4",
                active 
                  ? "text-primary bg-primary/10 font-bold" 
                  : "text-muted-foreground hover:bg-muted"
              )}
            >
              <Icon className={cn("h-6 w-6 md:h-5 md:w-5", active ? "scale-110" : "")} />
              <span className="text-[10px] mt-1 md:text-sm md:mt-0">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
