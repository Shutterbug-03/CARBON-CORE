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
        certificates: 24847,
        impact: 891273,
        registry: 147,
        identities: 8219,
    });
    useEffect(() => {
        const i = setInterval(() => {
            setStats((s) => ({
                certificates: s.certificates + Math.floor(Math.random() * 3),
                impact: s.impact + Math.floor(Math.random() * 73),
                registry: s.registry + (Math.random() > 0.92 ? 1 : 0),
                identities: s.identities + (Math.random() > 0.94 ? 1 : 0),
            }));
        }, 4800);
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
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white flex items-center gap-3">
                            Infrastructure Console
                            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 px-3 py-1 text-xs font-black tracking-wider">LIVE</Badge>
                        </h1>
                        <div className="flex items-center gap-3 mt-2">
                            <span className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-widest">Platform Status</span>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                </span>
                                <span className="text-sm font-black text-emerald-600">Operational</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
                        <span className="text-xs font-mono text-gray-600 dark:text-gray-400 uppercase tracking-[0.15em]">Asset ID: GP-8847-VX</span>
                    </div>
                    <Button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black h-11 px-6 shadow-lg shadow-emerald-600/30 active:scale-[0.97] transition-all text-sm tracking-wide"
                    >
                        <Plus size={18} /> New Certificate
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
            <div className="flex items-center justify-between pt-8 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-500 dark:text-gray-400" />
                    <span className="text-xs font-black text-gray-600 dark:text-gray-400 uppercase tracking-[0.15em]">Standard: ISO 14064-3 / SOC 2 Ready</span>
                </div>
                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
                    <span className="text-xs font-mono">NODE_ID: 18347-A</span>
                    <span className="text-xs font-mono uppercase tracking-[0.15em] text-emerald-600 dark:text-emerald-500 font-black">Authenticated</span>
                </div>
            </div>

            <CreateCertificateModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
}

