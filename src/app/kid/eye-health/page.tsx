
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Shield, Timer, Award } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";

export default function EyeHealthPage() {
  const [activeMission, setActiveMission] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const missions = [
    { 
      id: "blink", 
      title: "Blink Buddy", 
      description: "Blink 10 times quickly to refresh your eyes!", 
      duration: 20, 
      color: "bg-primary/10",
      icon: Eye
    },
    { 
      id: "horizon", 
      title: "Horizon Hunter", 
      description: "Look at the furthest thing you can see for 20 seconds.", 
      duration: 20, 
      color: "bg-accent/10",
      icon: Shield
    }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeMission && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && activeMission) {
      setIsDone(true);
      setActiveMission(null);
      
      // Notify the system that a break was completed
      window.dispatchEvent(new CustomEvent('mindful-play:break-completed'));
    }
    return () => clearInterval(interval);
  }, [activeMission, timer]);

  const startMission = (missionId: string, duration: number) => {
    setActiveMission(missionId);
    setTimer(duration);
    setIsDone(false);
  };

  const bgImage = PlaceHolderImages.find(img => img.id === 'eye-health-bg');

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-foreground italic underline decoration-primary decoration-4">Eye Gym</h1>
        <p className="text-muted-foreground font-semibold">Your eyes work hard. Give them a super rest!</p>
      </div>

      {activeMission ? (
        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden animate-in zoom-in duration-300">
          <CardContent className="p-12 text-center space-y-8">
            <div className="h-64 rounded-[2rem] bg-muted relative overflow-hidden flex items-center justify-center">
              <img src={bgImage?.imageUrl} alt="Mission BG" className="absolute inset-0 w-full h-full object-cover opacity-60" />
              <div className="relative z-10 text-7xl font-black text-primary drop-shadow-lg">{timer}s</div>
            </div>
            <h2 className="text-3xl font-bold">{missions.find(m => m.id === activeMission)?.title}</h2>
            <p className="text-lg font-medium">{missions.find(m => m.id === activeMission)?.description}</p>
            <Progress value={(timer / 20) * 100} className="h-4" />
            <Button variant="ghost" onClick={() => setActiveMission(null)} className="rounded-full">Stop Mission</Button>
          </CardContent>
        </Card>
      ) : isDone ? (
        <Card className="rounded-[3rem] border-none shadow-2xl bg-accent/20 p-12 text-center space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-white p-6 rounded-full inline-block mx-auto shadow-xl">
             <Award className="h-20 w-20 text-accent-foreground" />
          </div>
          <h2 className="text-4xl font-black">Mission Complete!</h2>
          <p className="text-xl font-bold text-accent-foreground">Your eyes feel refreshed! +50 Points earned.</p>
          <Button onClick={() => setIsDone(false)} size="lg" className="rounded-full h-14 px-10 text-xl font-bold bg-primary hover:bg-primary/90">Awesome!</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.id} className="rounded-[2.5rem] border-2 border-transparent hover:border-primary/20 transition-all kid-card-hover group">
                <CardHeader className="text-center space-y-4 pt-10">
                  <div className={`p-8 rounded-[2rem] ${m.color} inline-block mx-auto transition-transform group-hover:scale-110`}>
                    <Icon className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-black">{m.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-8 pb-10 space-y-6">
                  <p className="text-muted-foreground font-medium">{m.description}</p>
                  <div className="flex items-center justify-center text-sm font-bold text-primary space-x-2">
                    <Timer className="h-4 w-4" />
                    <span>{m.duration} Seconds</span>
                  </div>
                  <Button onClick={() => startMission(m.id, m.duration)} className="w-full rounded-full h-12 font-bold text-lg">Start Mission</Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bg-primary/5 p-6 rounded-3xl border border-primary/10 flex items-start gap-4">
        <div className="p-2 bg-primary rounded-xl text-white">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h4 className="font-bold text-primary">Pro Tip</h4>
          <p className="text-sm text-muted-foreground">The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. It keeps your eyes healthy!</p>
        </div>
      </div>
    </div>
  );
}
