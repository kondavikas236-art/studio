"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Star, Globe, Clock } from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const PLANS = [
  {
    id: "free",
    name: "Basic",
    price: "$0",
    description: "Essential wellness for 1 child.",
    features: ["Standard Cockroach Mode", "Blink Buddy Mission", "Daily Summary", "1 Child Profile"],
    cta: "Current Plan",
    active: true,
  },
  {
    id: "family_pro",
    name: "Family Pro",
    price: "$1",
    period: "/mo",
    trialPeriod: "7 Days Free",
    description: "Advanced protection for the whole family.",
    features: [
      "Custom Cockroach Density", 
      "AI Diary Buddy (Unlimited)", 
      "Detailed PDF Reports", 
      "Up to 5 Child Profiles", 
      "Priority AI Generation"
    ],
    cta: "Start Free Trial",
    highlight: true,
  }
];

export default function BillingPage() {
  const { user } = useUser();
  const db = useFirestore();

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile } = useDoc(parentRef);

  const handleUpgrade = (planId: string) => {
    if (!parentRef || planId === "free") return;

    // In a real app, this would initiate a Stripe Checkout session with a trial period.
    // For this prototype, we update the profile to 'pro' immediately to show the features.
    updateDocumentNonBlocking(parentRef, {
      isPro: true,
      subscriptionTier: planId,
      trialStartedAt: new Date().toISOString(),
    });

    toast({
      title: "Trial Started! 🚀",
      description: "Your 7-day free trial of Family Pro has begun. Enjoy all premium features!",
    });
  };

  const currentTier = parentProfile?.subscriptionTier || "free";

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-foreground">Family Wellness Plans</h1>
        <p className="text-muted-foreground font-semibold max-w-xl mx-auto">
          Start your 7-day free trial today. Protect your family's digital health for just $1/month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto pt-4">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`rounded-[2.5rem] border-2 transition-all flex flex-col ${plan.highlight ? 'border-primary shadow-2xl scale-105 bg-white relative z-10' : 'border-border bg-white/50'}`}>
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
                <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full shadow-lg">MOST POPULAR</Badge>
              </div>
            )}
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
              <div className="flex flex-col items-center justify-center mt-4">
                <div className="flex items-center gap-1">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground font-bold">{plan.period}</span>}
                </div>
                {plan.trialPeriod && (
                  <Badge variant="secondary" className="mt-2 bg-accent/20 text-accent-foreground border-accent/30 font-bold">
                    <Clock className="h-3 w-3 mr-1" /> {plan.trialPeriod} Trial
                  </Badge>
                )}
              </div>
              <CardDescription className="font-medium mt-4">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4 pt-6">
              {plan.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 bg-green-100 p-0.5 rounded-full">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-foreground/80">{feature}</span>
                </div>
              ))}
            </CardContent>
            <CardFooter className="pb-8 px-8">
              <Button 
                onClick={() => handleUpgrade(plan.id)}
                disabled={currentTier === plan.id}
                variant={plan.highlight ? "default" : "outline"} 
                className="w-full rounded-full h-12 font-black text-lg shadow-md hover:scale-105 transition-transform"
              >
                {currentTier === plan.id ? "Current Plan" : plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="bg-white/50 backdrop-blur-md rounded-[2.5rem] p-10 border-2 border-dashed border-primary/20 text-center space-y-6">
        <div className="flex justify-center gap-6">
          <ShieldCheck className="h-12 w-12 text-primary opacity-40" />
          <Globe className="h-12 w-12 text-primary opacity-40" />
          <Star className="h-12 w-12 text-primary opacity-40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold">Risk-Free Trial</h3>
          <p className="text-sm text-muted-foreground font-medium max-w-md mx-auto">
            Try Family Pro for 7 days. If you don't love it, cancel anytime before the trial ends and you won't be charged a cent.
          </p>
        </div>
      </div>
    </div>
  );
}
