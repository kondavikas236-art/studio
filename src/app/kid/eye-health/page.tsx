
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Eye, Shield, Timer, Award, Compass, ChevronRight, CheckCircle2 } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { cn } from "@/lib/utils";

export default function EyeHealthPage() {
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isDone, setIsDone] = useState(false);
  
  const missions = [
    { 
      id: "blink", 
      title: "Blink Buddy", 
      description: "Blink 10 times quickly to refresh your eyes!", 
      duration: 15, 
      color: "bg-primary/10",
      icon: Eye,
      steps: ["Ready...", "Blink fast like a butterfly!", "Almost there!", "Eyes refreshed!"]
    },
    { 
      id: "distance", 
      title: "Distance Detective", 
      description: "Find 3 different things far away in your room.", 
      duration: 30, 
      color: "bg-accent/10",
      icon: Compass,
      steps: [
        "Find something BLUE far away...",
        "Now find something ROUND far away...",
        "Finally, find something TALL far away...",
        "Great job, Detective!"
      ]
    }
  ];

  const activeMission = missions.find(m => m.id === activeMissionId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeMissionId && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && activeMissionId) {
      if (activeMission && currentStep < activeMission.steps.length - 1) {
        // Move to next step if it's a multi-step mission
        setCurrentStep(prev => prev + 1);
        setTimer(Math.floor(activeMission.duration / (activeMission.steps.length - 1)));
      } else {
        // Mission complete
        setIsDone(true);
        setActiveMissionId(null);
        window.dispatchEvent(new CustomEvent('mindful-play:break-completed'));
      }
    }
    return () => clearInterval(interval);
  }, [activeMissionId, timer, currentStep, activeMission]);

  const startMission = (missionId: string) => {
    const mission = missions.find(m => m.id === missionId);
    if (!mission) return;
    
    setActiveMissionId(missionId);
    setCurrentStep(0);
    // Initial timer for the first step
    setTimer(Math.floor(mission.duration / (mission.steps.length - 1)));
    setIsDone(false);
  };

  const bgImage = PlaceHolderImages.find(img => img.id === 'eye-health-bg');

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-12">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-black text-foreground italic underline decoration-primary decoration-4">Eye Gym</h1>
        <p className="text-muted-foreground font-semibold">Give your eyes a super-powered workout!</p>
      </div>

      {activeMissionId && activeMission ? (
        <Card className="rounded-[3rem] border-none shadow-2xl overflow-hidden animate-in zoom-in duration-300">
          <CardContent className="p-0">
            <div className="h-48 bg-muted relative overflow-hidden flex items-center justify-center">
              <img src={bgImage?.imageUrl} alt="Mission BG" className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 flex flex-col items-center">
                 <div className="text-6xl font-black text-primary drop-shadow-md">{timer}s</div>
                 <div className="text-sm font-bold text-primary/70 uppercase tracking-widest mt-2">Step {currentStep + 1} of {activeMission.steps.length - 1}</div>
              </div>
            </div>
            
            <div className="p-10 text-center space-y-8">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-primary">{activeMission.title}</h2>
                <div className="bg-primary/5 p-6 rounded-3xl border-2 border-primary/10 animate-pulse">
                  <p className="text-2xl font-bold italic">"{activeMission.steps[currentStep]}"</p>
                </div>
              </div>

              <div className="space-y-4">
                <Progress 
                  value={((currentStep * (activeMission.duration / (activeMission.steps.length - 1)) + (Math.floor(activeMission.duration / (activeMission.steps.length - 1)) - timer)) / activeMission.duration) * 100} 
                  className="h-4" 
                />
                <div className="flex justify-center gap-2">
                   {activeMission.steps.slice(0, -1).map((_, idx) => (
                     <div 
                      key={idx} 
                      className={cn(
                        "h-3 w-3 rounded-full transition-colors",
                        idx <= currentStep ? "bg-primary" : "bg-muted"
                      )} 
                     />
                   ))}
                </div>
              </div>

              <Button variant="ghost" onClick={() => setActiveMissionId(null)} className="rounded-full font-bold text-muted-foreground hover:text-destructive">
                Cancel Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isDone ? (
        <Card className="rounded-[3rem] border-none shadow-2xl bg-accent/20 p-12 text-center space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-white p-8 rounded-[2.5rem] inline-block mx-auto shadow-xl relative">
             <Award className="h-24 w-24 text-accent-foreground" />
             <div className="absolute -top-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg">
                <CheckCircle2 className="h-6 w-6" />
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-4xl font-black">Mission Complete!</h2>
            <p className="text-xl font-bold text-accent-foreground">Your eyes feel supercharged! +50 Points earned.</p>
          </div>
          <Button onClick={() => setIsDone(false)} size="lg" className="rounded-full h-16 px-12 text-2xl font-black bg-primary hover:bg-primary/90 shadow-lg hover:scale-105 transition-transform">
            Awesome!
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {missions.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.id} className="rounded-[2.5rem] border-4 border-transparent hover:border-primary/20 transition-all kid-card-hover group bg-white">
                <CardHeader className="text-center space-y-4 pt-10">
                  <div className={cn(
                    "p-8 rounded-[2rem] inline-block mx-auto transition-transform group-hover:scale-110 shadow-inner",
                    m.color
                  )}>
                    <Icon className="h-16 w-16 text-primary" />
                  </div>
                  <CardTitle className="text-3xl font-black italic">{m.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-8 pb-10 space-y-6">
                  <p className="text-muted-foreground font-semibold leading-relaxed">{m.description}</p>
                  <div className="flex items-center justify-center text-sm font-black text-primary/60 space-x-2 bg-muted/30 py-2 rounded-full">
                    <Timer className="h-4 w-4" />
                    <span>{m.duration} Seconds</span>
                  </div>
                  <Button onClick={() => startMission(m.id)} className="w-full rounded-full h-14 font-black text-xl shadow-md group-hover:bg-primary group-hover:text-white transition-colors">
                    Start Mission <ChevronRight className="ml-2 h-6 w-6" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bg-primary/5 p-8 rounded-[2.5rem] border-2 border-primary/10 flex items-start gap-6 shadow-inner">
        <div className="p-4 bg-primary rounded-2xl text-white shadow-md">
          <Shield className="h-8 w-8" />
        </div>
        <div>
          <h4 className="text-xl font-black text-primary italic">Pro Eye Secret</h4>
          <p className="text-muted-foreground font-medium">The 20-20-20 rule: Every 20 minutes, look at something 20 feet away for 20 seconds. This is how top Explorers protect their vision!</p>
        </div>
      </div>
    </div>
  );
}
