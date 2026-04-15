
import Link from "next/link";
import { Gamepad2, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background overflow-hidden">
      <div className="text-center space-y-4 max-w-2xl mb-12">
        <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-4 animate-float">
          <HeartPulse className="h-12 w-12 text-primary" />
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight text-foreground md:text-7xl">
          Mindful <span className="text-primary">Play</span>
        </h1>
        <p className="text-xl text-muted-foreground font-medium">
          Play Smarter, Live Brighter. The healthy bridge between screens and the real world.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <Link href="/kid/dashboard" className="group">
          <div className="h-full bg-card border-2 border-primary/20 p-8 rounded-[2rem] kid-card-hover flex flex-col items-center text-center space-y-6">
            <div className="p-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-colors duration-500">
              <Gamepad2 className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Kids Zone</h2>
              <p className="text-muted-foreground">Track your focus, complete missions, and earn rewards!</p>
            </div>
            <Button size="lg" className="w-full rounded-full text-lg h-14 font-bold">Start Playing</Button>
          </div>
        </Link>

        <Link href="/parent/dashboard" className="group">
          <div className="h-full bg-card border-2 border-accent/20 p-8 rounded-[2rem] kid-card-hover flex flex-col items-center text-center space-y-6">
            <div className="p-6 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-accent-foreground transition-colors duration-500">
              <ShieldCheck className="h-16 w-16" />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-2">Parent Portal</h2>
              <p className="text-muted-foreground">Manage time limits, view reports, and protect your family.</p>
            </div>
            <Button variant="secondary" size="lg" className="w-full rounded-full text-lg h-14 font-bold">Secure Access</Button>
          </div>
        </Link>
      </div>

      <div className="mt-16 text-center text-sm text-muted-foreground">
        Trusted by 10,000+ mindful families worldwide.
      </div>
    </div>
  );
}
