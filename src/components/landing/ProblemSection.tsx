import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Extracted SectionHeader for reusability across components
export const SectionHeader = ({ badge, title, subtitle, centered = true }: { badge: string, title: React.ReactNode, subtitle?: string, centered?: boolean }) => (
    <div className={cn("mb-20", centered && "text-center")}>
        <Badge variant="outline" className="mb-6 bg-emerald-500/10 text-emerald-700 border-emerald-500/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] inline-flex items-center gap-2 shadow-sm">
            <span className="w-1 h-1 rounded-full bg-emerald-600" />
            {badge}
        </Badge>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-gray-900 mb-6 leading-[0.95]">
            {title}
        </h2>
        {subtitle && (
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-medium leading-relaxed">
                {subtitle}
            </p>
        )}
    </div>
);

export const ProblemSection = () => {
    const problems = [
        {
            icon: "📉",
            title: "Manual Reporting Pains",
            desc: "Consultants take 4 months. Essential data is trapped in hundreds of disconnected, fragile spreadsheets."
        },
        {
            icon: "🚫",
            title: "Zero Real-time Proof",
            desc: "No visibility during off-audit cycles. Trust is lost every single minute you aren't verifying."
        },
        {
            icon: "🔥",
            title: "Agent Burnout",
            desc: "Your best engineering minds are trapped in repetitive form-filling instead of driving critical strategy."
        }
    ];

    return (
        <section id="problem" className="min-h-screen flex flex-col justify-center py-32 relative overflow-hidden selection:bg-rose-500/10 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[800px] aspect-square bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <SectionHeader
                    badge="The Friction"
                    title={<>Is Your Team Overwhelmed by <br /><span className="text-gray-400">Repetitive Compliance?</span></>}
                    subtitle="The climate market is drowning in high volume, slow response times, and inconsistent manual checks. Disconnected legacy tools cause agent burnout and loss of market trust."
                    centered={true}
                />

                <div className="grid md:grid-cols-3 gap-8 mt-8">
                    {problems.map((card, i) => (
                        <div
                            key={i}
                            className="group p-10 rounded-[2rem] border border-gray-200 bg-white hover:bg-gray-50 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-20 transition-opacity duration-700 text-6xl transform translate-x-4 -translate-y-4 pointer-events-none">
                                {card.icon}
                            </div>
                            <div className="text-4xl mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110 origin-left inline-block">
                                {card.icon}
                            </div>
                            <h4 className="text-2xl font-black mb-4 tracking-tight text-gray-800 group-hover:text-gray-900 transition-colors">{card.title}</h4>
                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{card.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
