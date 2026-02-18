"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard, FileCheck, Cpu, Settings as SettingsIcon,
    Globe, Shield, ChevronRight, LogOut, Menu, X, Search,
    Layers, Database, MapPin, User, Activity, Zap, Bot,
    Sun, Moon, Plus
} from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { useAgents } from "@/providers/agent-provider";
import { useTheme } from "@/providers/theme-provider";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { NotificationsPanel } from "@/components/notifications-panel";
import { CreateCertificateModal } from "@/components/create-certificate-modal";

// Wraps page content: full-height passthrough for agents, scrollable+padded for all others
function PageContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname === "/dashboard/agents") {
        // Agents page manages its own height and padding
        return <>{children}</>;
    }
    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
            {children}
        </div>
    );
}


const platformNav = [
    { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { path: "/dashboard/certificates", icon: FileCheck, label: "GIC Registry" },
    { path: "/dashboard/pipeline", icon: Cpu, label: "Infrastructure View" },
    { path: "/dashboard/sources", icon: Database, label: "Ingest Sources" },
    { path: "/dashboard/map", icon: MapPin, label: "Device Map" },
    { path: "/dashboard/agents", icon: Bot, label: "AI Agents" },
];

const complianceNav = [
    { path: "/dashboard/audit", icon: Shield, label: "Audit Defense" },
    { path: "/dashboard/compliance", icon: Globe, label: "Export Documentation" },
    { path: "/dashboard/settings", icon: SettingsIcon, label: "System Settings" },
];

const dpiLayers = [
    { id: 1, label: "Identity & Ingest" },
    { id: 2, label: "MRV Engine" },
    { id: 3, label: "Tokenization" },
    { id: 4, label: "Settlement" },
];

function NavLink({ path, icon: Icon, label }: { path: string; icon: React.ComponentType<{ size?: number; className?: string }>; label: string }) {
    const pathname = usePathname();
    const isActive = pathname === path;
    return (
        <Link
            href={path}
            className={`nav-link flex items-center gap-2.5 px-3 py-2 text-[12.5px] transition-all duration-200 group ${isActive
                ? "nav-link-active text-green-400 font-medium"
                : "text-foreground/40 hover:text-foreground/80"
                }`}
        >
            <Icon size={16} className={`transition-all duration-200 ${isActive ? "text-green-400" : "text-foreground/25 group-hover:text-green-400/60"}`} />
            <span className="flex-1">{label}</span>
            {isActive && <ChevronRight size={12} className="text-green-400/50" />}
        </Link>
    );
}

function SidebarContent({ onClose }: { onClose?: () => void }) {
    const { user, logout } = useApp();
    const { agents } = useAgents();
    const { theme } = useTheme();
    const pathname = usePathname();
    const router = useRouter();

    const getLayerStatus = (id: number) => {
        const statuses = ["ACTIVE", "ACTIVE", "PROCESSING", "IDLE"];
        const agentIdx = (id + agents.length) % statuses.length;
        return statuses[agentIdx];
    };

    return (
        <div className="flex flex-col h-full glass-sidebar">
            {/* Logo */}
            <div className="px-4 py-5 flex items-center gap-3 border-b border-foreground/[0.04]">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20 animate-glow-ring">
                    <Zap size={18} className="text-black" />
                </div>
                <div>
                    <p className="text-[13px] font-bold tracking-tight">GreenPe</p>
                    <p className="text-[9px] tracking-[0.15em] text-green-400/50 uppercase font-medium">Infrastructure</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
                {/* Platform */}
                <div>
                    <p className="text-[9px] tracking-[0.2em] text-foreground/20 uppercase px-3 mb-2 font-semibold">Platform</p>
                    <div className="space-y-0.5">
                        {platformNav.map((item, i) => (
                            <div key={item.path} className={`animate-slide-in-left stagger-${i + 1}`} style={{ opacity: 0 }}>
                                <NavLink {...item} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* DPI Layers */}
                <div>
                    <p className="text-[9px] tracking-[0.2em] text-foreground/20 uppercase px-3 mb-2 font-semibold">DPI Layers</p>
                    <div className="space-y-1 px-1">
                        {dpiLayers.map((layer) => {
                            const status = getLayerStatus(layer.id);
                            return (
                                <div
                                    key={layer.id}
                                    className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-foreground/[0.03] transition-all duration-200 cursor-default group"
                                >
                                    <div className={`w-[7px] h-[7px] rounded-full shrink-0 transition-all duration-300 ${status === "ACTIVE"
                                        ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)] animate-dot-pulse"
                                        : status === "PROCESSING"
                                            ? "bg-blue-400 animate-pulse shadow-[0_0_8px_rgba(96,165,250,0.4)]"
                                            : "bg-foreground/10"
                                        }`} />
                                    <span className="text-[11.5px] text-foreground/40 flex-1 group-hover:text-foreground/60 transition-colors">{layer.label}</span>
                                    <span className={`text-[8px] capitalize transition-colors ${status === "ACTIVE" ? "text-green-400/60" : status === "PROCESSING" ? "text-blue-400/60" : "text-foreground/15"
                                        }`}>{status.toLowerCase()}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Compliance */}
                <div>
                    <p className="text-[9px] tracking-[0.2em] text-foreground/20 uppercase px-3 mb-2 font-semibold">Compliance</p>
                    <div className="space-y-0.5">
                        {complianceNav.map((item) => (
                            <NavLink key={item.path} {...item} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="border-t border-foreground/[0.04] px-4 py-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-[11px] font-bold text-green-400 border border-green-500/10">
                        {user.entity?.name?.[0] || "J"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-foreground/80 truncate">{user.entity?.name || "John Doe"}</p>
                        <p className="text-[9px] text-foreground/20">Carbon Auditor L3</p>
                    </div>
                    <button onClick={() => { logout(); router.push("/"); }} className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/15 hover:text-red-400 transition-all duration-200 cursor-pointer">
                        <LogOut size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

function MobileBottomNav() {
    const pathname = usePathname();
    const tabs = [
        { path: "/dashboard", icon: LayoutDashboard, label: "Dash" },
        { path: "/dashboard/certificates", icon: FileCheck, label: "GICs" },
        { path: "/dashboard/pipeline", icon: Cpu, label: "Infra" },
        { path: "/dashboard/map", icon: Globe, label: "Map" },
        { path: "/dashboard/settings", icon: User, label: "Profile" },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong safe-area-pb border-t border-foreground/[0.04]">
            <div className="flex items-center justify-around py-1.5">
                {tabs.map((tab, i) => {
                    const isCenter = i === 2;
                    const isActive = pathname === tab.path;
                    return (
                        <Link
                            key={tab.path}
                            href={tab.path}
                            className={`flex flex-col items-center gap-0.5 py-1.5 px-3 transition-all duration-200 ${isCenter ? "" : isActive ? "text-green-400" : "text-foreground/25"
                                }`}
                        >
                            {isCenter ? (
                                <div className="w-12 h-12 -mt-6 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-lg">
                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                                        ? "bg-green-500 shadow-[0_0_16px_rgba(34,197,94,0.4)]"
                                        : "bg-foreground/5 hover:bg-green-500/20"
                                        }`}>
                                        <tab.icon size={18} className={isActive ? "text-black" : "text-foreground/40"} />
                                    </div>
                                </div>
                            ) : (
                                <tab.icon size={20} className="transition-all duration-200" />
                            )}
                            <span className="text-[8px] font-medium">{tab.label}</span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user } = useApp();
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [certModalOpen, setCertModalOpen] = useState(false);
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false, timeZone: "UTC" }));
        updateTime();
        const i = setInterval(updateTime, 1000);
        return () => clearInterval(i);
    }, []);

    useEffect(() => {
        if (!user.isOnboarded) router.push("/onboarding");
    }, [user.isOnboarded, router]);

    return (
        <div className={`flex h-screen overflow-hidden bg-grid-isometric ${theme === 'dark' ? 'bg-[#080d16]' : 'bg-gradient-to-br from-[#eef2f3] via-[#f0fdf4] to-[#ecfdf5]'}`}>
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex flex-col w-[220px] shrink-0">
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header */}
                <header className="h-14 shrink-0 flex items-center gap-3 px-4 md:px-6 border-b border-foreground/[0.04] glass">
                    {/* Mobile Menu */}
                    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                        <SheetTrigger className="md:hidden p-1.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
                            <Menu size={20} className="text-foreground/40" />
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-[260px] border-0 bg-transparent">
                            <SidebarContent onClose={() => setMobileOpen(false)} />
                        </SheetContent>
                    </Sheet>

                    {/* Live Badge */}
                    <div className="hidden md:flex items-center gap-2 glass-green rounded-full px-3 py-1">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-dot-pulse" />
                        <span className="text-[10px] text-green-400 font-medium">Live Infrastructure</span>
                    </div>
                    <span className="hidden md:block text-[10px] text-foreground/15 font-mono">Last Updated: {time} UTC</span>

                    <div className="flex-1" />

                    {/* + New Certificate */}
                    <button
                        onClick={() => setCertModalOpen(true)}
                        className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500 text-black text-[11px] font-semibold hover:bg-green-400 transition-all duration-200 btn-glow cursor-pointer shadow-sm"
                    >
                        <Plus size={14} /> New Certificate
                    </button>

                    {/* Search */}
                    <div className="hidden md:flex items-center gap-2 glass rounded-lg px-3 py-1.5 w-48 hover:bg-foreground/[0.06] transition-all duration-200 group">
                        <Search size={13} className="text-foreground/20 group-hover:text-green-400/50 transition-colors" />
                        <input placeholder="Search Asset ID..." className="bg-transparent border-0 text-[11px] focus:outline-none w-full placeholder:text-foreground/15 text-foreground/60" />
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 group cursor-pointer"
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        {theme === 'dark' ? (
                            <Sun size={16} className="text-foreground/25 group-hover:text-amber-400 transition-colors" />
                        ) : (
                            <Moon size={16} className="text-foreground/25 group-hover:text-indigo-400 transition-colors" />
                        )}
                    </button>

                    {/* Notifications */}
                    <NotificationsPanel />

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center text-[11px] font-bold text-green-400 border border-green-500/10">
                        {user.entity?.name?.[0] || "J"}
                    </div>
                </header>

                {/* Create Certificate Modal */}
                <CreateCertificateModal open={certModalOpen} onClose={() => setCertModalOpen(false)} />

                {/* Page Content */}
                <main className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <PageContent>{children}</PageContent>
                </main>
            </div>

            {/* Mobile Bottom Nav */}
            <MobileBottomNav />
        </div>
    );
}
