"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
    Bot, Activity, Cpu, Zap, ArrowUpRight, Clock,
    MessageSquare, Database, Shield, Send, ChevronRight,
    Brain, Network, BarChart3, Layers, Globe, FileCheck,
    Coins, Settings, Eye, Play, AlertTriangle, Sparkles, X,
    LayoutGrid, MessageCircle
} from "lucide-react";
import { useAgents, type Agent, type AgentActivity } from "@/providers/agent-provider";
import { AgentChat } from "@/components/agent-chat";

const AGENT_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    "identity-agent": Shield,
    "ingestion-agent": Database,
    "mrv-agent": BarChart3,
    "verification-agent": Eye,
    "tokenization-agent": Coins,
    "gic-agent": FileCheck,
    "compliance-agent": Globe,
    "registry-agent": Layers,
    "settlement-agent": Send,
    "defi-bridge-agent": Network,
    "gateway-agent": Settings,
    "analytics-agent": Activity,
    "orchestrator": Brain,
};

const STATUS_STYLES: Record<string, { dot: string; badge: string; text: string; glow: string }> = {
    IDLE: {
        dot: "bg-white/10",
        badge: "bg-white/5 text-white/30 border-white/5",
        text: "text-white/30",
        glow: "bg-white/5"
    },
    ACTIVE: {
        dot: "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)] animate-dot-pulse",
        badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
        text: "text-emerald-400",
        glow: "bg-emerald-500"
    },
    PROCESSING: {
        dot: "bg-blue-400 animate-pulse shadow-[0_0_10px_rgba(96,165,250,0.5)]",
        badge: "bg-blue-400/10 text-blue-400 border-blue-400/20",
        text: "text-blue-400",
        glow: "bg-blue-500"
    },
    ERROR: {
        dot: "bg-rose-400 shadow-[0_0_12px_rgba(251,113,133,0.5)]",
        badge: "bg-rose-400/10 text-rose-400 border-rose-400/20",
        text: "text-rose-400",
        glow: "bg-rose-500"
    },
    WAITING: {
        dot: "bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]",
        badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
        text: "text-amber-400",
        glow: "bg-amber-500"
    },
};

function AgentCard({ agent, onSelect }: { agent: Agent; onSelect: (a: Agent) => void }) {
    const Icon = AGENT_ICONS[agent.id] || Bot;
    const style = STATUS_STYLES[agent.status] || STATUS_STYLES.IDLE;

    return (
        <div
            onClick={() => onSelect(agent)}
            className="card-glass p-5 rounded-2xl cursor-pointer group animate-slide-up hover:z-20 relative overflow-hidden"
        >
            {/* Card Background Glow */}
            <div className={cn(
                "absolute -top-12 -right-12 w-28 h-28 blur-[50px] opacity-10 pointer-events-none transition-all duration-700 group-hover:opacity-30",
                style.glow
            )} />

            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl glass-strong border border-white/10 flex items-center justify-center group-hover:border-emerald-400/30 group-hover:bg-emerald-400/5 transition-all duration-500 shadow-inner">
                        <Icon size={20} className="text-white/40 group-hover:text-emerald-400 transition-colors duration-500" />
                    </div>
                    <div>
                        <p className="text-[13px] font-black text-white/80 group-hover:text-white transition-colors tracking-tight">{agent.name}</p>
                        <p className="text-xs text-white/20 uppercase tracking-[0.2em] font-bold">{agent.id}</p>
                    </div>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
            </div>

            <p className="text-sm text-white/30 mb-4 line-clamp-1 italic tracking-tight font-medium relative z-10">{agent.currentAction}</p>

            <div className="grid grid-cols-3 gap-3 mb-4 relative z-10">
                <div className="text-center px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[14px] font-black text-white/90">{agent.tasksCompleted}</p>
                    <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Tasks</p>
                </div>
                <div className="text-center px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[14px] font-black text-white/90">{agent.avgResponseMs}ms</p>
                    <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">Avg</p>
                </div>
                <div className="text-center px-2 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                    <p className="text-[14px] font-black text-white/90">{agent.a2aMessagesSent}</p>
                    <p className="text-[8px] text-white/20 uppercase font-black tracking-widest">A2A</p>
                </div>
            </div>

            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden relative z-10 border border-white/5">
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-in-out"
                    style={{
                        width: `${agent.load}%`,
                        background: agent.load > 80
                            ? "linear-gradient(90deg, #f43f5e, #e11d48)"
                            : agent.load > 40
                                ? "linear-gradient(90deg, #f59e0b, #d97706)"
                                : "linear-gradient(90deg, #10b981, #059669)",
                        boxShadow: agent.load > 0 ? "0 0 12px rgba(16, 185, 129, 0.4)" : "none",
                    }}
                />
            </div>
        </div>
    );
}

function ActivityItem({ activity }: { activity: AgentActivity }) {
    const typeColors: Record<string, string> = {
        info: "text-blue-400",
        success: "text-green-400",
        warning: "text-amber-400",
        error: "text-red-400",
    };

    const elapsed = Math.floor((Date.now() - activity.timestamp) / 1000);
    const timeText = elapsed < 60 ? `${elapsed}s ago` : elapsed < 3600 ? `${Math.floor(elapsed / 60)}m ago` : `${Math.floor(elapsed / 3600)}h ago`;

    return (
        <div className="flex items-start gap-2.5 py-2 border-b border-foreground/[0.03] last:border-0 animate-fade-in">
            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${activity.type === "success" ? "bg-green-400" :
                activity.type === "error" ? "bg-red-400" :
                    activity.type === "warning" ? "bg-amber-400" : "bg-blue-400"
                }`} />
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-xs font-medium ${typeColors[activity.type] || "text-foreground/40"}`}>
                        {activity.agentName}
                    </span>
                    <span className="text-[8px] text-foreground/15">•</span>
                    <span className="text-[8px] text-foreground/15 font-mono">{timeText}</span>
                </div>
                <p className="text-[10.5px] text-foreground/50">{activity.action}</p>
                <p className="text-xs text-foreground/20 truncate">{activity.detail}</p>
            </div>
        </div>
    );
}

function AgentDetailPanel({ agent, onClose, onDispatch }: {
    agent: Agent;
    onClose: () => void;
    onDispatch: (agentId: string, taskType: string) => void;
}) {
    const Icon = AGENT_ICONS[agent.id] || Bot;
    const style = STATUS_STYLES[agent.status] || STATUS_STYLES.IDLE;

    const QUICK_TASKS: Record<string, { label: string; taskType: string }[]> = {
        "identity-agent": [
            { label: "Validate Entity", taskType: "VALIDATE_ENTITY" },
            { label: "Bind CIH", taskType: "BIND_IDENTITY" },
        ],
        "ingestion-agent": [
            { label: "Ingest Data", taskType: "INGEST_DATA" },
            { label: "Assess Quality", taskType: "ASSESS_QUALITY" },
        ],
        "mrv-agent": [
            { label: "Calculate MRV", taskType: "CALCULATE_MRV" },
            { label: "Select Methodology", taskType: "SELECT_METHODOLOGY" },
        ],
        "verification-agent": [
            { label: "Verify MRV", taskType: "VERIFY_MRV" },
            { label: "Check Duplicate", taskType: "CHECK_DUPLICATE" },
        ],
        "gic-agent": [
            { label: "Issue Certificate", taskType: "ISSUE_CERTIFICATE" },
        ],
        "compliance-agent": [
            { label: "Assess Compliance", taskType: "ASSESS_COMPLIANCE" },
            { label: "Generate Report", taskType: "GENERATE_REPORT" },
        ],
        "analytics-agent": [
            { label: "Compute KPIs", taskType: "COMPUTE_KPIS" },
            { label: "Generate Insights", taskType: "GENERATE_INSIGHTS" },
        ],
        "orchestrator": [
            { label: "System Status", taskType: "SYSTEM_STATUS" },
            { label: "Run Pipeline", taskType: "RUN_PIPELINE" },
        ],
        "gateway-agent": [
            { label: "Health Check", taskType: "HEALTH_CHECK" },
        ],
    };

    const tasks = QUICK_TASKS[agent.id] || [];

    return (
        <div className="card-glass rounded-xl p-5 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/10 flex items-center justify-center">
                        <Icon size={22} className="text-green-400" />
                    </div>
                    <div>
                        <h3 className="text-[14px] font-bold text-white">{agent.name}</h3>
                        <p className="text-xs text-foreground/30">{agent.id}</p>
                    </div>
                </div>
                <button onClick={onClose} className="text-foreground/20 hover:text-foreground/60 text-[18px] cursor-pointer transition-colors">×</button>
            </div>

            <div className="flex items-center gap-2 mb-4">
                <Badge className={`text-xs border ${style.badge}`}>{agent.status}</Badge>
                <span className="text-xs text-foreground/30">{agent.currentAction}</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                    { label: "Tasks Done", value: agent.tasksCompleted, icon: Zap },
                    { label: "Avg Response", value: `${agent.avgResponseMs}ms`, icon: Clock },
                    { label: "Memory Reads", value: agent.memoryReads, icon: Database },
                    { label: "Memory Writes", value: agent.memoryWrites, icon: Database },
                    { label: "A2A Sent", value: agent.a2aMessagesSent, icon: Send },
                    { label: "A2A Received", value: agent.a2aMessagesReceived, icon: MessageSquare },
                ].map((stat) => (
                    <div key={stat.label} className="glass rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <stat.icon size={10} className="text-foreground/15" />
                            <span className="text-[8px] text-foreground/20 uppercase tracking-wider">{stat.label}</span>
                        </div>
                        <p className="text-[14px] font-bold text-foreground/80">{stat.value}</p>
                    </div>
                ))}
            </div>

            {tasks.length > 0 && (
                <div>
                    <p className="text-xs text-foreground/20 uppercase tracking-wider mb-2 font-semibold">Quick Actions</p>
                    <div className="space-y-1.5">
                        {tasks.map((t) => (
                            <button
                                key={t.taskType}
                                onClick={() => onDispatch(agent.id, t.taskType)}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg glass hover:bg-foreground/[0.06] transition-all duration-200 group cursor-pointer"
                            >
                                <Play size={12} className="text-green-400/50 group-hover:text-green-400 transition-colors" />
                                <span className="text-sm text-foreground/50 group-hover:text-foreground/80 transition-colors">{t.label}</span>
                                <ChevronRight size={12} className="ml-auto text-foreground/10 group-hover:text-foreground/30 transition-colors" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {agent.lastError && (
                <div className="mt-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                    <div className="flex items-center gap-1.5 mb-1">
                        <AlertTriangle size={11} className="text-red-400" />
                        <span className="text-xs text-red-400 font-medium uppercase">Last Error</span>
                    </div>
                    <p className="text-xs text-red-400/60 line-clamp-2">{agent.lastError}</p>
                </div>
            )}
        </div>
    );
}

const AGENT_OPTIONS = [
    { id: "orchestrator", label: "🧠 Orchestrator" },
    { id: "mrv-agent", label: "📊 MRV Agent" },
    { id: "verification-agent", label: "🔍 Verification" },
    { id: "gic-agent", label: "📜 GIC Agent" },
    { id: "compliance-agent", label: "⚖️ Compliance" },
    { id: "analytics-agent", label: "📈 Analytics" },
    { id: "identity-agent", label: "🛡️ Identity" },
    { id: "settlement-agent", label: "💸 Settlement" },
];

export default function AgentsDashboard() {
    const { agents, system, activities, dispatchTask, loading } = useAgents();
    const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
    const [dispatching, setDispatching] = useState(false);
    const [chatAgentId, setChatAgentId] = useState("orchestrator");
    // "chat" is the default tab (main landing)
    const [activeTab, setActiveTab] = useState<"chat" | "fleet">("chat");

    const handleDispatch = async (agentId: string, taskType: string) => {
        setDispatching(true);
        try {
            await dispatchTask(agentId, taskType, { demo: true, timestamp: Date.now() });
        } finally {
            setDispatching(false);
        }
    };

    const chatAgent = agents.find(a => a.id === chatAgentId);

    return (
        <div className="flex flex-col bg-[#020202] text-white selection:bg-emerald-500/30 -m-4 md:-m-6 p-4 md:p-6 relative overflow-hidden h-full" style={{ height: "calc(100% + 48px)" }}>
            {/* ── Background Elements ── */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[35%] h-[35%] bg-blue-900/10 blur-[130px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-emerald-900/10 blur-[100px] rounded-full" />
                <div className="absolute inset-0 bg-grid-isometric opacity-[0.02]" />
            </div>

            <main className="relative z-10 flex flex-col h-full animate-in fade-in duration-1000">

                {/* ── Compact Header ── */}
                <div className="flex items-center justify-between px-1 pb-3 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Brain size={18} className="text-green-400" />
                        <div>
                            <h1 className="text-[16px] font-bold text-white leading-none">AI Agent Control Center</h1>
                            <p className="text-xs text-foreground/25 mt-0.5">13 Agents · Greeni AI · A2A Protocol</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Tab switcher */}
                        <div className="flex items-center gap-1 p-1 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                            <button
                                onClick={() => setActiveTab("chat")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === "chat"
                                    ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                    : "text-foreground/30 hover:text-foreground/60"
                                    }`}
                            >
                                <MessageCircle size={12} />
                                Chat
                            </button>
                            <button
                                onClick={() => setActiveTab("fleet")}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === "fleet"
                                    ? "bg-foreground/[0.06] text-foreground/80 border border-foreground/[0.08]"
                                    : "text-foreground/30 hover:text-foreground/60"
                                    }`}
                            >
                                <LayoutGrid size={12} />
                                Fleet
                            </button>
                        </div>

                        <Button
                            onClick={() => handleDispatch("orchestrator", "SYSTEM_STATUS")}
                            disabled={dispatching}
                            className="glass-green hover:bg-green-500/20 text-green-400 text-sm px-3 py-1.5 rounded-lg border border-green-500/20 transition-all duration-200 cursor-pointer"
                        >
                            <Activity size={13} className="mr-1.5" />
                            Status
                        </Button>
                    </div>
                </div>

                {/* ── CHAT TAB — Full screen ── */}
                {activeTab === "chat" && (
                    <div className="flex-1 flex flex-col min-h-0 card-glass rounded-xl border border-green-500/[0.08] overflow-hidden">
                        {/* Chat header bar */}
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-foreground/[0.04] flex-shrink-0">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <Sparkles size={13} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white">AI Agent Chat</p>
                                    <p className="text-[8.5px] text-foreground/20">Powered by Greeni Agent Framework</p>
                                </div>
                            </div>

                            {/* Agent selector — pill style */}
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                {AGENT_OPTIONS.map(opt => (
                                    <button
                                        key={opt.id}
                                        onClick={() => setChatAgentId(opt.id)}
                                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer border ${chatAgentId === opt.id
                                            ? "bg-green-500/15 text-green-400 border-green-500/25"
                                            : "text-foreground/30 border-foreground/[0.05] hover:text-foreground/60 hover:border-foreground/[0.1]"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Chat body — fills remaining height, scrolls internally */}
                        <div className="flex-1 min-h-0">
                            <AgentChat
                                key={chatAgentId}
                                agentId={chatAgentId}
                                agentName={chatAgent?.name || "AI Agent"}
                                className="h-full"
                            />
                        </div>
                    </div>
                )}

                {/* ── FLEET TAB — Agent cards + activity ── */}
                {activeTab === "fleet" && (
                    <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0 space-y-5 pr-1">
                        {/* System Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {[
                                { label: "Total Agents", value: system.totalAgents, icon: Bot, color: "text-green-400" },
                                { label: "Active Now", value: system.activeAgents, icon: Activity, color: "text-blue-400" },
                                { label: "System Load", value: `${system.systemLoad}%`, icon: Cpu, color: system.systemLoad > 70 ? "text-red-400" : "text-green-400" },
                                { label: "Tasks Done", value: system.totalTasksCompleted, icon: Zap, color: "text-amber-400" },
                                { label: "A2A Messages", value: system.totalA2AMessages, icon: MessageSquare, color: "text-purple-400" },
                            ].map((stat) => (
                                <Card key={stat.label} className="card-stat card-glass border-0 animate-slide-up">
                                    <CardContent className="p-3.5">
                                        <div className="flex items-center justify-between mb-2">
                                            <stat.icon size={16} className={stat.color} />
                                            <ArrowUpRight size={12} className="text-foreground/10" />
                                        </div>
                                        <p className="text-[20px] font-bold text-foreground/90">{stat.value}</p>
                                        <p className="text-xs text-foreground/25 uppercase tracking-wider">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Main grid: Agent cards + activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                            {/* Agent Grid (left 2 cols) */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-foreground/30 uppercase tracking-wider font-semibold">
                                        Agent Fleet ({agents.length})
                                    </p>
                                    <div className="flex items-center gap-3 text-xs">
                                        {["ACTIVE", "PROCESSING", "IDLE", "ERROR"].map(s => {
                                            const count = agents.filter(a => a.status === s).length;
                                            const st = STATUS_STYLES[s];
                                            return count > 0 ? (
                                                <span key={s} className={`flex items-center gap-1 ${st.text}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                                                    {count} {s.toLowerCase()}
                                                </span>
                                            ) : null;
                                        })}
                                    </div>
                                </div>

                                {selectedAgent && (
                                    <AgentDetailPanel
                                        agent={selectedAgent}
                                        onClose={() => setSelectedAgent(null)}
                                        onDispatch={handleDispatch}
                                    />
                                )}

                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {agents.map((agent) => (
                                        <AgentCard
                                            key={agent.id}
                                            agent={agent}
                                            onSelect={setSelectedAgent}
                                        />
                                    ))}
                                    {agents.length === 0 && !loading && (
                                        <div className="col-span-full flex flex-col items-center justify-center py-16 text-foreground/20">
                                            <Bot size={40} className="mb-3 text-foreground/10" />
                                            <p className="text-sm">No agents loaded yet</p>
                                            <p className="text-xs text-foreground/10 mt-1">Agents initialize on first API call</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Activity Feed (right col) */}
                            <div className="space-y-4">
                                <p className="text-sm text-foreground/30 uppercase tracking-wider font-semibold">
                                    Live Activity Feed
                                </p>
                                <div className="card-glass rounded-xl p-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                                    {activities.length > 0 ? (
                                        activities.map((a) => (
                                            <ActivityItem key={a.id} activity={a} />
                                        ))
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-12 text-foreground/15">
                                            <MessageSquare size={24} className="mb-2" />
                                            <p className="text-sm">No activity yet</p>
                                            <p className="text-xs text-foreground/10 mt-1">Dispatch a task to see agent activity</p>
                                        </div>
                                    )}
                                </div>

                                <div className="card-glass rounded-xl p-4">
                                    <p className="text-xs text-foreground/25 uppercase tracking-wider font-semibold mb-3">Architecture</p>
                                    <div className="space-y-2">
                                        {[
                                            { label: "AI Engine", value: "Greeni AI ✓", color: "bg-green-400" },
                                            { label: "Framework", value: "Greeni Agent Framework", color: "bg-blue-400" },
                                            { label: "Protocol", value: "A2A (Agent-to-Agent)", color: "bg-purple-400" },
                                            { label: "Memory", value: "Shared Core Memory (6 ch)", color: "bg-amber-400" },
                                            { label: "Orchestration", value: "Google ADK Pattern", color: "bg-cyan-400" },
                                        ].map((item) => (
                                            <div key={item.label} className="flex items-center gap-2">
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                                                <span className="text-xs text-foreground/20 w-20">{item.label}</span>
                                                <span className="text-xs text-foreground/50">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
