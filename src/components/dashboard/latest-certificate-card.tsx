"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, QrCode, MapPin, CheckCircle2, Globe, Sun, Zap, Eye, Shield, FileText, Database, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { generateGreenImpactCertificate } from "@/lib/generate-certificate";
import { CertificatePreviewDialog } from "./certificate-preview-dialog";
import { fetchSolarData, calculateCarbonOffset, SolarData } from "@/lib/solar-api";
import { cn } from "@/lib/utils";

export function LatestCertificateCard() {
    const [solarData, setSolarData] = useState<SolarData | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentTab, setCurrentTab] = useState<'certificate' | 'origin' | 'audit'>('certificate');

    // Khavda Renewable Energy Park Coordinates
    const LAT = 23.83;
    const LON = 69.75;
    const CAPACITY_MW = 50;
    const AREA_M2 = 250000;

    useEffect(() => {
        async function loadData() {
            try {
                const data = await fetchSolarData(LAT, LON);
                setSolarData(data);
            } catch (e) {
                console.error("Failed to fetch solar data", e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const carbonStats = solarData
        ? calculateCarbonOffset(solarData, CAPACITY_MW, AREA_M2)
        : { dailyGenerationkWh: 0, carbonOffsetTons: 0 };

    const initialData = {
        certificateId: "GP-8847-VX",
        projectName: "Adani Solar Park IV",
        projectType: "Solar Power",
        location: "Khavda, Gujarat, India",
        gstin: "24AAACA4311M1Z5",
        industrialId: "IND-SOL-004",
        carbonReduced: loading ? "207.14" : carbonStats.carbonOffsetTons.toFixed(2),
        vintage: "2024",
        issuedDate: new Date().toISOString().split('T')[0],
        verifier: "CarbonCore AI Auditor",
        recipientName: "Adani Green Energy",
        recipientAddress: "Ahmedabad, Gujarat"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
                delay: 0.3
            }}
        >
            <Card className="w-full card-glass card-interactive flex flex-col group min-h-[500px] overflow-hidden bg-opacity-40">
                {/* ── Tabs Header ── */}
                <div className="flex items-center px-4 bg-white/[0.02] border-b border-white/5 relative z-20">
                    <motion.button
                        onClick={() => setCurrentTab('certificate')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] transition-all border-b-2 relative",
                            currentTab === 'certificate' ? "border-emerald-500 text-white bg-white/5 shadow-inner" : "border-transparent text-white/20 hover:text-white/40"
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <FileText size={14} /> Certificate
                    </motion.button>
                    <motion.button
                        onClick={() => setCurrentTab('origin')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] transition-all border-b-2",
                            currentTab === 'origin' ? "border-emerald-500 text-white bg-white/5 shadow-inner" : "border-transparent text-white/20 hover:text-white/40"
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <Database size={14} /> Origin Data
                    </motion.button>
                    <motion.button
                        onClick={() => setCurrentTab('audit')}
                        className={cn(
                            "flex items-center gap-2 px-6 py-4 text-xs font-black uppercase tracking-[0.25em] transition-all border-b-2",
                            currentTab === 'audit' ? "border-emerald-500 text-white bg-white/5 shadow-inner" : "border-transparent text-white/20 hover:text-white/40"
                        )}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        <History size={14} /> Verification Log
                    </motion.button>
                </div>

            <CardContent className={cn(
                "p-8 md:p-12 flex-1 flex flex-col justify-between relative z-10 transition-colors duration-500",
                currentTab === 'certificate' ? "bg-white text-gray-900" : ""
            )}>
                {/* Visual Glow Backgrounds - Only show if not in certificate tab */}
                {currentTab !== 'certificate' && (
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-emerald-500/5 blur-[100px]" />
                        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-blue-500/5 blur-[100px]" />
                    </div>
                )}

                <div className="flex flex-col md:flex-row justify-between gap-12 relative z-10 h-full">

                    {/* Left Column: Tab Content */}
                    <div className="flex flex-col flex-1 gap-10 animate-in fade-in slide-in-from-left-4 duration-1000">
                        {currentTab === 'certificate' ? (
                            <div>
                                <div className="flex items-center gap-4 mb-10">
                                    <div className={cn(
                                        "p-2.5 rounded-xl border transition-all duration-300 shadow-inner group-hover:scale-110",
                                        currentTab === 'certificate' ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "glass-strong border-white/10 text-emerald-400"
                                    )}>
                                        <Shield size={24} strokeWidth={2.5} />
                                    </div>
                                    <div>
                                        <p className={cn("text-xs font-bold uppercase tracking-[0.3em] leading-none mb-2", currentTab === 'certificate' ? "text-emerald-600/60" : "text-emerald-400")}>Verified Infrastructure Protocol</p>
                                        <p className={cn("text-xs font-mono tracking-tighter uppercase", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>ID: {initialData.certificateId}</p>
                                    </div>
                                </div>

                                <h2 className={cn(
                                    "text-5xl md:text-6xl font-black tracking-tighter leading-[0.9] mb-10 group-hover:translate-x-1 transition-transform",
                                    currentTab === 'certificate' ? "text-gray-900" : "text-white"
                                )}>
                                    Digital Carbon<br />
                                    <span className={cn("italic font-serif", currentTab === 'certificate' ? "text-emerald-600" : "text-emerald-500")}>Provenance</span>
                                </h2>

                                <div className="space-y-8 max-w-lg">
                                    <div className="flex items-center gap-16">
                                        <div>
                                            <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2.5", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>Beneficiary</p>
                                            <p className={cn(
                                                "text-xl font-bold border-b pb-2 flex items-center gap-2 cursor-pointer transition-all",
                                                currentTab === 'certificate' ? "text-gray-900 border-gray-100 hover:border-emerald-500/30" : "text-white border-white/5 hover:border-emerald-500/30"
                                            )}>
                                                {initialData.recipientName}
                                                <span className={cn("text-sm", currentTab === 'certificate' ? "text-gray-300" : "text-white/10")}>▼</span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2.5", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>Asset Source</p>
                                            <p className={cn("text-xl font-bold uppercase tracking-tight transition-colors", currentTab === 'certificate' ? "text-gray-900" : "text-white group-hover:text-emerald-50")}>{initialData.projectName}</p>
                                            <p className={cn("text-xs font-bold uppercase tracking-widest mt-1", currentTab === 'certificate' ? "text-gray-400" : "text-white/30")}>{initialData.location}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-24 pt-6">
                                        <div>
                                            <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2.5", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>Vintage Year</p>
                                            <p className={cn("text-3xl font-black font-mono tracking-tighter", currentTab === 'certificate' ? "text-gray-900" : "text-white")}>{initialData.vintage}</p>
                                        </div>
                                        <div>
                                            <p className={cn("text-xs font-bold uppercase tracking-[0.2em] mb-2.5", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>Impact Volume</p>
                                            <div className="flex items-baseline gap-2">
                                                <span className={cn("text-4xl font-black font-mono tracking-tighter drop-shadow-[0_0_10px_rgba(52,211,153,0.3)]", currentTab === 'certificate' ? "text-emerald-600" : "text-emerald-400")}>{initialData.carbonReduced}</span>
                                                <span className={cn("text-xs font-black uppercase tracking-[0.2em]", currentTab === 'certificate' ? "text-gray-400" : "text-white/30")}>tCO2e</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : currentTab === 'origin' ? (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 border border-blue-500/20">
                                        <Database size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight">Infrastructure Origin Metadata</h3>
                                        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">L1_ASSET_DNA_VERIFICATION</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <div>
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-1.5">Asset Coordinates</p>
                                            <p className="text-sm font-bold text-white font-mono">{LAT}°N, {LON}°E</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-1.5">System Capacity</p>
                                            <p className="text-sm font-bold text-white">{CAPACITY_MW} MW Peak (Phase IV)</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-1.5">Surface Area</p>
                                            <p className="text-sm font-bold text-white">250,000 m² (Photovoltaic Grid)</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl">
                                            <p className="text-xs font-black text-white/20 uppercase tracking-widest mb-2">Technical Specs</p>
                                            <ul className="space-y-2 text-xs font-medium text-white/50">
                                                <li className="flex justify-between"><span>Module Type</span> <span className="text-white">Monocrystalline</span></li>
                                                <li className="flex justify-between"><span>Inverter Protocol</span> <span className="text-white">IEC-62443 Verified</span></li>
                                                <li className="flex justify-between"><span>Registry ID</span> <span className="text-white">IND-SOL-004-KA</span></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                                        <History size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white tracking-tight">Agent Verification Audit</h3>
                                        <p className="text-xs text-white/30 uppercase tracking-[0.2em] font-bold">MULTI_AGENT_CONSENSUS_LOG</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {[
                                        { time: "14:02:11", agent: "ORACLE_L1", action: "Solar Irradiance (GHI) Match", status: "VERIFIED" },
                                        { time: "14:01:45", agent: "LEDGER_NODE_4", action: "Block Header Hash Anchoring", status: "ANCHORED" },
                                        { time: "14:00:23", agent: "AUDITOR_M3", action: "Compliance SOC2 Checksum", status: "PASS" },
                                        { time: "13:58:12", agent: "CORE_MANAGER", action: "Certificate Seal Generation", status: "SIGNED" },
                                    ].map((log, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-white/[0.01] border border-white/5 rounded-xl group/log hover:bg-white/[0.03] transition-all">
                                            <span className="text-xs font-mono text-white/20">{log.time}</span>
                                            <Badge variant="outline" className="text-xs bg-white/5 border-white/5 text-white/40">{log.agent}</Badge>
                                            <span className="text-sm font-medium text-white/70 flex-1">{log.action}</span>
                                            <span className="text-xs font-black text-emerald-500">{log.status}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Footer: Live Verification - Updated for dark and white aesthetics */}
                        <div className="mt-auto pt-10 flex items-center gap-8">
                            <div className="flex items-center gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl border flex items-center justify-center font-black text-sm group-hover:rotate-12 transition-transform shadow-inner",
                                    currentTab === 'certificate' ? "bg-gray-100 border-gray-200 text-gray-900" : "glass-strong border-white/10 text-white"
                                )}>G</div>
                                <div>
                                    <p className={cn("text-sm font-bold tracking-tight leading-none mb-1.5 uppercase", currentTab === 'certificate' ? "text-gray-900" : "text-white")}>GreenPe Consensus</p>
                                    <p className={cn("text-xs font-bold uppercase tracking-widest", currentTab === 'certificate' ? "text-gray-400" : "text-white/30")}>Multi-Agent Sealed Signature</p>
                                </div>
                            </div>
                            <div className="ml-auto hidden md:flex items-center gap-6">
                                <div className={cn(
                                    "flex items-center gap-2 py-2 px-3 rounded-lg border transition-colors",
                                    currentTab === 'certificate' ? "bg-emerald-50 border-emerald-100" : "bg-emerald-500/5 border-emerald-500/10"
                                )}>
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    <span className={cn("text-xs font-black uppercase tracking-[0.2em]", currentTab === 'certificate' ? "text-emerald-600" : "text-emerald-400")}>Protocol: ACTIVE</span>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Right Column: Visuals & QR */}
                    <div className="flex flex-col gap-6 w-full md:w-[320px] shrink-0 animate-in fade-in slide-in-from-right-4 duration-1000">

                        {/* QR Card - Styled based on tab */}
                        <Card className={cn(
                            "p-8 flex flex-col items-center transition-all duration-300",
                            currentTab === 'certificate' ? "bg-gray-50 border-gray-100 shadow-sm" : "glass-strong border-white/5 bg-white/[0.02]"
                        )}>
                            <div className={cn(
                                "w-full aspect-square rounded-2xl p-6 flex items-center justify-center mb-6 shadow-inner group-hover:scale-105 transition-transform",
                                currentTab === 'certificate' ? "bg-white border border-gray-100" : "glass border border-white/10 bg-white"
                            )}>
                                <QrCode size={160} className="text-gray-900" />
                            </div>
                            <div className="text-center">
                                <p className={cn("text-sm font-black uppercase tracking-[0.2em] mb-2", currentTab === 'certificate' ? "text-gray-900" : "text-white")}>Immutable Verification</p>
                                <p className={cn("text-xs leading-relaxed font-medium", currentTab === 'certificate' ? "text-gray-500" : "text-white/30")}>Deterministic proof anchored to the UPI global climate ledger.</p>
                            </div>
                        </Card>

                        {/* Live Widget - Transitioning to darker or lighter */}
                        <div className={cn(
                            "rounded-2xl p-6 border transition-all duration-500 group/widget shadow-2xl relative overflow-hidden",
                            currentTab === 'certificate'
                                ? "bg-[#fafafa] border-gray-200 shadow-slate-200/50 hover:border-emerald-500/30 text-gray-900"
                                : "bg-[#050505] border-white/[0.08] hover:border-emerald-500/30 shadow-emerald-900/10 text-white"
                        )}>
                            {/* Inner Glow */}
                            <div className="absolute -top-10 -right-10 w-24 h-24 bg-emerald-500/20 blur-[40px] opacity-0 group-hover/widget:opacity-100 transition-opacity" />

                            <div className="flex justify-between items-center mb-6 relative z-10">
                                <Badge variant="outline" className={cn(
                                    "text-xs font-black tracking-[0.2em] px-3 py-0.5",
                                    currentTab === 'certificate' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-white/5 border-white/10 text-white/40"
                                )}>
                                    INFRASTRUCTURE LIVE
                                </Badge>
                                <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)] animate-dot-pulse" />
                            </div>

                            <div className="flex justify-between items-end mb-6 relative z-10">
                                <div>
                                    <p className={cn("text-3xl font-black font-mono tracking-tighter", currentTab === 'certificate' ? "text-gray-900" : "text-white")}>
                                        {loading ? "0.00" : solarData?.current.ghi ?? "0.00"} <span className="text-xs text-emerald-500 font-bold ml-1 uppercase">W/m²</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className={cn("text-xs font-black uppercase tracking-[0.2em]", currentTab === 'certificate' ? "text-gray-400" : "text-white/20")}>Real-time Irradiance</p>
                                        {currentTab !== 'certificate' && (
                                            <div className="flex items-center gap-1 px-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/10 animate-pulse">
                                                <Zap size={8} className="text-emerald-400" />
                                                <span className="text-[7px] font-black text-emerald-400 uppercase tracking-tighter">Impact + {((solarData?.current.ghi ?? 0) / 10).toFixed(1)}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1 items-end h-8">
                                    {[2, 4, 3, 6, 5, 8, 4, 7, 5, 9, 6, 10].map((h, i) => (
                                        <div key={i} style={{ height: `${h * 10}%` }} className={cn(
                                            "w-1.5 rounded-t-full transition-all duration-500",
                                            currentTab === 'certificate' ? "bg-emerald-500/20 hover:bg-emerald-500" : "bg-emerald-500/10 hover:bg-emerald-500/40"
                                        )} />
                                    ))}
                                </div>
                            </div>

                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm uppercase h-11 tracking-[0.2em] rounded-xl shadow-xl shadow-emerald-900/20 active:scale-95 transition-all relative z-10 border-0"
                                asChild
                            >
                                <CertificatePreviewDialog
                                    defaultData={initialData}
                                    trigger={
                                        <button className="flex items-center justify-center gap-2 w-full h-full cursor-pointer">
                                            Verify & Export <ArrowRight size={14} className="shrink-0" />
                                        </button>
                                    }
                                />
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 relative z-10">
                                <span className={cn("text-xs font-bold uppercase tracking-[0.3em]", currentTab === 'certificate' ? "text-gray-300" : "text-white/10")}>Last Synced {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC</span>
                            </div>
                        </div>
                    </div>

                </div>
            </CardContent>
        </Card>
        </motion.div>
    );
}

// Minimal Arrow Icon for Button
function ArrowRight({ size, className }: { size: number, className?: string }) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

