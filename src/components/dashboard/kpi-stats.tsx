"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Zap, Shield, Lock, Activity, TrendingUp, TrendingDown, Globe, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

interface Stats {
    certificates: number;
    impact: number;
    registry: number;
    identities: number;
}

export function KPIStats({ stats }: { stats: Stats }) {
    const kpiData = [
        {
            label: "Total Verified",
            value: stats.certificates.toLocaleString(),
            subValue: "tCO2e Lifetime Volume",
            icon: Activity,
            change: "+12%",
            trending: "up",
            color: "emerald"
        },
        {
            label: "Active Assets",
            value: stats.identities.toLocaleString(),
            subValue: "Global Infrastructure Map",
            icon: LayoutGrid,
            subLabel: "Deployed",
            color: "blue"
        },
        {
            label: "Pending Review",
            value: stats.registry.toString(),
            subValue: "~48h Turnaround Time",
            icon: Shield,
            subLabel: "Action Req.",
            color: "amber",
            alert: true
        },
        {
            label: "Registry Value",
            value: "892k",
            subValue: "Current Market Est.",
            icon: Zap,
            change: "+3.1%",
            trending: "up",
            color: "purple"
        },
    ];

    return (
        <>
            {kpiData.map((stat, idx) => (
                <Card
                    key={stat.label}
                    className={cn(
                        "card-stat card-glass animate-slide-up bg-opacity-40",
                        idx === 0 ? "stagger-1" : idx === 1 ? "stagger-2" : idx === 2 ? "stagger-3" : "stagger-4"
                    )}
                >
                    <CardContent className="p-5 flex flex-col justify-between h-full relative overflow-hidden">
                        {/* Status Glow Background */}
                        <div className={cn(
                            "absolute -top-12 -right-12 w-24 h-24 blur-[40px] opacity-20 pointer-events-none transition-all duration-500 group-hover:opacity-40",
                            stat.color === 'emerald' ? 'bg-emerald-500' :
                                stat.color === 'blue' ? 'bg-blue-500' :
                                    stat.color === 'amber' ? 'bg-amber-500' : 'bg-purple-500'
                        )} />

                        <div className="flex items-start justify-between mb-4 relative z-10">
                            <div className="flex flex-col">
                                <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] leading-none mb-2">{stat.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-2xl font-black tracking-tighter text-white tabular-nums drop-shadow-sm">
                                        {stat.value}
                                    </h3>
                                    {stat.subLabel && (
                                        <Badge variant="outline" className="text-[10px] font-bold bg-white/5 border-white/10 text-white/40 px-1.5 py-0">
                                            {stat.subLabel}
                                        </Badge>
                                    )}
                                    {stat.change && (
                                        <div className={cn(
                                            "flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded backdrop-blur-md",
                                            stat.trending === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                                        )}>
                                            {stat.trending === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                            {stat.change}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={cn(
                                "p-2 rounded-xl glass-strong border border-white/10 text-white/40 group-hover:text-white transition-all duration-500 shadow-inner",
                                stat.alert ? "animate-pulse-glow text-amber-500 border-amber-500/20 bg-amber-500/5" : ""
                            )}>
                                <stat.icon size={18} strokeWidth={2.5} />
                            </div>
                        </div>
                        <p className="text-[10px] text-white/20 font-medium tracking-wide relative z-10">{stat.subValue}</p>
                    </CardContent>
                </Card>
            ))}
        </>
    );
}

