
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Shield, Timer, Award, Compass, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { PlaceHolderImages } from "@/app/lib/placeholder-images";
import { cn } from "@/lib/utils";
import { useFirebase, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import { textToSpeech } from "@/ai/flows/tts-flow";

function VisualEyeGym({ stepText }: { stepText: string }) {
  const isBlinkFast = stepText.toLowerCase().includes("blink fast");
  const isBlinkSlow = stepText.toLowerCase().includes("blink slowly");
  const isShutTight = stepText.toLowerCase().includes("shut tight");
  const isWide = stepText.toLowerCase().includes("wide");
  const isLeftRight = stepText.toLowerCase().includes("left") || stepText.toLowerCase().includes("right");
  const isUpDown = stepText.toLowerCase().includes("up") || stepText.toLowerCase().includes("down");
  const isRoll = stepText.toLowerCase().includes("roll");

  return (
    <div className="flex gap-4 sm:gap-8 justify-center items-center py-4 sm:py-8">
      {[0, 1].map((i) => (
        <div key={i} className="relative w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-full border-4 sm:border-8 border-primary shadow-inner flex items-center justify-center overflow-hidden">
          {/* Lids */}
          <div className={cn(
            "absolute inset-0 bg-primary/30 z-20 origin-top transition-transform duration-500",
            isShutTight ? "scale-y-100" : "scale-y-0",
            isBlinkFast && "animate-blink-fast",
            isBlinkSlow && "animate-blink-slow"
          )} />
          
          {/* Eye Ball Content */}
          <div className={cn(
            "relative w-12 h-12 sm:w-16 sm:h-16 bg-foreground rounded-full transition-all duration-500",
            isWide && "scale-150",
            isLeftRight && "animate-eye-left-right left-1/2 top-1/2",
            isUpDown && "animate-eye-up-down left-1/2 top-1/2",
            isRoll && "animate-eye-roll"
          )}>
             {/* Pupil Highlight */}
             <div className="w-3 h-3 sm:w-5 sm:h-5 bg-white rounded-full absolute top-2 left-2 opacity-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function EyeHealthPage() {
  const { user } = useUser();
  const { firestore: db } = useFirebase();
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [timer, setTimer] = useState(0);
  const [isDone, setIsDone] = useState(false);

  // Fetch children to get the child's name dynamically
  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: childrenData, isLoading: isChildrenLoading } = useCollection(childrenQuery);

  const explorerName = childrenData?.[0]?.name || "Explorer";
  
  const missions = [
    { 
      id: "blink", 
      title: "Blink Buddy", 
      description: "A full 1-minute routine to refresh and stretch your eyes!", 
      duration: 60,
      color: "bg-primary/10",
      icon: Eye,
      steps: [
        "Ready...", 
        "Blink fast like a butterfly!", 
        "Now, blink slowly...", 
        "Squeeze your eyes shut tight!", 
        "Open them wide!", 
        "Look left... and now right!",
        "Look up... and now down!",
        "Roll your eyes in a big circle!",
        "Almost there!", 
        "Eyes refreshed!"
      ]
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

  const playInstruction = async (text: string) => {
    try {
      const result = await textToSpeech(text);
      if (result.media) {
        const audio = new Audio(result.media);
        audio.play().catch(e => console.warn("Audio playback interrupted:", e));
      }
    } catch (err) {
      console.error("TTS instruction failed:", err);
    }
  };

  useEffect(() => {
    if (activeMission && activeMissionId && !isDone) {
      playInstruction(activeMission.steps[currentStep]);
    }
  }, [currentStep, activeMissionId, isDone]);

  useEffect(() => {
    if (isDone) {
      playInstruction(`Mission Complete, ${explorerName}! Your eyes feel supercharged!`);
    }
  }, [isDone, explorerName]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeMissionId && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && activeMissionId) {
      if (activeMission && currentStep < activeMission.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
        setTimer(Math.floor(activeMission.duration / (activeMission.steps.length - 1)));
      } else {
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
    
    setIsDone(false);
    setActiveMissionId(missionId);
    setCurrentStep(0);
    setTimer(Math.floor(mission.duration / (mission.steps.length - 1)));
  };

  const bgImage = PlaceHolderImages.find(img => img.id === 'eye-health-bg');

  if (isChildrenLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-lg mx-auto pb-10">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-primary italic underline decoration-primary decoration-4 tracking-tight">Eye Gym</h1>
        <p className="text-muted-foreground font-semibold text-sm">Super-powered workout for your eyes, {explorerName}!</p>
      </div>

      {activeMissionId && activeMission ? (
        <Card className="rounded-[2rem] border-none shadow-2xl overflow-hidden animate-in zoom-in duration-300">
          <CardContent className="p-0">
            <div className="min-h-[280px] sm:min-h-[400px] bg-muted relative overflow-hidden flex flex-col items-center justify-center bg-gradient-to-b from-muted to-white">
              <img src={bgImage?.imageUrl} alt="Mission BG" className="absolute inset-0 w-full h-full object-cover opacity-10" />
              <div className="relative z-10 w-full px-4 sm:px-8">
                 <VisualEyeGym stepText={activeMission.steps[currentStep]} />
                 <div className="flex flex-col items-center mt-4 sm:mt-8">
                    <div className="text-4xl sm:text-6xl font-black text-primary drop-shadow-md bg-white/80 px-6 sm:px-8 py-1 sm:py-2 rounded-full border-2 sm:border-4 border-primary/20">{timer}s</div>
                    <div className="mt-2 text-[10px] sm:text-sm font-black text-primary/70 uppercase tracking-widest bg-primary/5 px-3 py-1 rounded-full">Step {currentStep + 1} of {activeMission.steps.length - 1}</div>
                 </div>
              </div>
            </div>
            
            <div className="p-6 sm:p-10 text-center space-y-6 sm:space-y-8 bg-white">
              <div className="space-y-3 sm:space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-primary">{activeMission.title}</h2>
                <div className="bg-primary/5 p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-primary/10 shadow-inner">
                  <p className="text-xl sm:text-3xl font-black italic text-primary leading-tight">"{activeMission.steps[currentStep]}"</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-center gap-2">
                   {activeMission.steps.slice(0, -1).map((_, idx) => (
                     <div 
                      key={idx} 
                      className={cn(
                        "h-2 w-2 sm:h-4 sm:w-4 rounded-full transition-all duration-500",
                        idx <= currentStep ? "bg-primary scale-125 shadow-md" : "bg-muted"
                      )} 
                     />
                   ))}
                </div>
              </div>

              <Button variant="ghost" onClick={() => setActiveMissionId(null)} className="rounded-full font-black text-muted-foreground hover:text-destructive hover:bg-destructive/5 text-base sm:text-lg">
                Cancel Mission
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : isDone ? (
        <Card className="rounded-[2rem] border-none shadow-2xl bg-accent/20 p-8 sm:p-12 text-center space-y-4 sm:space-y-6 animate-in slide-in-from-bottom-10">
          <div className="bg-white p-6 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] inline-block mx-auto shadow-xl relative">
             <Award className="h-16 w-16 sm:h-24 sm:w-24 text-accent-foreground" />
             <div className="absolute -top-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg">
                <CheckCircle2 className="h-4 w-4 sm:h-6 sm:w-6" />
             </div>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black">Mission Complete, {explorerName}!</h2>
            <p className="text-lg sm:text-xl font-bold text-accent-foreground">Eyes supercharged! +50 Points.</p>
          </div>
          <Button onClick={() => setIsDone(false)} size="lg" className="rounded-full h-12 sm:h-16 px-8 sm:px-12 text-lg sm:text-2xl font-black bg-primary hover:bg-primary/90 shadow-lg hover:scale-105 transition-transform">
            Awesome!
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {missions.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.id} className="rounded-[1.5rem] border-2 border-transparent hover:border-primary/20 transition-all kid-card-hover group bg-white">
                <CardHeader className="text-center space-y-2 pt-6">
                  <div className={cn(
                    "p-6 rounded-[1.5rem] inline-block mx-auto transition-transform group-hover:scale-110 shadow-inner",
                    m.color
                  )}>
                    <Icon className="h-10 w-10 text-primary" />
                  </div>
                  <CardTitle className="text-2xl font-black italic">{m.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-6 space-y-4">
                  <p className="text-muted-foreground font-semibold leading-snug text-sm">{m.description}</p>
                  <div className="flex items-center justify-center text-xs font-black text-primary/60 space-x-2 bg-muted/30 py-1.5 rounded-full">
                    <Timer className="h-3.5 w-3.5" />
                    <span>{m.duration} Seconds</span>
                  </div>
                  <Button onClick={() => startMission(m.id)} className="w-full rounded-full h-12 font-black text-lg shadow-md group-hover:bg-primary group-hover:text-white transition-colors">
                    Start <ChevronRight className="ml-1 h-5 w-5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <div className="bg-primary/5 p-6 rounded-[1.5rem] border-2 border-primary/10 flex items-start gap-4 shadow-inner">
        <div className="p-3 bg-primary rounded-xl text-white shadow-md shrink-0">
          <Shield className="h-6 w-6" />
        </div>
        <div>
          <h4 className="text-lg font-black text-primary italic">Pro Eye Secret</h4>
          <p className="text-muted-foreground font-medium text-xs leading-relaxed">The 20-20-20 rule: Every 20 mins, look 20 feet away for 20 secs. Keep exploring, {explorerName}!</p>
        </div>
      </div>
    </div>
  );
}
