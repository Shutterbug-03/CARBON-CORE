"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./ProblemSection";

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-emerald-500/20 pb-2 mb-2 group">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between text-left py-6 hover:text-emerald-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg px-2"
                aria-expanded={isOpen}
            >
                <span className="text-xl font-bold tracking-tight text-gray-800 group-hover:text-gray-900 transition-colors">{question}</span>
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 transition-all duration-300 group-hover:bg-emerald-500/20 group-hover:border-emerald-500/40", isOpen && "bg-emerald-600 border-emerald-700")}>
                    <ChevronDown className={cn("text-emerald-600 transition-transform duration-500", isOpen && "rotate-180 text-white")} size={20} />
                </div>
            </button>
            <div
                className={cn(
                    "grid transition-all duration-500 ease-in-out px-2",
                    isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0 pb-0"
                )}
            >
                <div className="overflow-hidden">
                    <p className="text-gray-600 text-base leading-relaxed pr-12 font-medium">
                        {answer}
                    </p>
                </div>
            </div>
        </div>
    );
};

export const FAQSection = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-32 bg-gradient-to-br from-white via-gray-50 to-white">
            <div className="max-w-4xl mx-auto px-6 text-center w-full">
                <SectionHeader
                    badge="Objections"
                    title="Have Questions? We've Got Answers."
                />
                <div className="text-left mt-20 space-y-2">
                    <FAQItem
                        question="How quickly can I set up GreenPe?"
                        answer="Native setup takes less than 15 minutes. Our AI agents can crawl your existing documentation and API endpoints to begin generating impact metadata instantly, getting you audit-ready in hours, not months."
                    />
                    <FAQItem
                        question="What content sources does GreenPe use?"
                        answer="We integrate directly with IoT sensor logs, NASA POWER satellite data, SCADA telemetry, and your approved PDD (Project Design Documents). If you have data trapped in spreadsheets, we can parse that too."
                    />
                    <FAQItem
                        question="How does it ensure answers are accurate?"
                        answer="Every response is gated by our unique Consensus Protocol. Agents compare physical signals against IPCC benchmarks. If the delta is >15%, the query is flagged for human experts. Otherwise, you get 100% cited answers."
                    />
                    <FAQItem
                        question="Is my customer data secure?"
                        answer="Absolutely. We are SOC2 and GDPR compliant. Every piece of data used for verification is encrypted at rest and tied to an immutable audit trail on the Carbon UPI infrastructure."
                    />
                </div>
            </div>
        </section>
    );
};
