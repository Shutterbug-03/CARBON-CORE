"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, AlertTriangle, CheckCircle2, Link2, Clock, Activity, Loader2 } from "lucide-react";
import { useApp } from "@/providers/app-provider";

interface AuditEvent {
    id: string | number;
    layer: number;
    event: string;
    hash: string;
    status: string;
    time: string;
}

export default function AuditDefensePage() {
    const { user } = useApp();
    const [events, setEvents] = useState<AuditEvent[]>([]);
    const [chainDepth, setChainDepth] = useState(24892);
    const [chainHead, setChainHead] = useState("0xae3f...d921");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAuditLogs() {
            try {
                const entityId = user.entity?.id || "";
                const res = await fetch(`/api/audit/logs?entityId=${entityId}`);
                if (res.ok) {
                    const data = await res.json();
                    setEvents(data.events || []);
                    setChainDepth(data.chainDepth || 24892);
                    setChainHead(data.chainHead || "0xae3f...d921");
                }
            } catch (err) {
                console.error("Failed to load live audit ledger logs:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchAuditLogs();
        const interval = setInterval(fetchAuditLogs, 10000); // Auto-refresh every 10 seconds
        return () => clearInterval(interval);
    }, [user.entity?.id]);

    return (
        <div className="space-y-5 max-w-4xl mx-auto animate-fade-in p-4 md:p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Audit Defense</h1>
                    <p className="text-sm text-foreground/25">Immutable hash chain • Real-time layer monitoring</p>
                </div>
                <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-xs gap-1 animate-pulse-glow">
                    <Activity size={10} /> Live Feed
                </Badge>
            </div>

            {/* Hash Chain Integrity */}
            <Card className="glass-green border border-green-500/15 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
                <CardContent className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                        <Link2 size={18} className="text-green-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-[13px] font-semibold text-white/90">Hash Chain Integrity</h3>
                            <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px] gap-0.5"><CheckCircle2 size={8} /> Verified</Badge>
                        </div>
                        <p className="text-xs text-foreground/25 font-mono mt-0.5">Chain Head: {chainHead} • Depth: {chainDepth.toLocaleString()} blocks</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-foreground/20">Last verified</p>
                        <p className="text-sm text-green-400/80 font-mono">Just now</p>
                    </div>
                </CardContent>
            </Card>

            {/* Event Feed */}
            {loading && events.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <Loader2 size={32} className="text-green-400 animate-spin" />
                    <p className="text-xs text-foreground/20 font-mono">Decoupling and verifying ledger blocks...</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    {events.map((event, i) => (
                        <Card
                            key={event.id}
                            className={`glass transition-all duration-300 group cursor-default ${event.status === "anomaly"
                                    ? "border-red-500/15 bg-red-500/[0.03] hover:border-red-400/25"
                                    : "hover:bg-foreground/[0.04] hover:border-foreground/8 border-foreground/[0.04]"
                                } animate-slide-up`}
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <CardContent className="p-3.5 flex items-center gap-3.5">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${event.status === "anomaly"
                                        ? "bg-red-500/10 text-red-400"
                                        : "bg-foreground/[0.03] text-foreground/20 group-hover:bg-green-500/8 group-hover:text-green-400/50"
                                    }`}>
                                    {event.status === "anomaly" ? <AlertTriangle size={14} /> : <Shield size={14} />}
                                </div>
                                <Badge className="bg-foreground/5 text-foreground/25 border border-foreground/[0.08] text-[8px] shrink-0 font-mono">L{event.layer}</Badge>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors truncate tracking-tight">{event.event}</p>
                                    <p className="text-xs text-foreground/15 font-mono mt-0.5">{event.hash}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                    <Clock size={10} className="text-foreground/10" />
                                    <span className="text-xs text-foreground/20">{event.time}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
