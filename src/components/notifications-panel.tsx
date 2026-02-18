"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertTriangle, Info, X, Trash2 } from "lucide-react";
import { useAgents, type AgentActivity } from "@/providers/agent-provider";

const TYPE_CONFIG = {
    success: { icon: CheckCircle2, color: "text-green-400", dot: "bg-green-400" },
    error: { icon: AlertTriangle, color: "text-red-400", dot: "bg-red-400" },
    warning: { icon: AlertTriangle, color: "text-amber-400", dot: "bg-amber-400" },
    info: { icon: Info, color: "text-blue-400", dot: "bg-blue-400" },
};

export function NotificationsPanel() {
    const { activities } = useAgents();
    const [open, setOpen] = useState(false);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const panelRef = useRef<HTMLDivElement>(null);

    const unreadCount = activities.filter(a => !readIds.has(a.id)).length;

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);

    const markAllRead = () => {
        setReadIds(new Set(activities.map(a => a.id)));
    };

    const formatTime = (ts: number) => {
        const s = Math.floor((Date.now() - ts) / 1000);
        if (s < 60) return `${s}s`;
        if (s < 3600) return `${Math.floor(s / 60)}m`;
        return `${Math.floor(s / 3600)}h`;
    };

    return (
        <div className="relative" ref={panelRef}>
            <button
                onClick={() => setOpen(!open)}
                className="p-2 rounded-lg hover:bg-foreground/5 transition-all duration-200 relative group cursor-pointer"
            >
                <Bell size={16} className="text-foreground/25 group-hover:text-foreground/60 transition-colors" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-green-500 text-black text-[8px] font-bold flex items-center justify-center animate-scale-in">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-2 w-80 glass-strong rounded-xl shadow-2xl border border-foreground/[0.06] z-50 animate-scale-in overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-foreground/[0.04]">
                        <p className="text-[12px] font-semibold">Notifications</p>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllRead}
                                    className="text-[9px] text-green-400 hover:text-green-300 transition-colors cursor-pointer"
                                >
                                    Mark all read
                                </button>
                            )}
                            <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-foreground/5 cursor-pointer">
                                <X size={12} className="text-foreground/20" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto custom-scrollbar">
                        {activities.length > 0 ? activities.slice(0, 20).map(a => {
                            const config = TYPE_CONFIG[a.type] || TYPE_CONFIG.info;
                            const isUnread = !readIds.has(a.id);
                            return (
                                <div
                                    key={a.id}
                                    className={`px-4 py-3 border-b border-foreground/[0.03] last:border-0 transition-colors ${isUnread ? "bg-green-500/[0.02]" : ""} hover:bg-foreground/[0.03]`}
                                    onClick={() => setReadIds(prev => new Set([...prev, a.id]))}
                                >
                                    <div className="flex items-start gap-2.5">
                                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${config.dot} ${isUnread ? "animate-dot-pulse" : "opacity-40"}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-1.5 mb-0.5">
                                                <span className={`text-[10px] font-medium ${config.color}`}>{a.agentName}</span>
                                                <span className="text-[8px] text-foreground/15">• {formatTime(a.timestamp)}</span>
                                            </div>
                                            <p className="text-[10.5px] text-foreground/50 line-clamp-1">{a.action}</p>
                                            <p className="text-[9px] text-foreground/20 truncate">{a.detail}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="py-10 text-center">
                                <Bell size={20} className="mx-auto mb-2 text-foreground/10" />
                                <p className="text-[11px] text-foreground/20">No notifications yet</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {activities.length > 0 && (
                        <div className="px-4 py-2 border-t border-foreground/[0.04] text-center">
                            <a href="/dashboard/agents" className="text-[10px] text-green-400 hover:text-green-300 transition-colors">
                                View all activity →
                            </a>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
