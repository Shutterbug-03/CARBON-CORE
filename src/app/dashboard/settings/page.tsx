"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    User, Shield, Server, Globe, Lock, Fingerprint,
    ToggleLeft, Sun, Moon, Bell, BellOff, AlertTriangle,
    FileCheck, Download, Key, EyeOff
} from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { useTheme } from "@/providers/theme-provider";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
    const { user } = useApp();
    const { theme, setTheme } = useTheme();

    const [notifications, setNotifications] = useState({
        agentAlerts: true,
        certificateEvents: true,
        systemWarnings: true,
        pipelineUpdates: false,
    });

    const toggleNotif = (key: keyof typeof notifications) =>
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));

    const sections = [
        {
            title: "Appearance",
            icon: Sun,
            children: (
                <div className="space-y-4">
                    <p className="text-[10px] text-foreground/25">Choose your preferred theme for the dashboard</p>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { value: "dark" as const, label: "Dark", icon: Moon, desc: "Glass morphism UI" },
                            { value: "light" as const, label: "Light", icon: Sun, desc: "Clean & bright" },
                        ].map(t => (
                            <button
                                key={t.value}
                                onClick={() => setTheme(t.value)}
                                className={`p-4 rounded-xl text-left transition-all duration-300 cursor-pointer ${theme === t.value
                                        ? "bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5"
                                        : "glass hover:bg-foreground/[0.04]"
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${theme === t.value ? "bg-green-500/15" : "bg-foreground/5"
                                    }`}>
                                    <t.icon size={18} className={theme === t.value ? "text-green-400" : "text-foreground/25"} />
                                </div>
                                <p className={`text-[12px] font-semibold mb-0.5 ${theme === t.value ? "text-green-400" : "text-foreground/60"}`}>{t.label}</p>
                                <p className="text-[9px] text-foreground/20">{t.desc}</p>
                                {theme === t.value && (
                                    <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px] mt-2">Active</Badge>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Identity Card",
            icon: User,
            children: (
                <div className="space-y-3">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 flex items-center justify-center text-xl font-bold text-green-400 border border-green-500/10 animate-glow-ring">
                            {user.entity?.name?.[0] || "J"}
                        </div>
                        <div>
                            <p className="text-[14px] font-bold">{user.entity?.name || "John Doe"}</p>
                            <p className="text-[10px] text-foreground/25">Carbon Auditor L3 • Verified Entity</p>
                            <Badge className="bg-green-400/10 text-green-400 border-green-400/15 text-[8px] mt-1 gap-0.5"><Fingerprint size={8} /> CIH Bound</Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {[
                            { label: "Entity ID", value: user.entity?.id?.slice(0, 12) || "ENT-0001" },
                            { label: "Registration", value: user.entity?.registrationId || "GSTIN-XXXX" },
                            { label: "Region", value: user.entity?.location?.region || "South Asia" },
                            { label: "Identity Hash", value: user.identityHash?.slice(0, 16) || "0x3f2a..." },
                        ].map((f) => (
                            <div key={f.label}>
                                <p className="text-[9px] text-foreground/20 uppercase tracking-wider">{f.label}</p>
                                <p className="text-[11px] font-mono text-foreground/50">{f.value}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            title: "Notifications",
            icon: Bell,
            children: (
                <div className="space-y-2">
                    {[
                        { key: "agentAlerts" as const, label: "Agent Alerts", desc: "Status changes, errors, and load warnings", icon: AlertTriangle },
                        { key: "certificateEvents" as const, label: "Certificate Events", desc: "New issuances, verifications, registry updates", icon: FileCheck },
                        { key: "systemWarnings" as const, label: "System Warnings", desc: "Pipeline failures, anomaly detection alerts", icon: AlertTriangle },
                        { key: "pipelineUpdates" as const, label: "Pipeline Updates", desc: "MRV calculations, tokenization events", icon: Bell },
                    ].map((s) => (
                        <button
                            key={s.key}
                            onClick={() => toggleNotif(s.key)}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/[0.03] transition-all group cursor-pointer"
                        >
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${notifications[s.key] ? "bg-green-500/8 text-green-400" : "bg-foreground/[0.03] text-foreground/15"}`}>
                                {notifications[s.key] ? <s.icon size={14} /> : <BellOff size={14} />}
                            </div>
                            <div className="flex-1 text-left">
                                <p className={`text-[12px] font-medium transition-colors ${notifications[s.key] ? "text-foreground/70" : "text-foreground/30"}`}>{s.label}</p>
                                <p className="text-[9px] text-foreground/20">{s.desc}</p>
                            </div>
                            <div className={`w-9 h-5 rounded-full transition-all duration-300 relative ${notifications[s.key] ? "bg-green-500" : "bg-foreground/10"}`}>
                                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-300 ${notifications[s.key] ? "left-4.5" : "left-0.5"}`} />
                            </div>
                        </button>
                    ))}
                </div>
            ),
        },
        {
            title: "Security & Privacy",
            icon: Shield,
            children: (
                <div className="space-y-2">
                    {[
                        { label: "Two-Factor Auth", desc: "TOTP-based authentication", enabled: true },
                        { label: "Biometric Lock", desc: "Fingerprint / FaceID", enabled: true },
                        { label: "Session Timeout", desc: "Auto-lock after 15 min inactivity", enabled: false },
                        { label: "Audit Logging", desc: "Track all account activity", enabled: true },
                    ].map((s) => (
                        <div key={s.label} className="flex items-center gap-3 p-3 rounded-xl hover:bg-foreground/[0.03] transition-all group cursor-default">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.enabled ? "bg-green-500/8 text-green-400" : "bg-foreground/[0.03] text-foreground/15"}`}>
                                {s.enabled ? <Lock size={14} /> : <ToggleLeft size={14} />}
                            </div>
                            <div className="flex-1">
                                <p className="text-[12px] font-medium text-foreground/70 group-hover:text-foreground/90 transition-colors">{s.label}</p>
                                <p className="text-[9px] text-foreground/20">{s.desc}</p>
                            </div>
                            <Badge className={`text-[8px] ${s.enabled ? "bg-green-400/10 text-green-400 border-green-400/15" : "bg-foreground/5 text-foreground/20 border-foreground/5"}`}>
                                {s.enabled ? "Active" : "Off"}
                            </Badge>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "API & Integration",
            icon: Key,
            children: (
                <div className="space-y-3">
                    {[
                        { label: "OpenAI API Key", status: "Set", masked: "sk-•••••••••" },
                        { label: "Google API Key", status: "Set", masked: "AIza•••••••" },
                        { label: "Webhook URL", status: "Not Set", masked: "—" },
                    ].map(k => (
                        <div key={k.label} className="flex items-center justify-between p-3 glass rounded-lg hover:bg-foreground/[0.04] transition-all">
                            <div className="flex items-center gap-2.5">
                                <EyeOff size={12} className="text-foreground/15" />
                                <div>
                                    <p className="text-[11px] font-medium text-foreground/60">{k.label}</p>
                                    <p className="text-[9px] font-mono text-foreground/20">{k.masked}</p>
                                </div>
                            </div>
                            <Badge className={`text-[8px] ${k.status === "Set" ? "bg-green-400/10 text-green-400 border-green-400/15" : "bg-amber-400/10 text-amber-400 border-amber-400/15"}`}>
                                {k.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Infrastructure",
            icon: Server,
            children: (
                <div className="space-y-2">
                    {[
                        { label: "Pipeline Version", value: "v2.1.0-prod" },
                        { label: "MRV Engine", value: "IPCC AR6 + Verra VCS" },
                        { label: "Ledger Protocol", value: "SHA-256 Hash Chain" },
                        { label: "API Gateway", value: "gRPC + REST Hybrid" },
                        { label: "Uptime SLA", value: "99.97%", highlight: true },
                    ].map((s) => (
                        <div key={s.label} className="flex justify-between items-center py-2 px-3 rounded-lg hover:bg-foreground/[0.03] transition-all cursor-default">
                            <span className="text-[11px] text-foreground/30">{s.label}</span>
                            <span className={`text-[11px] font-mono ${s.highlight ? "text-green-400 font-bold" : "text-foreground/60"}`}>{s.value}</span>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: "Data Export",
            icon: Download,
            children: (
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { label: "Certificates CSV", desc: "Export all issued GICs", icon: FileCheck },
                        { label: "Audit Log", desc: "Download activity log", icon: Shield },
                        { label: "Agent Telemetry", desc: "Export agent metrics", icon: Download },
                        { label: "Compliance Report", desc: "CBAM/BRSR bundle", icon: Globe },
                    ].map(d => (
                        <button
                            key={d.label}
                            className="p-3 glass rounded-lg hover:bg-foreground/[0.04] hover:border-green-400/10 transition-all cursor-pointer group text-left"
                        >
                            <d.icon size={14} className="text-green-400/40 group-hover:text-green-400 transition-colors mb-2" />
                            <p className="text-[11px] font-medium text-foreground/60 group-hover:text-foreground/80 transition-colors">{d.label}</p>
                            <p className="text-[9px] text-foreground/20">{d.desc}</p>
                        </button>
                    ))}
                </div>
            ),
        },
        {
            title: "Compliance Standards",
            icon: Globe,
            children: (
                <div className="grid grid-cols-2 gap-2">
                    {["SOC 2 Type II", "ISO 27001", "GDPR Ready", "CBAM Aligned", "BRSR Compatible", "CCTS Framework"].map((c) => (
                        <div key={c} className="flex items-center gap-2 p-2.5 glass rounded-lg hover:bg-foreground/[0.04] hover:border-green-400/10 transition-all cursor-default group">
                            <Shield size={11} className="text-green-400/40 group-hover:text-green-400 transition-colors" />
                            <span className="text-[10px] text-foreground/40 group-hover:text-foreground/70 transition-colors">{c}</span>
                        </div>
                    ))}
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
            <div>
                <h1 className="text-xl font-bold tracking-tight">System Settings</h1>
                <p className="text-[11px] text-foreground/25">Identity, security, appearance, infrastructure configuration</p>
            </div>

            {sections.map((section, i) => (
                <Card key={section.title} className={`glass-hover animate-slide-up stagger-${Math.min(i + 1, 6)} overflow-hidden`} style={{ opacity: 0 }}>
                    <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                            <section.icon size={16} className="text-green-400/50" />
                            <h2 className="text-[13px] font-bold">{section.title}</h2>
                        </div>
                        {section.children}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
