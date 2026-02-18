"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
export function NetImpactCard() {
    return (
        <Card className="h-full card-glass card-interactive flex flex-col overflow-hidden group bg-opacity-40">
            <CardHeader className="p-6 pb-2 relative z-10">
                <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Network Impact (tCO2e)</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between relative z-10">
                <div className="flex items-baseline gap-2 group-hover:translate-x-1 transition-transform">
                    <span className="text-4xl font-black text-white tracking-tighter drop-shadow-sm">4.2k</span>
                    <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px] h-6 px-1.5 flex items-center gap-0.5 font-bold">
                        <TrendingUp size={12} /> +12%
                    </Badge>
                </div>

                {/* Visualizer Mock */}
                <div className="mt-8 flex-1 flex items-end gap-1.5 h-24">
                    {[35, 45, 30, 60, 40, 75, 45, 65, 85, 55, 70, 90].map((h, i) => (
                        <div
                            key={i}
                            style={{ height: `${h}%` }}
                            className={cn(
                                "flex-1 rounded-sm transition-all duration-700 ease-out",
                                i === 11 ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-white/5 group-hover:bg-white/10'
                            )}
                        />
                    ))}
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl glass-strong flex items-center justify-center border border-white/10 group-hover:border-emerald-500/30 transition-colors">
                        <Leaf size={18} className="text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-white/20 uppercase tracking-[0.2em] leading-none mb-1.5">Ecological Status</p>
                        <p className="text-xs font-bold text-white/80 tracking-tight group-hover:text-white transition-colors">Net Positive Momentum</p>
                    </div>
                </div>
            </CardContent>

            {/* Glow Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-[60px] pointer-events-none" />
        </Card>
    );
}
