"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Loader2, Zap } from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { runPipeline, METHODOLOGIES } from "@/lib/carbon-upi/engine";
import { Entity, Asset } from "@/lib/carbon-upi/types";

const layers = [
    { id: 1, name: "Identity & Trust (CIH)", desc: "Validate Aadhaar/GSTIN binding, generate Composite Identity Hash, consent ledger entry", icon: "🪪" },
    { id: 2, name: "Data Ingestion & Validation", desc: "Multi-source pipeline: IoT sensors, satellite, ERP. Quality scoring, outlier detection, cross-reference", icon: "📡" },
    { id: 3, name: "MRV Computation Engine", desc: "IPCC/ISO/Verra methodology, emission factors, baseline modeling, Monte Carlo uncertainty", icon: "⚙️" },
    { id: 4, name: "Verification & Fraud Detection", desc: "Pattern analysis, duplicate CIH check, data anomaly detection, methodology adherence audit", icon: "🔒" },
    { id: 5, name: "Tokenization & Ledger", desc: "Mint Environmental Action Token (EAT), immutable ledger entry, hash chain verification", icon: "🪙" },
    { id: 6, name: "GIC Certificate Issuance", desc: "Generate Green Impact Certificate, digital signature, IPFS anchor, QR code", icon: "📜" },
    { id: 7, name: "Settlement & UPI Integration", desc: "UPI rails for instant value transfer, incentive disbursement, cross-border CBAM settlement", icon: "💳" },
];

export default function PipelineSimulator() {
    const { user } = useApp();
    const [running, setRunning] = useState(false);
    const [currentStep, setCurrentStep] = useState(-1);
    const [completedSteps, setCompletedSteps] = useState<number[]>([]);
    const [result, setResult] = useState<ReturnType<typeof runPipeline> | null>(null);

    const runSimulation = async () => {
        setRunning(true);
        setResult(null);
        setCompletedSteps([]);
        setCurrentStep(0);

        for (let i = 0; i < layers.length; i++) {
            setCurrentStep(i);
            await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));
            setCompletedSteps((prev) => [...prev, i]);
        }

        if (user.entity && user.asset) {
            // Retrieve actual telemetry sources from DB
            let livePoints: any[] = [];
            try {
                const entityId = user.entity?.id || "";
                const res = await fetch(`/api/sources/list?entityId=${entityId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        livePoints = data.map((src: any) => ({
                            id: src.id,
                            sourceType: "IOT_SENSOR" as const,
                            sourceId: src.sourceId,
                            timestamp: src.lastActive ? new Date(src.lastActive) : new Date(),
                            value: src.lastValue !== null ? Number(src.lastValue) : Math.random() * 100 + 50,
                            unit: src.unit || "kWh",
                            trustScore: "HIGH" as const,
                            raw: {}
                        }));
                    }
                }
            } catch (err) {
                console.error("Failed to query live telemetry for pipeline:", err);
            }

            if (livePoints.length === 0) {
                livePoints = Array.from({ length: 10 }, (_, i) => ({ 
                    id: `dp-${i}`, 
                    sourceType: "IOT_SENSOR" as const, 
                    sourceId: `sensor-${i}`, 
                    timestamp: new Date(), 
                    value: Math.random() * 100 + 50, 
                    unit: "kWh", 
                    trustScore: "HIGH" as const, 
                    raw: {} 
                }));
            }

            const pipelineResult = runPipeline({
                entity: user.entity as Entity,
                asset: user.asset as Asset,
                rawDataPoints: livePoints,
                methodology: METHODOLOGIES[0],
                timeWindow: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() },
            });
            setResult(pipelineResult);
        }

        setRunning(false);
    };

    return (
        <div className="space-y-5 max-w-4xl mx-auto animate-fade-in p-4 md:p-6">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Infrastructure Pipeline</h1>
                    <p className="text-sm text-foreground/25">7-Layer deterministic execution engine</p>
                </div>
                <Button onClick={runSimulation} disabled={running} className="btn-glow bg-green-500 text-black font-semibold hover:bg-green-400 gap-2 text-sm h-9 cursor-pointer shadow-lg shadow-green-500/20 shrink-0">
                    {running ? <><Loader2 size={14} className="animate-spin" /> Processing...</> : <><Play size={14} /> Run Full Pipeline</>}
                </Button>
            </div>

            {/* Progress bar */}
            {running && (
                <div className="glass rounded-xl p-3 border border-white/5">
                    <div className="flex justify-between text-xs text-foreground/20 mb-1.5">
                        <span>Pipeline Progress</span>
                        <span>{completedSteps.length}/{layers.length} Complete</span>
                    </div>
                    <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full transition-all duration-500 ease-out shadow-lg shadow-green-500/30" style={{ width: `${(completedSteps.length / layers.length) * 100}%` }} />
                    </div>
                </div>
            )}

            {/* Layers */}
            <div className="space-y-2">
                {layers.map((layer, i) => {
                    const isCompleted = completedSteps.includes(i);
                    const isCurrent = currentStep === i && running;
                    return (
                        <Card
                            key={layer.id}
                            className={`glass transition-all duration-500 overflow-hidden ${isCompleted ? "border-green-500/15 bg-green-500/[0.03]" :
                                    isCurrent ? "border-green-400/20 animate-border-glow shadow-lg shadow-green-500/5" :
                                        "hover:bg-foreground/[0.04] hover:border-foreground/8 border-foreground/[0.04]"
                                }`}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 transition-all duration-300 ${isCompleted ? "bg-green-500/15 scale-95" : isCurrent ? "bg-green-400/10 animate-pulse scale-105" : "bg-foreground/[0.03] border border-white/5"
                                    }`}>
                                    {isCompleted ? <CheckCircle2 size={20} className="text-green-400" /> : isCurrent ? <Loader2 size={18} className="text-green-400 animate-spin" /> : <span>{layer.icon}</span>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-foreground/15 tabular-nums">L{layer.id}</span>
                                        <h3 className="text-[13px] font-semibold text-white/80">{layer.name}</h3>
                                    </div>
                                    <p className="text-xs text-foreground/25 mt-0.5 truncate">{layer.desc}</p>
                                </div>
                                <div className="shrink-0">
                                    {isCompleted && <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px]">Complete</Badge>}
                                    {isCurrent && <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px] animate-pulse">Processing</Badge>}
                                    {!isCompleted && !isCurrent && <span className="text-xs text-foreground/10">Waiting</span>}
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Result */}
            {result && (
                <Card className="glass-green border border-green-500/15 shadow-[0_0_15px_rgba(34,197,94,0.05)] animate-scale-in overflow-hidden">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <Zap size={16} className="text-green-400 animate-pulse" />
                            <h3 className="text-sm font-bold text-white/90">Pipeline Complete — GIC Issued</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: "GIC ID", value: result.certificate?.id.slice(0, 16) },
                                { label: "Impact", value: `${result.certificate?.impactValue.amount.toFixed(2)} tCO₂e`, highlight: true },
                                { label: "Confidence", value: `${result.certificate?.confidenceScore.toFixed(1)}%` },
                                { label: "Audit Entries", value: result.auditTrail?.entries.length?.toString() },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs text-foreground/20 uppercase tracking-wider mb-0.5">{item.label}</p>
                                    <p className={`text-sm font-bold ${item.highlight ? "text-green-400" : "text-white/80"} font-mono`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
