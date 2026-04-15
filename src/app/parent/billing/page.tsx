
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Clock, Sparkles } from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const PLAN = {
  id: "family_pro",
  name: "Family Pro",
  price: "$1",
  period: "/mo",
  trialPeriod: "7 Days Free",
  description: "Complete digital protection for your entire family.",
  features: [
    "Custom Cockroach Density", 
    "AI Diary Buddy (Unlimited)", 
    "Detailed PDF Reports", 
    "Up to 5 Child Profiles", 
    "Priority AI Generation",
    "Ad-Free Experience"
  ],
  cta: "Start 7-Day Free Trial",
};

export default function BillingPage() {
  const { user } = useUser();
  const db = useFirestore();

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile } = useDoc(parentRef);

  const handleUpgrade = () => {
    if (!parentRef) return;

    updateDocumentNonBlocking(parentRef, {
      isPro: true,
      subscriptionTier: PLAN.id,
      trialStartedAt: new Date().toISOString(),
    });

    toast({
      title: "Trial Started! 🚀",
      description: "Your 7-day free trial of Family Pro has begun. Enjoy all premium features!",
    });
  };

  const isPro = parentProfile?.isPro || false;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <div className="inline-block p-3 rounded-2xl bg-primary/10 mb-2">
          <Sparkles className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-black text-foreground">Family Pro Subscription</h1>
        <p className="text-muted-foreground font-semibold max-w-xl mx-auto">
          Start your 7-day free trial today. Protect your family's digital health for just $1/month.
        </p>
      </div>

      <div className="max-w-md mx-auto pt-4">
        <Card className="rounded-[2.5rem] border-4 border-primary shadow-2xl bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <ShieldCheck className="h-32 w-32" />
          </div>
          
          <CardHeader className="text-center pt-10">
            <Badge className="w-fit mx-auto bg-primary text-white font-black px-4 py-1 rounded-full shadow-lg mb-4">
              BEST VALUE
            </Badge>
            <CardTitle className="text-3xl font-black">{PLAN.name}</CardTitle>
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex items-center gap-1">
                <span className="text-5xl font-black">{PLAN.price}</span>
                <span className="text-muted-foreground font-bold text-xl">{PLAN.period}</span>
              </div>
              <Badge variant="secondary" className="mt-4 bg-accent/20 text-accent-foreground border-accent/30 font-bold px-4 py-1">
                <Clock className="h-4 w-4 mr-2" /> {PLAN.trialPeriod} Trial
              </Badge>
            </div>
            <CardDescription className="font-medium mt-6 px-4">
              {PLAN.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-8 px-10">
            {PLAN.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 bg-green-100 p-1 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-base font-semibold text-foreground/80">{feature}</span>
              </div>
            ))}
          </CardContent>

          <CardFooter className="pb-10 px-10 pt-8">
            <Button 
              onClick={handleUpgrade}
              disabled={isPro}
              className="w-full rounded-full h-16 font-black text-xl shadow-xl hover:scale-105 transition-transform"
            >
              {isPro ? "Plan Active" : PLAN.cta}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="text-center opacity-60">
        <p className="text-sm font-medium">Cancel anytime during your 1-week trial to avoid charges.</p>
      </div>
    </div>
  );
}
