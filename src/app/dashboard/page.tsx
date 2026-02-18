"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Eye, CheckCircle2, Shield, Plus } from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { KPIStats } from "@/components/dashboard/kpi-stats";
import { LatestCertificateCard } from "@/components/dashboard/latest-certificate-card";
import { AuditLogsCard } from "@/components/dashboard/audit-logs-card";
import { NetImpactCard } from "@/components/dashboard/net-impact-card";
import { CreateCertificateModal } from "@/components/create-certificate-modal";

function useLiveStats() {
    const [stats, setStats] = useState({
        certificates: 24932,
        impact: 892109,
        registry: 150,
        identities: 8226,
    });
    useEffect(() => {
        const i = setInterval(() => {
            setStats((s) => ({
                certificates: s.certificates + Math.floor(Math.random() * 2),
                impact: s.impact + Math.floor(Math.random() * 50),
                registry: s.registry + (Math.random() > 0.9 ? 1 : 0),
                identities: s.identities + (Math.random() > 0.95 ? 1 : 0),
            }));
        }, 5000);
        return () => clearInterval(i);
    }, []);
    return stats;
}

export default function DashboardOverview() {
    const { user } = useApp();
    const stats = useLiveStats();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    return (
        <div className="space-y-6 max-w-[1600px] mx-auto p-4 md:p-8 animate-in fade-in duration-700">
            {/* ── Dashboard Header ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                            Infrastructure Console
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-2 py-0 h-5 text-[10px] font-bold">LIVE</Badge>
                        </h1>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Platform Status</span>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[11px] font-bold text-emerald-600/80">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Asset ID: GP-8821-VX</span>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all text-xs uppercase tracking-tight"
                    >
                        <Plus size={16} /> New Certificate
                    </Button>
                </div>
            </div>

            {/* ── BENTO GRID START ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-bottom-4 duration-1000">
                <KPIStats stats={stats} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                {/* LARGE: Latest Certificate Card (8 cols) */}
                <div className="lg:col-span-12 xl:col-span-12">
                    <LatestCertificateCard />
                </div>

                {/* BOTTOM: Audit Logs (8 cols) & Net Impact (4 cols) */}
                <div className="lg:col-span-8 h-[400px]">
                    <AuditLogsCard />
                </div>

                <div className="lg:col-span-4 h-[400px]">
                    <NetImpactCard />
                </div>

            </div>

            {/* ── Dashboard Footer ── */}
            <div className="flex items-center justify-between pt-8 border-t border-slate-100">
                <div className="flex items-center gap-2">
                    <Shield size={14} className="text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Standard: ISO 14064-3 / SOC 2 Ready</span>
                </div>
                <div className="flex items-center gap-4 text-slate-400">
                    <span className="text-[10px] font-mono">NODE_ID: 19284-A</span>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-500/60 font-bold">Authenticated</span>
                </div>
            </div>

            <CreateCertificateModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}

