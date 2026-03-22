"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LOGS = [
    { id: 1, action: "IoT Verification", detail: "Solar Array #8821 Active", time: "2m ago", status: "success" },
    { id: 2, action: "Hash Generated", detail: "GP-8821-VX Locked", time: "15m ago", status: "success" },
    { id: 3, action: "Compliance Check", detail: "SOC2 Control #4.1 pass", time: "1h ago", status: "success" },
    { id: 4, action: "Satellite Sync", detail: "Irradiance verified", time: "2h ago", status: "success" },
];

export function AuditLogsCard() {
    return (
        <Card className="h-full card-glass card-interactive flex flex-col group overflow-hidden bg-opacity-40">
            <CardHeader className="p-6 pb-2 flex flex-row items-center justify-between space-y-0 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                        <History size={16} />
                    </div>
                    <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">Infrastructure Logs</CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="text-xs uppercase font-bold text-emerald-400/60 hover:text-emerald-400 hover:bg-emerald-500/10 tracking-widest transition-all">
                    Full Registry <ArrowRight size={12} className="ml-1" />
                </Button>
            </CardHeader>
            <CardContent className="p-6 pt-2 flex-1 overflow-y-auto custom-scrollbar relative z-10">
                <div className="space-y-4">
                    {LOGS.map((log, idx) => (
                        <div key={idx} className={cn(
                            "flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0 animate-slide-up",
                            idx === 1 ? "stagger-1" : idx === 2 ? "stagger-2" : idx === 3 ? "stagger-3" : ""
                        )}>
                            <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.4)] shrink-0 animate-pulse" />
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-center mb-0.5">
                                    <p className="text-xs font-bold text-white/90 group-hover:text-white transition-colors tracking-tight">{log.action}</p>
                                    <span className="text-xs text-white/20 font-mono tracking-tighter uppercase">{log.time}</span>
                                </div>
                                <p className="text-sm text-white/40 font-medium truncate tracking-tight">{log.detail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>

            {/* Background Accents */}
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-emerald-600/5 blur-[50px] pointer-events-none" />

            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500/40" />
                    <span className="text-xs font-bold text-white/20 uppercase tracking-[0.2em] leading-none">Standard: ISO-14064 Immutable</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Badge variant="outline" className="text-xs font-black bg-emerald-500/5 text-emerald-500/60 border-emerald-500/10 px-1.5 py-0">SYNCED</Badge>
                </div>
            </div>
        </Card>
    );
}
