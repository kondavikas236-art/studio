"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Star, Globe } from "lucide-react";
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
    description: "Advanced protection for the whole family.",
    features: ["Custom Cockroach Density", "AI Diary Buddy (Unlimited)", "Detailed PDF Reports", "Up to 5 Child Profiles", "Priority AI Generation"],
    cta: "Upgrade to Pro",
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

    updateDocumentNonBlocking(parentRef, {
      isPro: true,
      subscriptionTier: planId,
    });

    toast({
      title: "Subscription Updated!",
      description: "Welcome to Kidsyee Pro. All premium features are now unlocked.",
    });
  };

  const currentTier = parentProfile?.subscriptionTier || "free";

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-foreground">Choose Your Plan</h1>
        <p className="text-muted-foreground font-semibold max-w-xl mx-auto">
          Unlock the full power of AI-driven wellness for just $1/month.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
        {PLANS.map((plan) => (
          <Card key={plan.id} className={`rounded-[2.5rem] border-2 transition-all flex flex-col ${plan.highlight ? 'border-primary shadow-2xl scale-105 bg-white relative z-10' : 'border-border bg-white/50'}`}>
            {plan.highlight && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-white font-black px-4 py-1 rounded-full">RECOMMENDED</Badge>
              </div>
            )}
            <CardHeader className="text-center pt-8">
              <CardTitle className="text-2xl font-black">{plan.name}</CardTitle>
              <div className="flex items-center justify-center gap-1 mt-4">
                <span className="text-4xl font-black">{plan.price}</span>
                {plan.period && <span className="text-muted-foreground font-bold">{plan.period}</span>}
              </div>
              <CardDescription className="font-medium mt-2">{plan.description}</CardDescription>
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
                className="w-full rounded-full h-12 font-black text-lg shadow-md"
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
          <h3 className="text-xl font-bold">Safe & Secure Payments</h3>
          <p className="text-sm text-muted-foreground font-medium">
            We use industry-standard encryption to protect your billing information. Cancel anytime with one click.
          </p>
        </div>
      </div>
    </div>
  );
}
