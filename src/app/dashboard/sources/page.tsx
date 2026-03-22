"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Database, Wifi, Globe, Activity, Signal, ChevronRight, Radio, Satellite, Server } from "lucide-react";
import { cn } from "@/lib/utils";

const sources = [
    { id: 1, name: "IoT Sensor Grid Alpha", protocol: "MQTT/TLS", type: "IOT_SENSOR", quality: 98.2, status: "active", records: "2.4M", icon: Radio },
    { id: 2, name: "Sentinel-5P Satellite Feed", protocol: "STAC API", type: "SATELLITE", quality: 96.8, status: "active", records: "890K", icon: Satellite },
    { id: 3, name: "SCADA Industrial Network", protocol: "OPC-UA", type: "SCADA", quality: 94.5, status: "active", records: "1.1M", icon: Server },
    { id: 4, name: "SAP ERP Integration", protocol: "REST/OAuth2", type: "ERP", quality: 92.1, status: "active", records: "540K", icon: Database },
    { id: 5, name: "Weather Station Mesh", protocol: "CoAP/DTLS", type: "WEATHER", quality: 89.7, status: "degraded", records: "320K", icon: Globe },
    { id: 6, name: "Grid Energy Metering", protocol: "DLMS/COSEM", type: "SMART_METER", quality: 97.3, status: "active", records: "1.8M", icon: Activity },
];

export default function SourcesPage() {
    return (
        <div className="space-y-6 max-w-5xl mx-auto animate-fade-in p-2">
            <div className="flex flex-col gap-1 mb-2">
                <h1 className="text-2xl font-black tracking-tighter text-foreground uppercase italic px-1">Data Ingest Sources</h1>
                <p className="text-xs text-muted-foreground uppercase tracking-[0.2em] px-1 font-bold opacity-50">Layer 2 — Multi-source data pipeline endpoints</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="card-glass glass-hover border-white/[0.05]">
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-black text-emerald-400 tabular-nums drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">{sources.filter((s) => s.status === "active").length}</p>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Active Sources</p>
                    </CardContent>
                </Card>
                <Card className="card-glass glass-hover border-white/[0.05]">
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-black tabular-nums text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.1)]">7.05M</p>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Total Records</p>
                    </CardContent>
                </Card>
                <Card className="card-glass glass-hover border-white/[0.05]">
                    <CardContent className="p-6 text-center">
                        <p className="text-3xl font-black tabular-nums text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.3)]">94.8%</p>
                        <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mt-2">Avg Quality</p>
                    </CardContent>
                </Card>
            </div>

            {/* AI Memory Training Section */}
            <Card className="card-glass glass-hover border-white/10 shadow-2xl overflow-hidden relative group">
                {/* Visual Glow */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 blur-[100px] group-hover:bg-emerald-500/10 transition-colors duration-700" />

                <CardContent className="p-8 space-y-6 relative z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-black text-white flex items-center gap-3 tracking-tight">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <Database className="text-emerald-500" size={20} />
                                </div>
                                Train AI Agent Memory
                            </h3>
                            <p className="text-xs text-white/40 mt-2 max-w-xl font-medium">
                                Add context to the Cognee Knowledge Graph. Agents will reference this for all future queries using deep-link vector verification.
                            </p>
                        </div>
                        <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-xs font-black uppercase tracking-widest py-1 px-3">
                            Active Learning
                        </Badge>
                    </div>

                    <div className="space-y-4">
                        <div className="relative">
                            <textarea
                                className="w-full h-32 bg-black/40 border border-white/5 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all resize-none font-medium placeholder:text-white/10"
                                placeholder="Paste knowledge here (e.g., 'GreenPe verifies carbon credits using satellite data from ISRO...')"
                                id="memory-input"
                            />
                            <div className="absolute bottom-4 right-4 text-xs text-white/10 font-mono tracking-tighter">VECTORHUB_V1</div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={async () => {
                                    const input = document.getElementById('memory-input') as HTMLTextAreaElement;
                                    const btn = document.getElementById('train-btn');
                                    if (!input.value.trim() || !btn) return;

                                    const originalText = btn.innerText;
                                    btn.innerText = "Ingesting Data...";
                                    btn.setAttribute('disabled', 'true');

                                    try {
                                        await fetch('/api/agents/train', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ text: input.value })
                                        });
                                        input.value = "";
                                        btn.innerText = "✓ Knowledge Anchored";
                                        setTimeout(() => {
                                            btn.innerText = originalText;
                                            btn.removeAttribute('disabled');
                                        }, 2000);
                                    } catch (e) {
                                        console.error(e);
                                        btn.innerText = "Protocol Error";
                                    }
                                }}
                                id="train-btn"
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-900/40 transition-all active:scale-95 flex items-center gap-2 border-0"
                            >
                                <Satellite size={14} /> Ingest to Memory
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-3 pt-4">
                <div className="flex items-center justify-between px-1">
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">Active Pipeline Endpoints</h3>
                    <div className="h-px flex-1 mx-4 bg-white/5" />
                    <span className="text-xs font-mono text-white/20">L2_GATEWAY_V4.2</span>
                </div>

                {sources.map((source, i) => (
                    <Card
                        key={source.id}
                        className={cn(
                            "card-glass glass-hover transition-all duration-500 cursor-pointer group border-white/[0.03] hover:border-white/10",
                            source.status === "degraded" ? "bg-amber-500/[0.02]" : "bg-white/[0.01]",
                            `animate-in fade-in slide-in-from-bottom-2 duration-700`
                        )}
                        style={{ animationDelay: `${i * 100}ms` }}
                    >
                        <CardContent className="p-5 flex items-center gap-5">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-all duration-300 shadow-inner border border-white/[0.05]",
                                source.status === "active"
                                    ? "bg-emerald-500/5 text-emerald-400 group-hover:bg-emerald-500/20 group-hover:scale-110"
                                    : "bg-amber-500/5 text-amber-400"
                            )}>
                                <source.icon size={20} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">{source.name}</h3>
                                    <Badge variant="outline" className="bg-white/5 text-[8px] font-black uppercase tracking-widest text-white/40 border-white/5 py-0 px-2">{source.type}</Badge>
                                </div>
                                <div className="flex gap-4 mt-1.5 text-xs font-medium">
                                    <span className="text-emerald-500/50 font-mono tracking-tighter">{source.protocol}</span>
                                    <span className="text-white/10">•</span>
                                    <span className="text-white/30 lowercase">{source.records} verified records</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6 shrink-0">
                                <div className="text-right">
                                    <p className="text-base font-black tabular-nums text-white tracking-tighter">{source.quality}%</p>
                                    <p className="text-[8px] font-black uppercase tracking-widest text-white/20">Integrity</p>
                                </div>
                                <div className="h-8 w-px bg-white/5" />
                                <div className={cn(
                                    "flex items-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-black uppercase tracking-widest transition-colors",
                                    source.status === "active"
                                        ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-500"
                                        : "bg-amber-500/5 border-amber-500/10 text-amber-500"
                                )}>
                                    <div className={cn(
                                        "h-1.5 w-1.5 rounded-full animate-pulse shadow-[0_0_8px]",
                                        source.status === "active" ? "bg-emerald-500 shadow-emerald-500/50" : "bg-amber-500 shadow-amber-500/50"
                                    )} />
                                    {source.status === "active" ? "Protocol Live" : "Degraded"}
                                </div>
                                <ChevronRight size={14} className="text-white/10 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
