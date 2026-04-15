"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { Clock, Smartphone, AlertCircle, TrendingUp, CheckCircle2, UserPlus, Shield, Loader2, Trash2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase";
import { collection, doc } from "firebase/firestore";
import { addDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase/non-blocking-updates";
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const USAGE_DATA = [
  { day: 'Mon', games: 45, education: 120, other: 15 },
  { day: 'Tue', games: 60, education: 90, other: 20 },
  { day: 'Wed', games: 30, education: 150, other: 10 },
  { day: 'Thu', games: 90, education: 60, other: 30 },
  { day: 'Fri', games: 120, education: 45, other: 40 },
  { day: 'Sat', games: 180, education: 30, other: 60 },
  { day: 'Sun', games: 150, education: 30, other: 45 },
];

const chartConfig: ChartConfig = {
  games: { label: "Gaming", color: "#2E8AB8" },
  education: { label: "Educational", color: "#CFE467" },
  other: { label: "Others", color: "#4FB0C6" },
};

function calculateAge(dobString: string): number {
  if (!dobString) return 0;
  const birthDate = new Date(dobString);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function ParentDashboard() {
  const { user } = useUser();
  const db = useFirestore();
  const [newChildName, setNewChildName] = useState("");
  const [newChildDob, setNewChildDob] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  const childrenQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return collection(db, "parentProfiles", user.uid, "childProfiles");
  }, [db, user]);

  const { data: children, isLoading } = useCollection(childrenQuery);

  const handleAddChild = () => {
    if (!db || !user || !newChildName.trim() || !newChildDob) return;

    const colRef = collection(db, "parentProfiles", user.uid, "childProfiles");
    addDocumentNonBlocking(colRef, {
      parentId: user.uid,
      name: newChildName,
      dateOfBirth: newChildDob,
      avatarUrl: `https://picsum.photos/seed/${Math.random()}/200/200`,
      dailyScreenTimeLimitMinutes: 120,
      gamingTimeLimitMinutes: 60
    });

    setNewChildName("");
    setNewChildDob("");
    setIsAddOpen(false);
  };

  const handleDeleteChild = (childId: string) => {
    if (!db || !user) return;
    const childRef = doc(db, "parentProfiles", user.uid, "childProfiles", childId);
    deleteDocumentNonBlocking(childRef);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Family Insights</h2>
          <p className="text-muted-foreground">Monitoring wellness for {children?.length || 0} children</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full">
                <UserPlus className="mr-2 h-4 w-4" /> Add Children
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[2.5rem]">
              <DialogHeader>
                <DialogTitle>New Child Profile</DialogTitle>
                <DialogDescription>Add a profile to track screen time and healthy habits.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Child Name</Label>
                  <Input 
                    id="name" 
                    placeholder="e.g. Alex" 
                    value={newChildName} 
                    onChange={(e) => setNewChildName(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  <Input 
                    id="dob" 
                    type="date"
                    value={newChildDob} 
                    onChange={(e) => setNewChildDob(e.target.value)} 
                    className="rounded-xl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddChild} className="rounded-full w-full">Save Profile</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-48 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : children?.length === 0 ? (
        <Card className="rounded-[2.5rem] border-dashed border-2 border-primary/20 p-12 text-center bg-primary/5">
          <Shield className="h-12 w-12 text-primary/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold">No Children Yet</h3>
          <p className="text-muted-foreground mb-6">Add your first child profile to start monitoring screen time.</p>
          <Button variant="outline" onClick={() => setIsAddOpen(true)} className="rounded-full">Add Children Now</Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" /> Daily Avg
              </CardDescription>
              <CardTitle className="text-2xl font-black">2h 45m</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> 12% decrease from last week
              </div>
            </CardContent>
          </Card>
          
          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-foreground" /> Goal Progress
              </CardDescription>
              <CardTitle className="text-2xl font-black">85%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs font-bold text-muted-foreground">Limits met 6/7 days</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-blue-500" /> Focus Score
              </CardDescription>
              <CardTitle className="text-2xl font-black">Good</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-xs font-bold text-blue-500">Highest during learning</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-none shadow-sm bg-white border-l-4 border-l-destructive">
            <CardHeader className="pb-2">
              <CardDescription className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-destructive" /> Active Alerts
              </CardDescription>
              <CardTitle className="text-2xl font-black">{children?.length > 0 ? "1 Active" : "0"}</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="text-xs font-bold text-destructive">Gaming limit exceeded today</div>
            </CardContent>
          </Card>
        </div>
      )}

      {children && children.length > 0 && (
        <>
          <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader>
              <CardTitle>Usage Trends</CardTitle>
              <CardDescription>Daily breakdown of activity categories across all children</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="week" className="w-full">
                <TabsList className="mb-6 bg-muted/50 p-1 rounded-xl">
                  <TabsTrigger value="day" className="rounded-lg">Daily</TabsTrigger>
                  <TabsTrigger value="week" className="rounded-lg">Weekly</TabsTrigger>
                  <TabsTrigger value="month" className="rounded-lg">Monthly</TabsTrigger>
                </TabsList>
                <TabsContent value="week">
                   <div className="h-[400px] w-full mt-4">
                      <ChartContainer config={chartConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={USAGE_DATA}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                            <XAxis 
                              dataKey="day" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 500, fill: '#64748b'}} 
                              dy={10}
                            />
                            <YAxis 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{fontSize: 12, fontWeight: 500, fill: '#64748b'}}
                              dx={-10}
                            />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Legend iconType="circle" />
                            <Bar dataKey="education" stackId="a" fill="var(--color-education)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="games" stackId="a" fill="var(--color-games)" radius={[0, 0, 0, 0]} />
                            <Bar dataKey="other" stackId="a" fill="var(--color-other)" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                   </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="rounded-3xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle>Child Profiles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {children.map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-2xl hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={child.avatarUrl} alt={child.name} className="h-12 w-12 rounded-full border-2 border-primary/20 object-cover" />
                        <div>
                          <p className="font-bold text-lg">{child.name}</p>
                          <p className="text-xs text-muted-foreground font-semibold">Age {calculateAge(child.dateOfBirth)} • Explorer</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href="/parent/settings">
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </Link>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="rounded-[2.5rem]">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Remove Child Profile?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to remove {child.name}? This will permanently delete their progress and settings.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteChild(child.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full"
                              >
                                Delete Child
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-none shadow-sm bg-white">
              <CardHeader>
                <CardTitle>Smart Suggestions</CardTitle>
                <CardDescription>AI-driven observations for wellness</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex gap-4">
                   <TrendingUp className="h-6 w-6 text-primary shrink-0" />
                   <p className="text-sm">Children show <strong>20% better focus</strong> after taking an eye health break. Consider scheduling automated breaks every 45 mins.</p>
                </div>
                <div className="p-4 rounded-2xl bg-accent/10 border border-accent/20 flex gap-4">
                   <AlertCircle className="h-6 w-6 text-accent-foreground shrink-0" />
                   <p className="text-sm">Late-night usage detected. We suggest activating <strong>Wind-Down Mode</strong> at 7:30 PM in settings.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
