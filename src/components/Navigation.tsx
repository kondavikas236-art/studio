
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, ShieldCheck, Gamepad2, Book, BarChart3, Settings, Trophy, Lock, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navigation() {
  const pathname = usePathname();
  const isKidPath = pathname?.startsWith("/kid");
  const isParentPath = pathname?.startsWith("/parent");

  const kidLinks = [
    { href: "/kid/dashboard", label: "My Hub", icon: Gamepad2 },
    { href: "/kid/eye-health", label: "Eye Gym", icon: ShieldCheck },
    { href: "/kid/diary", label: "Diary", icon: Book },
    { href: "/parent/settings", label: "Parents", icon: Lock },
    { href: "/kid/achievements", label: "Rewards", icon: Trophy },
  ];

  const parentLinks = [
    { href: "/parent/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/parent/billing", label: "Billing", icon: CreditCard },
    { href: "/parent/settings", label: "Settings", icon: Settings },
  ];

  const links = isKidPath ? kidLinks : isParentPath ? parentLinks : [];

  if (links.length === 0) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t h-[72px] px-2 flex justify-around items-center z-50 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] md:h-auto md:relative md:bg-transparent md:border-none md:p-6 md:flex-col md:items-start md:space-y-4">
      {links.map((link) => {
        const Icon = link.icon;
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "flex flex-col items-center justify-center min-w-[64px] transition-all rounded-2xl py-2 md:flex-row md:justify-start md:space-x-4 md:px-6 md:w-full md:py-3",
              active 
                ? "text-primary md:bg-primary/10" 
                : "text-muted-foreground hover:bg-muted/50"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-full transition-all duration-300",
              active ? "bg-primary/10 md:bg-transparent scale-110" : ""
            )}>
              <Icon className={cn("h-6 w-6 transition-transform", active ? "stroke-[2.5px]" : "stroke-2")} />
            </div>
            <span className={cn(
              "text-[10px] mt-1 font-bold tracking-tight md:text-sm md:mt-0 transition-all",
              active ? "opacity-100 scale-105" : "opacity-80"
            )}>
              {link.label}
            </span>
            {active && (
              <div className="absolute bottom-1 w-1 h-1 bg-primary rounded-full md:hidden" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
