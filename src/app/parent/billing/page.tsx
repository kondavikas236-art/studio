
"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Clock, Sparkles, Loader2, CreditCard } from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

const PLAN = {
  id: "family_pro",
  name: "Family Pro",
  price: "$1",
  period: "/year",
  trialPeriod: "20 Days Free",
  description: "Complete digital protection for your entire family.",
  features: [
    "Custom Cockroach Density", 
    "Detailed PDF Reports", 
    "Up to 5 Child Profiles", 
    "Priority AI Generation",
    "Ad-Free Experience",
    "Real-time Wellness Monitoring"
  ],
  cta: "Start 20-Day Free Trial",
};

export default function BillingPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile } = useDoc(parentRef);

  const handleConfirmPurchase = () => {
    if (!parentRef) return;
    setIsProcessing(true);

    // Simulate payment gateway delay
    setTimeout(() => {
      updateDocumentNonBlocking(parentRef, {
        isPro: true,
        subscriptionTier: PLAN.id,
        trialStartedAt: new Date().toISOString(),
      });

      setIsProcessing(false);
      setShowCheckout(false);

      toast({
        title: "Subscription Active! 🚀",
        description: "Welcome to Family Pro. Your 20-day free trial has started.",
      });
    }, 2000);
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
          Protect your family's digital health. Start your 20-day trial for just $1/year.
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
              onClick={() => setShowCheckout(true)}
              disabled={isPro}
              className="w-full rounded-full h-16 font-black text-xl shadow-xl hover:scale-105 transition-transform"
            >
              {isPro ? "Plan Active" : PLAN.cta}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="rounded-[2rem]">
          <DialogHeader>
            <DialogTitle>Complete Subscription</DialogTitle>
            <DialogDescription>
              Confirm your upgrade to Family Pro. You won't be charged $1 until after your 20-day trial.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 space-y-4">
            <div className="bg-muted/30 p-4 rounded-2xl flex items-center justify-between border">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="font-bold">Family Pro Trial</span>
              </div>
              <span className="font-black">$0.00 today</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Prototype Note: This is a simulated checkout. After 20 days, you will be billed $1 for the full year.
            </p>
          </div>
          <DialogFooter>
            <Button 
              onClick={handleConfirmPurchase} 
              disabled={isProcessing}
              className="w-full rounded-full h-12 font-bold"
            >
              {isProcessing ? <Loader2 className="h-5 w-5 animate-spin" /> : "Confirm & Start Trial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="text-center opacity-60">
        <p className="text-sm font-medium">Cancel anytime during your 20-day trial to avoid the $1 yearly charge.</p>
      </div>
    </div>
  );
}
