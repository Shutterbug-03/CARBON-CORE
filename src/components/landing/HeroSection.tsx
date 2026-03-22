import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, CheckCircle2, Puzzle, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ForceFieldBackground } from "@/components/ui/force-field-background";

export const HeroSection = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 pb-20 overflow-hidden selection:bg-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
            {/* ForceField Background */}
            <div className="absolute inset-0 z-0 opacity-40">
                <ForceFieldBackground
                    hue={140}
                    saturation={40}
                    spacing={12}
                    forceStrength={8}
                    className="opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/80" />
            </div>

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10 grid lg:grid-cols-12 gap-12 items-center">
                <div className="lg:col-span-8">
                    <Badge variant="outline" className="mb-6 bg-primary/10 text-primary border-primary/30 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary/10 inline-flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        Infrastructure for the Climate Era
                    </Badge>

                    <h1 className="text-6xl md:text-8xl xl:text-[9rem] font-black tracking-tighter mb-8 leading-[0.85] text-foreground">
                        Stop Drowning in <br />
                        <span className="italic font-serif text-primary drop-shadow-[0_4px_20px_rgba(34,197,94,0.3)]">Reporting.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mb-12 font-medium leading-relaxed">
                        Deliver instant, 24/7 verifiable climate impact without burning out your team.
                        <span className="text-primary font-semibold"> GreenPe</span> uses machine-verifiable proof to turn metadata into trust.
                        Seamlessly integrated. No code. No guessing.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6">
                        <Link href="/onboarding">
                            <Button size="lg" className="h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 gap-3 border-0 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 cursor-pointer">
                                Request Pilot Access <ArrowRight size={18} />
                            </Button>
                        </Link>
                        <div className="flex items-center gap-4 bg-background border border-primary/20 rounded-full pr-6 p-2 backdrop-blur-md shadow-lg">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-10 w-10 border-2 border-background rounded-full overflow-hidden bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm relative">
                                        {i === 1 ? "AD" : i === 2 ? "RE" : "TS"}
                                    </div>
                                ))}
                                <div className="h-10 w-10 border-2 border-background rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-primary-foreground shadow-lg shadow-primary/30 z-10">
                                    +1k
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-tight">
                                Join 1000+ teams <br /> delivering impact
                            </p>
                        </div>
                    </div>

                    {/* Benefit Bullets */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 pt-10 border-t border-primary/20">
                        {[
                            { icon: Clock, title: "~60% Faster", desc: "Instant Verification" },
                            { icon: CheckCircle2, title: "100% Truth", desc: "Cited Metadata" },
                            { icon: Puzzle, title: "L1/L2 Unified", desc: "Seamless Activation" }
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-center gap-4 group">
                                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300 shadow-md">
                                    <benefit.icon className="h-5 w-5 text-primary group-hover:text-primary-foreground transition-colors" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-foreground leading-none mb-1.5">{benefit.title}</p>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide">{benefit.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-4 hidden lg:block">
                    <div className="relative group perspective-[1000px]">
                        <div className="absolute -inset-1 bg-gradient-to-tr from-primary/60 via-primary/40 to-primary/80 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition duration-700 group-hover:duration-300" />
                        <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-primary/20 bg-background shadow-2xl transform transition-transform duration-500 group-hover:rotate-y-2 group-hover:rotate-x-2">

                            {/* Glassmorphism Mock UI */}
                            <div className="absolute inset-0 bg-gradient-to-br from-background/80 to-background/90 p-8 flex flex-col justify-between backdrop-blur-xl">
                                <div className="space-y-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                                            <Activity size={16} className="text-primary-foreground" />
                                        </div>
                                        <div className="h-1.5 w-12 bg-primary rounded-full shadow-lg shadow-primary/30" />
                                    </div>
                                    <div className="h-4 w-48 bg-primary/20 rounded-full" />
                                    <div className="h-3 w-32 bg-primary/10 rounded-full" />
                                </div>

                                <div className="space-y-6 bg-card p-6 rounded-2xl border border-primary/20 backdrop-blur-md shadow-xl">
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Live Signal Stream</span>
                                        </div>
                                        <Badge className="bg-primary/10 text-primary border-primary/30 px-3 py-0.5 text-[9px] uppercase tracking-widest shadow-sm cursor-default">
                                            Active
                                        </Badge>
                                    </div>
                                    <div className="h-32 w-full bg-gradient-to-t from-primary/20 to-transparent border border-primary/30 rounded-xl flex items-end px-4 gap-2 pb-0 pt-8 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
                                        {/* Simulated bar chart */}
                                        {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                                            <div key={i} className="flex-1 bg-primary/60 rounded-t-sm relative group-hover:bg-primary transition-colors duration-500" style={{ height: `${height}%`, transitionDelay: `${i * 50}ms` }}>
                                                <div className="absolute top-0 left-0 right-0 h-1 bg-primary rounded-t-sm shadow-lg shadow-primary/50" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
