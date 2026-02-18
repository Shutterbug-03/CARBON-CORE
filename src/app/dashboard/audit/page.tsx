"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Link2, Clock, Activity, Lock, Eye } from "lucide-react";

const auditEvents = [
    { id: 1, layer: 1, event: "Identity CIH binding validated", hash: "0xae3f...d921", status: "verified", time: "2m ago" },
    { id: 2, layer: 2, event: "IoT sensor batch #4821 ingested", hash: "0x7bc2...f103", status: "verified", time: "5m ago" },
    { id: 3, layer: 3, event: "MRV computation cycle #12,841", hash: "0xd1e4...a782", status: "verified", time: "8m ago" },
    { id: 4, layer: 4, event: "Anomaly flag — duplicate CIH attempt", hash: "0x92f1...c340", status: "anomaly", time: "12m ago" },
    { id: 5, layer: 4, event: "Pattern analysis pass complete", hash: "0xb5a3...e672", status: "verified", time: "15m ago" },
    { id: 6, layer: 5, event: "EAT minted — token #GIC-24892", hash: "0xc8d2...b931", status: "verified", time: "18m ago" },
    { id: 7, layer: 6, event: "GIC certificate signed & anchored", hash: "0xf1a9...d443", status: "verified", time: "22m ago" },
    { id: 8, layer: 7, event: "UPI settlement initiated — ₹12,400", hash: "0x3e7b...a892", status: "verified", time: "25m ago" },
];

export default function AuditDefensePage() {
    const [events, setEvents] = useState(auditEvents);

    return (
        <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Audit Defense</h1>
                    <p className="text-[11px] text-foreground/25">Immutable hash chain • Real-time layer monitoring</p>
                </div>
                <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[9px] gap-1 animate-pulse-glow">
                    <Activity size={10} /> Live Feed
                </Badge>
            </div>

            {/* Hash Chain Integrity */}
            <Card className="glass-green">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Link2 size={18} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[13px] font-semibold">Hash Chain Integrity</h3>
                            <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px] gap-0.5"><CheckCircle2 size={8} /> Verified</Badge>
                        </div>
                        <p className="text-[10px] text-foreground/25 font-mono mt-0.5">Chain Head: 0xae3f...d921 • Depth: 24,892 blocks</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] text-foreground/20">Last verified</p>
                        <p className="text-[11px] text-green-400/80 font-mono">2m ago</p>
                    </div>
                </CardContent>
            </Card>

            {/* Event Feed */}
            <div className="space-y-1.5">
                {events.map((event, i) => (
                    <Card
                        key={event.id}
                        className={`glass transition-all duration-300 group cursor-default ${event.status === "anomaly"
                                ? "border-red-500/15 bg-red-500/[0.03] hover:border-red-400/25"
                                : "hover:bg-foreground/[0.04] hover:border-foreground/8"
                            } animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                        style={{ opacity: 0 }}
                    >
                        <CardContent className="p-3.5 flex items-center gap-3.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${event.status === "anomaly"
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-foreground/[0.03] text-foreground/20 group-hover:bg-green-500/8 group-hover:text-green-400/50"
                                }`}>
                                {event.status === "anomaly" ? <AlertTriangle size={14} /> : <Shield size={14} />}
                            </div>
                            <Badge className="bg-foreground/5 text-foreground/25 border-foreground/5 text-[8px] shrink-0">L{event.layer}</Badge>
                            <div className="flex-1 min-w-0">
                                <p className="text-[12px] text-foreground/60 group-hover:text-foreground/80 transition-colors truncate">{event.event}</p>
                                <p className="text-[9px] text-foreground/15 font-mono mt-0.5">{event.hash}</p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                                <Clock size={10} className="text-foreground/10" />
                                <span className="text-[9px] text-foreground/20">{event.time}</span>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
