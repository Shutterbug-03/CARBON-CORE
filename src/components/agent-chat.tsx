"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import {
    Send, Bot, User, Sparkles, Loader2, Copy, Check,
    Brain, BarChart3, Eye, FileCheck, Globe, Activity,
    Shield, DollarSign, Zap, Paperclip, X, FileText,
    FileSpreadsheet, File, Upload, CheckCircle2, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadedDoc {
    fileName: string;
    fileType: string;
    content: string;
    charCount: number;
    fileSize: number;
    summary: string;
}

const FILE_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
    pdf: FileText,
    csv: FileSpreadsheet,
    xlsx: FileSpreadsheet,
    xls: FileSpreadsheet,
    docx: FileText,
    txt: File,
    json: File,
    md: FileText,
};

const FILE_TYPE_COLORS: Record<string, string> = {
    pdf: "text-red-400 bg-red-500/10 border-red-500/20",
    csv: "text-green-400 bg-green-500/10 border-green-500/20",
    xlsx: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    xls: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    docx: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    txt: "text-foreground/50 bg-foreground/5 border-foreground/10",
    json: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    md: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: number;
    agentId?: string;
    isStreaming?: boolean;
}

interface AgentChatProps {
    agentId?: string;
    agentName?: string;
    className?: string;
}

// Agent personas — each agent has a unique identity
const AGENT_PERSONAS: Record<string, {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
    bgColor: string;
    borderColor: string;
    greeting: string;
    tagline: string;
    emoji: string;
}> = {
    "orchestrator": {
        icon: Brain,
        color: "text-violet-400",
        bgColor: "bg-violet-500/10",
        borderColor: "border-violet-500/20",
        greeting: "Hey! I'm the **Orchestrator** — the brain behind CarbonCore's 13-agent system. I coordinate everything from identity verification to carbon credit settlement. What can I help you with today?",
        tagline: "Super Manager · 13-Agent Coordination",
        emoji: "🧠",
    },
    "mrv-agent": {
        icon: BarChart3,
        color: "text-blue-400",
        bgColor: "bg-blue-500/10",
        borderColor: "border-blue-500/20",
        greeting: "Hello! I'm the **MRV Agent** — your expert in Measurement, Reporting & Verification. I calculate carbon credits using Verra VCS and CDM methodologies with India-specific grid emission factors. Ask me anything about carbon math!",
        tagline: "MRV · Verra VCS · CDM Methodology",
        emoji: "📊",
    },
    "verification-agent": {
        icon: Eye,
        color: "text-cyan-400",
        bgColor: "bg-cyan-500/10",
        borderColor: "border-cyan-500/20",
        greeting: "Hi there! I'm the **Verification Agent** — I cross-reference NASA satellite data, IoT sensors, and historical baselines to detect fraud and validate carbon claims. Nothing gets past me. What would you like verified?",
        tagline: "Fraud Detection · NASA Satellite · Anomaly Scoring",
        emoji: "🔍",
    },
    "gic-agent": {
        icon: FileCheck,
        color: "text-green-400",
        bgColor: "bg-green-500/10",
        borderColor: "border-green-500/20",
        greeting: "Welcome! I'm the **GIC Issuance Agent** — I generate, cryptographically sign, and register Green Impact Certificates. Each GIC I issue is tamper-proof with QR verification and IPFS anchoring. How can I help you today?",
        tagline: "Certificate Issuance · Digital Signature · IPFS",
        emoji: "📜",
    },
    "compliance-agent": {
        icon: Globe,
        color: "text-amber-400",
        bgColor: "bg-amber-500/10",
        borderColor: "border-amber-500/20",
        greeting: "Greetings! I'm the **Compliance Agent** — I ensure your carbon operations align with CBAM, BRSR, CCTS, and CSRD frameworks. I keep you audit-ready and regulation-compliant. What compliance question can I answer?",
        tagline: "CBAM · BRSR · CCTS · CSRD Compliance",
        emoji: "⚖️",
    },
    "analytics-agent": {
        icon: Activity,
        color: "text-pink-400",
        bgColor: "bg-pink-500/10",
        borderColor: "border-pink-500/20",
        greeting: "Hi! I'm the **Analytics Agent** — I turn carbon data into actionable insights. KPIs, trends, market analysis — I've got it all. What metrics would you like to explore?",
        tagline: "KPIs · Trends · Market Intelligence",
        emoji: "📈",
    },
    "identity-agent": {
        icon: Shield,
        color: "text-indigo-400",
        bgColor: "bg-indigo-500/10",
        borderColor: "border-indigo-500/20",
        greeting: "Hello! I'm the **Identity Agent** — I handle CIH (Carbon Identity Hash) binding, Aadhaar KYC, and GSTIN verification. Privacy-first, always. How can I assist with identity today?",
        tagline: "CIH Binding · Aadhaar KYC · GSTIN",
        emoji: "🛡️",
    },
    "settlement-agent": {
        icon: DollarSign,
        color: "text-emerald-400",
        bgColor: "bg-emerald-500/10",
        borderColor: "border-emerald-500/20",
        greeting: "Hey! I'm the **Settlement Agent** — I handle UPI payments, carbon credit transfers, and incentive distribution. Fast, secure, and precise. What settlement query do you have?",
        tagline: "UPI Payments · Credit Transfer · Incentives",
        emoji: "💸",
    },
};

const DEFAULT_PERSONA = AGENT_PERSONAS["orchestrator"];

const AGENT_SUGGESTIONS: Record<string, string[]> = {
    "orchestrator": [
        "How does the 13-agent pipeline work?",
        "What's the full certificate issuance flow?",
        "Explain CarbonCore's architecture",
    ],
    "mrv-agent": [
        "Calculate carbon credits for 1000 kWh solar in Gujarat",
        "What's the West India grid emission factor?",
        "Compare Verra VCS vs CDM methodology",
    ],
    "verification-agent": [
        "How do you detect fraudulent solar claims?",
        "Explain NASA satellite verification process",
        "What's a good confidence score for verification?",
    ],
    "gic-agent": [
        "Walk me through the GIC certificate lifecycle",
        "How are certificates cryptographically signed?",
        "What data is encoded in the QR code?",
    ],
    "compliance-agent": [
        "What is CBAM and who does it affect?",
        "How do I prepare a BRSR report?",
        "Explain India's CCTS carbon trading framework",
    ],
    "analytics-agent": [
        "What KPIs matter most for carbon credits?",
        "What's the average credit value per MWh in India?",
        "Show me key trends in renewable verification",
    ],
    "identity-agent": [
        "What is a Carbon Identity Hash (CIH)?",
        "How does Aadhaar KYC work for carbon assets?",
        "Explain GSTIN verification for businesses",
    ],
    "settlement-agent": [
        "How does UPI carbon credit settlement work?",
        "What are typical settlement timelines?",
        "Explain cross-border carbon credit transfers",
    ],
};

// Parse markdown-like content into rich JSX
function parseContent(text: string): React.ReactNode[] {
    const lines = text.split("\n");
    const nodes: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
        const line = lines[i];

        // Skip empty lines but add spacing
        if (line.trim() === "") {
            nodes.push(<div key={`space-${i}`} className="h-2" />);
            i++;
            continue;
        }

        // H3 heading: ### text
        if (line.startsWith("### ")) {
            nodes.push(
                <p key={i} className="text-[12px] font-bold text-foreground/90 mt-3 mb-1.5 flex items-center gap-1.5">
                    <span className="w-1 h-3.5 rounded-full bg-green-400/60 inline-block" />
                    {parseInline(line.slice(4))}
                </p>
            );
            i++;
            continue;
        }

        // H2 heading: ## text
        if (line.startsWith("## ")) {
            nodes.push(
                <p key={i} className="text-[13px] font-bold text-white mt-3 mb-2">
                    {parseInline(line.slice(3))}
                </p>
            );
            i++;
            continue;
        }

        // Numbered list: 1. text
        if (/^\d+\.\s/.test(line)) {
            const items: string[] = [];
            while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
                items.push(lines[i].replace(/^\d+\.\s/, ""));
                i++;
            }
            nodes.push(
                <ol key={`ol-${i}`} className="space-y-2 my-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex gap-3 items-start">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/15 border border-green-500/20 text-[9px] font-bold text-green-400 flex items-center justify-center mt-0.5">
                                {idx + 1}
                            </span>
                            <span className="text-[12px] text-foreground/70 leading-relaxed flex-1">
                                {parseInline(item)}
                            </span>
                        </li>
                    ))}
                </ol>
            );
            continue;
        }

        // Bullet list: - text or • text
        if (line.startsWith("- ") || line.startsWith("• ") || line.startsWith("* ")) {
            const items: string[] = [];
            while (i < lines.length && (lines[i].startsWith("- ") || lines[i].startsWith("• ") || lines[i].startsWith("* "))) {
                items.push(lines[i].slice(2));
                i++;
            }
            nodes.push(
                <ul key={`ul-${i}`} className="space-y-1.5 my-2">
                    {items.map((item, idx) => (
                        <li key={idx} className="flex gap-2.5 items-start">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-green-400/50 mt-1.5" />
                            <span className="text-[12px] text-foreground/70 leading-relaxed flex-1">
                                {parseInline(item)}
                            </span>
                        </li>
                    ))}
                </ul>
            );
            continue;
        }

        // LaTeX block: \[ ... \] — convert to styled math display
        if (line.trim().startsWith("\\[") || line.trim() === "\\[") {
            const mathLines: string[] = [];
            i++;
            while (i < lines.length && !lines[i].trim().startsWith("\\]")) {
                mathLines.push(lines[i].trim());
                i++;
            }
            i++; // skip \]
            const mathText = mathLines.join(" ")
                .replace(/\\text\{([^}]+)\}/g, "$1")
                .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1 / $2")
                .replace(/\\,/g, " ")
                .replace(/\\/g, "")
                .trim();
            nodes.push(
                <div key={`math-${i}`} className="my-3 px-4 py-3 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06] font-mono text-[12px] text-green-300/80 text-center">
                    {mathText}
                </div>
            );
            continue;
        }

        // Inline LaTeX: \( ... \) — skip or simplify
        if (line.includes("\\(") || line.includes("\\)")) {
            const cleaned = line
                .replace(/\\\(/g, "")
                .replace(/\\\)/g, "")
                .replace(/\\text\{([^}]+)\}/g, "$1")
                .replace(/\\,/g, " ")
                .trim();
            if (cleaned) {
                nodes.push(
                    <p key={i} className="text-[12px] text-foreground/65 leading-relaxed my-1">
                        {parseInline(cleaned)}
                    </p>
                );
            }
            i++;
            continue;
        }

        // Horizontal rule
        if (line.trim() === "---" || line.trim() === "***") {
            nodes.push(<div key={i} className="border-t border-foreground/[0.05] my-3" />);
            i++;
            continue;
        }

        // Regular paragraph
        nodes.push(
            <p key={i} className="text-[12px] text-foreground/70 leading-relaxed my-0.5">
                {parseInline(line)}
            </p>
        );
        i++;
    }

    return nodes;
}

// Parse inline markdown: **bold**, `code`, *italic*
function parseInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    // Remove LaTeX inline
    remaining = remaining
        .replace(/\\\(.*?\\\)/g, "")
        .replace(/\$[^$]+\$/g, "")
        .replace(/\\text\{([^}]+)\}/g, "$1")
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "$1/$2")
        .replace(/\\,/g, " ");

    while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/^(.*?)\*\*(.+?)\*\*(.*)/);
        if (boldMatch) {
            if (boldMatch[1]) parts.push(<span key={key++}>{boldMatch[1]}</span>);
            parts.push(<strong key={key++} className="font-semibold text-foreground/90">{boldMatch[2]}</strong>);
            remaining = boldMatch[3];
            continue;
        }

        // Code: `text`
        const codeMatch = remaining.match(/^(.*?)`(.+?)`(.*)/);
        if (codeMatch) {
            if (codeMatch[1]) parts.push(<span key={key++}>{codeMatch[1]}</span>);
            parts.push(
                <code key={key++} className="px-1.5 py-0.5 rounded bg-foreground/[0.06] border border-foreground/[0.08] text-green-300/80 text-[11px] font-mono">
                    {codeMatch[2]}
                </code>
            );
            remaining = codeMatch[3];
            continue;
        }

        // Italic: *text*
        const italicMatch = remaining.match(/^(.*?)\*(.+?)\*(.*)/);
        if (italicMatch) {
            if (italicMatch[1]) parts.push(<span key={key++}>{italicMatch[1]}</span>);
            parts.push(<em key={key++} className="italic text-foreground/60">{italicMatch[2]}</em>);
            remaining = italicMatch[3];
            continue;
        }

        parts.push(<span key={key++}>{remaining}</span>);
        break;
    }

    return parts.length === 1 ? parts[0] : <>{parts}</>;
}

// Stat card for structured data in AI responses
function StatCard({ label, value, unit }: { label: string; value: string; unit?: string }) {
    return (
        <div className="flex flex-col items-center px-4 py-3 rounded-xl bg-green-500/[0.06] border border-green-500/[0.12]">
            <span className="text-[18px] font-bold text-green-400">{value}</span>
            {unit && <span className="text-[9px] text-green-400/50 font-mono">{unit}</span>}
            <span className="text-[9px] text-foreground/30 uppercase tracking-wider mt-0.5">{label}</span>
        </div>
    );
}

function TypingIndicator({ agentId }: { agentId: string }) {
    const persona = AGENT_PERSONAS[agentId] || DEFAULT_PERSONA;
    const Icon = persona.icon;
    return (
        <div className="flex gap-3 items-start animate-fade-in">
            <div className={`w-8 h-8 rounded-xl ${persona.bgColor} border ${persona.borderColor} flex items-center justify-center flex-shrink-0`}>
                <Icon size={15} className={persona.color} />
            </div>
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm ${persona.bgColor} border ${persona.borderColor} flex items-center gap-1.5`}>
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "180ms" }} />
                <div className="w-1.5 h-1.5 rounded-full bg-foreground/30 animate-bounce" style={{ animationDelay: "360ms" }} />
            </div>
        </div>
    );
}

function MessageBubble({ message, agentId }: { message: Message; agentId: string }) {
    const [copied, setCopied] = useState(false);
    const isUser = message.role === "user";
    const persona = AGENT_PERSONAS[agentId] || DEFAULT_PERSONA;
    const Icon = persona.icon;

    const handleCopy = () => {
        navigator.clipboard.writeText(message.content);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const time = new Date(message.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    if (isUser) {
        return (
            <div className="flex gap-3 justify-end animate-fade-in">
                <div className="flex flex-col items-end gap-1 max-w-[75%]">
                    <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm bg-foreground/[0.07] border border-foreground/[0.08] text-[12px] text-foreground/80 leading-relaxed">
                        {message.content}
                    </div>
                    <span className="text-[9px] text-foreground/15 px-1">{time}</span>
                </div>
                <div className="w-8 h-8 rounded-xl bg-foreground/[0.05] border border-foreground/[0.08] flex items-center justify-center flex-shrink-0">
                    <User size={14} className="text-foreground/30" />
                </div>
            </div>
        );
    }

    // Assistant message
    return (
        <div className="flex gap-3 items-start animate-fade-in group">
            {/* Agent avatar */}
            <div className={`w-8 h-8 rounded-xl ${persona.bgColor} border ${persona.borderColor} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                <Icon size={15} className={persona.color} />
            </div>

            <div className="flex flex-col gap-1 flex-1 min-w-0">
                {/* Agent name label */}
                <span className={`text-[9px] font-semibold uppercase tracking-wider ${persona.color} opacity-70`}>
                    {persona.emoji} {agentId.replace("-agent", "").replace("-", " ")} agent
                </span>

                {/* Message bubble */}
                <div className={`px-4 py-3.5 rounded-2xl rounded-tl-sm ${persona.bgColor} border ${persona.borderColor} max-w-[90%]`}>
                    {message.isStreaming && message.content === "" ? (
                        <div className="flex items-center gap-2 text-[11px] text-foreground/30">
                            <Loader2 size={12} className="animate-spin" />
                            Thinking...
                        </div>
                    ) : (
                        <div className="space-y-0.5">
                            {parseContent(message.content)}
                        </div>
                    )}
                </div>

                {/* Footer: time + copy */}
                <div className="flex items-center gap-3 px-1">
                    <span className="text-[9px] text-foreground/15">{time}</span>
                    {!message.isStreaming && message.content && (
                        <button
                            onClick={handleCopy}
                            className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[9px] text-foreground/20 hover:text-foreground/50 cursor-pointer"
                        >
                            {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export function AgentChat({ agentId = "orchestrator", agentName = "Orchestrator", className = "" }: AgentChatProps) {
    const persona = AGENT_PERSONAS[agentId] || DEFAULT_PERSONA;
    const Icon = persona.icon;

    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: persona.greeting,
            timestamp: Date.now(),
            agentId,
        }
    ]);
    const [input, setInput] = useState("");
    const [streaming, setStreaming] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(true);
    const [uploadedDocs, setUploadedDocs] = useState<UploadedDoc[]>([]);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    const suggestions = AGENT_SUGGESTIONS[agentId] || AGENT_SUGGESTIONS["orchestrator"];

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Handle file upload
    const handleFileUpload = useCallback(async (files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploading(true);
        setUploadError(null);

        for (const file of Array.from(files)) {
            try {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/agents/ingest", {
                    method: "POST",
                    body: formData,
                });

                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Upload failed");

                setUploadedDocs(prev => [...prev, {
                    fileName: data.fileName,
                    fileType: data.fileType,
                    content: data.textContent,
                    charCount: data.charCount,
                    fileSize: data.fileSize,
                    summary: data.summary,
                }]);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Upload failed";
                setUploadError(msg);
                setTimeout(() => setUploadError(null), 4000);
            }
        }

        setUploading(false);
        // Reset file input
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const removeDoc = useCallback((index: number) => {
        setUploadedDocs(prev => prev.filter((_, i) => i !== index));
    }, []);

    const sendMessage = useCallback(async (text: string) => {
        if (!text.trim() || streaming) return;

        // Build user message with doc indicator
        const docIndicator = uploadedDocs.length > 0
            ? `\n📎 ${uploadedDocs.map(d => d.fileName).join(", ")}`
            : "";

        const userMsg: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text.trim() + docIndicator,
            timestamp: Date.now(),
        };

        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setStreaming(true);
        setShowSuggestions(false);

        const assistantId = `assistant-${Date.now()}`;
        setMessages(prev => [...prev, {
            id: assistantId,
            role: "assistant",
            content: "",
            timestamp: Date.now(),
            agentId,
            isStreaming: true,
        }]);

        try {
            abortRef.current = new AbortController();
            const documentContext = uploadedDocs.map(d => ({
                fileName: d.fileName,
                content: d.content,
            }));

            const res = await fetch("/api/agents/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: text.trim(),
                    agentId,
                    history: messages.slice(-8).map(m => ({ role: m.role, content: m.content })),
                    documentContext,
                }),
                signal: abortRef.current.signal,
            });

            if (!res.ok || !res.body) throw new Error("Failed to connect to AI agent");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let accumulated = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const data = line.slice(6);
                        if (data === "[DONE]") break;
                        try {
                            const parsed = JSON.parse(data);
                            if (parsed.text) {
                                accumulated += parsed.text;
                                setMessages(prev => prev.map(m =>
                                    m.id === assistantId ? { ...m, content: accumulated, isStreaming: true } : m
                                ));
                            }
                            if (parsed.error) throw new Error(parsed.error);
                        } catch {
                            // Skip malformed chunks
                        }
                    }
                }
            }

            // Mark streaming done
            setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, isStreaming: false } : m
            ));
        } catch (err) {
            if ((err as Error).name !== "AbortError") {
                setMessages(prev => prev.map(m =>
                    m.id === assistantId
                        ? { ...m, content: "Sorry, I encountered an error connecting to the AI. Please try again.", isStreaming: false }
                        : m
                ));
            }
        } finally {
            setStreaming(false);
        }
    }, [streaming, messages, agentId, uploadedDocs]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    return (
        <div className={`flex flex-col h-full ${className}`}>
            {/* Messages area */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar min-h-0">

                {messages.map(msg => (
                    <MessageBubble key={msg.id} message={msg} agentId={agentId} />
                ))}

                {/* Typing indicator (only when empty streaming message) */}
                {streaming && messages[messages.length - 1]?.content === "" && (
                    <TypingIndicator agentId={agentId} />
                )}

                {/* Suggested questions */}
                {showSuggestions && messages.length <= 1 && (
                    <div className="pt-1 space-y-2">
                        <p className="text-[9px] text-foreground/20 uppercase tracking-wider font-semibold flex items-center gap-1.5">
                            <Sparkles size={9} className={persona.color} />
                            Try asking
                        </p>
                        <div className="grid gap-2">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s)}
                                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[11.5px] text-foreground/45 hover:text-foreground/80 border border-foreground/[0.05] hover:${persona.borderColor} hover:${persona.bgColor} transition-all duration-200 cursor-pointer flex items-center gap-2.5 group`}
                                >
                                    <Zap size={11} className={`${persona.color} opacity-40 group-hover:opacity-80 transition-opacity flex-shrink-0`} />
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="border-t border-foreground/[0.04] px-4 py-3 bg-black/10">

                {/* Uploaded file chips */}
                {uploadedDocs.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2.5 px-1">
                        {uploadedDocs.map((doc, i) => {
                            const FileIcon = FILE_TYPE_ICONS[doc.fileType] || File;
                            const colorClasses = FILE_TYPE_COLORS[doc.fileType] || FILE_TYPE_COLORS["txt"];
                            return (
                                <div
                                    key={`${doc.fileName}-${i}`}
                                    className={`flex items-center gap-2 pl-2.5 pr-1.5 py-1.5 rounded-lg border text-[10px] font-medium ${colorClasses} transition-all duration-200 group/chip`}
                                >
                                    <FileIcon size={12} />
                                    <span className="max-w-[140px] truncate">{doc.fileName}</span>
                                    <span className="text-[8px] opacity-50">
                                        {(doc.fileSize / 1024).toFixed(0)}KB
                                    </span>
                                    <button
                                        onClick={() => removeDoc(i)}
                                        className="w-4 h-4 rounded-full flex items-center justify-center hover:bg-foreground/10 transition-colors cursor-pointer opacity-50 hover:opacity-100"
                                    >
                                        <X size={9} />
                                    </button>
                                </div>
                            );
                        })}
                        <div className="flex items-center gap-1 text-[9px] text-green-400/50">
                            <CheckCircle2 size={10} />
                            {uploadedDocs.length} doc{uploadedDocs.length > 1 ? "s" : ""} loaded
                        </div>
                    </div>
                )}

                {/* Upload error */}
                {uploadError && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 animate-fade-in">
                        <AlertCircle size={12} />
                        {uploadError}
                    </div>
                )}

                {/* Uploading indicator */}
                {uploading && (
                    <div className="flex items-center gap-2 mb-2 px-3 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[10px] text-blue-400 animate-fade-in">
                        <Loader2 size={12} className="animate-spin" />
                        Parsing document...
                    </div>
                )}

                <div className="flex gap-2.5 items-end">
                    {/* Agent avatar in input */}
                    <div className={`w-8 h-8 rounded-xl ${persona.bgColor} border ${persona.borderColor} flex items-center justify-center flex-shrink-0 mb-0.5`}>
                        <Icon size={14} className={persona.color} />
                    </div>

                    {/* Upload button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || streaming}
                        className={`w-8 h-8 rounded-xl bg-foreground/[0.04] border border-foreground/[0.07] hover:border-foreground/[0.15] hover:bg-foreground/[0.06] flex items-center justify-center flex-shrink-0 mb-0.5 transition-all duration-200 cursor-pointer disabled:opacity-30 ${uploadedDocs.length > 0 ? 'border-green-500/20 text-green-400/60' : 'text-foreground/25 hover:text-foreground/50'}`}
                        title="Upload document (PDF, CSV, Excel, DOCX, TXT, JSON)"
                    >
                        {uploading ? <Loader2 size={13} className="animate-spin" /> : <Paperclip size={13} />}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.csv,.xlsx,.xls,.docx,.txt,.json,.md"
                        onChange={e => handleFileUpload(e.target.files)}
                        className="hidden"
                    />

                    <div className="flex-1 relative">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={uploadedDocs.length > 0 ? `Ask about your uploaded docs...` : `Message ${agentName}...`}
                            rows={1}
                            disabled={streaming}
                            className="w-full bg-foreground/[0.04] border border-foreground/[0.07] focus:border-foreground/[0.15] rounded-xl px-4 py-2.5 text-[12px] text-foreground/80 placeholder:text-foreground/20 focus:outline-none resize-none max-h-28 custom-scrollbar transition-colors"
                            style={{ minHeight: "42px" }}
                        />
                    </div>

                    <Button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || streaming}
                        className={`w-9 h-9 p-0 ${persona.bgColor} hover:opacity-80 border ${persona.borderColor} ${persona.color} rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-20 flex-shrink-0 mb-0.5`}
                    >
                        {streaming
                            ? <Loader2 size={14} className="animate-spin" />
                            : <Send size={14} />
                        }
                    </Button>
                </div>
                <p className="text-[8.5px] text-foreground/10 mt-2 text-center tracking-wide">
                    Greeni AI · 📎 Upload docs for context · Enter to send
                </p>
            </div>
        </div>
    );
}
