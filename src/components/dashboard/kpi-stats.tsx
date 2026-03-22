"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Shield, Activity, TrendingUp, TrendingDown, LayoutGrid } from "lucide-react";
import { motion } from "framer-motion";
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
            change: "+12.4%",
            trending: "up",
            color: "emerald"
        },
        {
            label: "Active Assets",
            value: stats.identities.toLocaleString(),
            subValue: "Global Infrastructure Map",
            icon: LayoutGrid,
            subLabel: "Deployed",
            color: "slate"
        },
        {
            label: "Pending Review",
            value: stats.registry.toString(),
            subValue: "~47h Turnaround Time",
            icon: Shield,
            subLabel: "Action Req.",
            color: "amber",
            alert: true
        },
        {
            label: "Registry Value",
            value: "847.2k",
            subValue: "Current Market Est.",
            icon: Zap,
            change: "+3.7%",
            trending: "up",
            color: "emerald"
        },
    ];

    return (
        <>
            {kpiData.map((stat, idx) => (
                <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: idx * 0.08
                    }}
                    whileHover={{
                        y: -4,
                        transition: { type: "spring", stiffness: 400, damping: 17 }
                    }}
                >
                    <Card className="card-stat card-glass bg-opacity-40 group cursor-default">
                        <CardContent className="p-5 flex flex-col justify-between h-full relative overflow-hidden">
                            {/* Status Glow Background with perpetual float */}
                            <motion.div
                                className={cn(
                                    "absolute -top-12 -right-12 w-24 h-24 blur-[40px] opacity-20 pointer-events-none",
                                    stat.color === 'emerald' ? 'bg-emerald-500' :
                                        stat.color === 'slate' ? 'bg-slate-400' :
                                            stat.color === 'amber' ? 'bg-amber-500' : 'bg-emerald-500'
                                )}
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.2, 0.35, 0.2]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            />

                            <div className="flex items-start justify-between mb-4 relative z-10">
                                <div className="flex flex-col">
                                    <p className="text-xs font-black text-white/30 uppercase tracking-[0.25em] leading-none mb-2">{stat.label}</p>
                                    <div className="flex items-baseline gap-2">
                                        <motion.h3
                                            className="text-2xl font-black tracking-tighter text-white tabular-nums drop-shadow-sm"
                                            initial={{ scale: 0.9 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15,
                                                delay: idx * 0.08 + 0.2
                                            }}
                                        >
                                            {stat.value}
                                        </motion.h3>
                                        {stat.subLabel && (
                                            <Badge variant="outline" className="text-xs font-bold bg-white/5 border-white/10 text-white/40 px-1.5 py-0">
                                                {stat.subLabel}
                                            </Badge>
                                        )}
                                        {stat.change && (
                                            <motion.div
                                                className={cn(
                                                    "flex items-center gap-0.5 text-xs font-bold px-1.5 py-0.5 rounded backdrop-blur-md",
                                                    stat.trending === 'up' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
                                                )}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{
                                                    delay: idx * 0.08 + 0.3,
                                                    type: "spring",
                                                    stiffness: 200
                                                }}
                                            >
                                                {stat.trending === 'up' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                {stat.change}
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                                <motion.div
                                    className={cn(
                                        "p-2 rounded-xl glass-strong border border-white/10 text-white/40 group-hover:text-white transition-colors duration-300 shadow-inner",
                                        stat.alert ? "text-amber-500 border-amber-500/20 bg-amber-500/5" : ""
                                    )}
                                    animate={stat.alert ? {
                                        boxShadow: [
                                            "0 0 0 rgba(245, 158, 11, 0)",
                                            "0 0 16px rgba(245, 158, 11, 0.3)",
                                            "0 0 0 rgba(245, 158, 11, 0)"
                                        ]
                                    } : {}}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                    whileHover={{
                                        scale: 1.1,
                                        rotate: 5,
                                        transition: { type: "spring", stiffness: 400, damping: 10 }
                                    }}
                                >
                                    <stat.icon size={18} strokeWidth={2.5} />
                                </motion.div>
                            </div>
                            <p className="text-xs text-white/20 font-medium tracking-wide relative z-10">{stat.subValue}</p>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </>
    );
}

