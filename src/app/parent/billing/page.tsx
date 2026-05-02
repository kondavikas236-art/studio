"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ShieldCheck, Clock, Sparkles, Loader2, CreditCard, Lock } from "lucide-react";
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { updateDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const PLAN = {
  id: "family_pro",
  name: "Family Pro",
  price: "$1",
  period: "/year",
  trialPeriod: "20 Days Free",
  description: "Complete digital protection for your entire family.",
  features: [
    "Unlimited Child Profiles",
    "Detailed Eye Health Analytics",
    "AI-Generated Wellness Reports",
    "Custom Cockroach Density Controls",
    "Priority AI Generation Quotas",
    "Ad-Free Secure Experience"
  ],
  cta: "Start 20-Day Free Trial",
};

export default function BillingPage() {
  const { user } = useUser();
  const db = useFirestore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  
  // Form fields for simulated checkout
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const parentRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "parentProfiles", user.uid);
  }, [db, user]);

  const { data: parentProfile } = useDoc(parentRef);

  const handleConfirmPurchase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentRef) return;
    setIsProcessing(true);

    // Simulate payment gateway delay (e.g. Stripe/PayPal)
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
    }, 2500);
  };

  const isPro = parentProfile?.isPro || false;

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div className="text-center space-y-4">
        <div className="inline-block p-4 rounded-3xl bg-primary/10 mb-2">
          <Sparkles className="h-10 w-10 text-primary animate-pulse" />
        </div>
        <h1 className="text-4xl font-black text-foreground tracking-tight">Family Pro Subscription</h1>
        <p className="text-muted-foreground font-semibold max-w-xl mx-auto text-lg leading-relaxed">
          Protect your family's eyes and build healthy digital habits. Start your 20-day trial for just $1/year.
        </p>
      </div>

      <div className="max-w-md mx-auto pt-4">
        <Card className="rounded-[3rem] border-4 border-primary shadow-2xl bg-white relative overflow-hidden transition-all hover:scale-[1.01]">
          <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
            <ShieldCheck className="h-40 w-40" />
          </div>
          
          <CardHeader className="text-center pt-10">
            <Badge className="w-fit mx-auto bg-primary text-white font-black px-6 py-1.5 rounded-full shadow-lg mb-4 text-sm">
              MOST POPULAR
            </Badge>
            <CardTitle className="text-4xl font-black italic">{PLAN.name}</CardTitle>
            <div className="flex flex-col items-center justify-center mt-6">
              <div className="flex items-center gap-1">
                <span className="text-6xl font-black">{PLAN.price}</span>
                <span className="text-muted-foreground font-bold text-xl">{PLAN.period}</span>
              </div>
              <Badge variant="secondary" className="mt-4 bg-accent/20 text-accent-foreground border-accent/30 font-bold px-4 py-1.5 rounded-full">
                <Clock className="h-4 w-4 mr-2" /> {PLAN.trialPeriod} Trial
              </Badge>
            </div>
            <CardDescription className="font-medium mt-6 px-4 text-base leading-relaxed">
              {PLAN.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-5 pt-8 px-10">
            {PLAN.features.map((feature, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="mt-1 bg-green-100 p-1 rounded-full shrink-0">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-base font-bold text-foreground/80">{feature}</span>
              </div>
            ))}
          </CardContent>

          <CardFooter className="pb-12 px-10 pt-8">
            <Button 
              onClick={() => setShowCheckout(true)}
              disabled={isPro}
              className="w-full rounded-full h-16 font-black text-xl shadow-xl hover:scale-105 transition-transform bg-primary hover:bg-primary/90"
            >
              {isPro ? "Current Subscription" : PLAN.cta}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="rounded-[2.5rem] sm:max-w-[450px] p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 pb-4 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
               <div className="p-2 bg-primary rounded-xl text-white">
                 <CreditCard className="h-6 w-6" />
               </div>
               <DialogTitle className="text-2xl font-black">Checkout</DialogTitle>
            </div>
            <DialogDescription className="font-medium text-foreground/80">
              You will start your 20-day free trial today. No charges until after the trial ends.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleConfirmPurchase}>
            <div className="px-8 py-6 space-y-6">
              <div className="bg-primary/5 p-4 rounded-2xl flex items-center justify-between border border-primary/10">
                <span className="font-bold text-primary">Family Pro Trial</span>
                <span className="font-black text-primary">$0.00 Today</span>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cardNumber" className="font-bold">Card Number</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="cardNumber" 
                      placeholder="0000 0000 0000 0000" 
                      className="pl-10 rounded-xl"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="font-bold">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY" 
                      className="rounded-xl"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="font-bold">CVC</Label>
                    <Input 
                      id="cvc" 
                      placeholder="123" 
                      className="rounded-xl"
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-medium bg-muted/30 p-3 rounded-xl border border-dashed leading-normal">
                <Lock className="h-3 w-3 shrink-0" />
                <span>Prototype Note: This is a secure simulation. In a live production environment, this would integrate with a provider like Stripe or PayPal.</span>
              </div>
            </div>

            <DialogFooter className="px-8 pb-8 pt-2">
              <Button 
                type="submit"
                disabled={isProcessing}
                className="w-full rounded-full h-14 font-black text-lg shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Verifying...</span>
                  </div>
                ) : (
                  "Confirm & Start Trial"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="text-center opacity-60">
        <p className="text-sm font-bold flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4" /> Secure yearly billing of $1 starts after 20 days. Cancel anytime via settings.
        </p>
      </div>
    </div>
  );
}
