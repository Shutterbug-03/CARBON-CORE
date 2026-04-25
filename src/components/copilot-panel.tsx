"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Sparkles, ArrowRight, Loader2 } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const suggestedPrompts = [
  "What is my total verified emission reduction?",
  "Am I CBAM-compliant for my EU exports?",
  "How many GICs have I issued this year?",
];

export function CopilotPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "👋 I'm GreenPe Copilot — your Climate AI Agent. I have access to your GICs, compliance status, emission data, and regulatory deadlines. Ask me anything.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/agents/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, agentId: "copilot" }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.response || data.message || "I couldn't process that. Please try again." },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Connection issue. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-[60] w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-2xl ${
          isOpen
            ? "bg-foreground/10 backdrop-blur-xl border border-foreground/10 rotate-0"
            : "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X size={22} className="text-foreground/60" />
        ) : (
          <>
            <Sparkles size={22} className="text-black" />
            <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-amber-400 border-2 border-background animate-pulse" />
          </>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[59] w-[400px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-8rem)] rounded-2xl border border-foreground/[0.08] bg-background/95 backdrop-blur-2xl shadow-2xl shadow-black/20 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-300">
          {/* Header */}
          <div className="px-4 py-3 border-b border-foreground/[0.06] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Sparkles size={14} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">GreenPe Copilot</p>
              <p className="text-[10px] text-foreground/30">Climate AI Agent · Context-Aware</p>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-500/10">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] text-green-400 font-medium">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-green-500 text-black rounded-br-md"
                      : "bg-foreground/[0.04] text-foreground/80 rounded-bl-md border border-foreground/[0.06]"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-foreground/[0.04] rounded-2xl rounded-bl-md px-4 py-3 border border-foreground/[0.06]">
                  <Loader2 size={16} className="text-green-400 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => {
                    setInput(prompt);
                  }}
                  className="text-[11px] px-3 py-1.5 rounded-full border border-foreground/[0.08] text-foreground/40 hover:text-green-400 hover:border-green-500/20 hover:bg-green-500/5 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 border-t border-foreground/[0.06]">
            <div className="flex items-center gap-2 bg-foreground/[0.03] rounded-xl px-3 py-1.5 border border-foreground/[0.06] focus-within:border-green-500/30 transition-colors">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask GreenPe Copilot..."
                className="flex-1 bg-transparent text-sm focus:outline-none placeholder:text-foreground/20"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className="p-1.5 rounded-lg bg-green-500 text-black hover:bg-green-400 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
