import React from "react";
import { RefreshCw, Database, Shield, Puzzle, Globe, BarChart3 } from "lucide-react";
import { SectionHeader } from "./ProblemSection";

export const SolutionSection = () => {
    const features = [
        {
            icon: RefreshCw,
            title: "24/7 Automated Support",
            desc: "AI answers instantly from your trusted knowledge base. Scale globally without adding a single headcount."
        },
        {
            icon: Database,
            title: "Existing Content Setup",
            desc: "Go live in minutes, not months. Leverage your existing docs and registry data with no coding required."
        },
        {
            icon: Shield,
            title: "Trusted, Cited Answers",
            desc: "Build customer trust with accurate, verifiable information. Every answer includes a link to the source metadata."
        },
        {
            icon: Puzzle,
            title: "Seamless Handoff",
            desc: "Ensure complex queries reach human experts instantly with full context. AI handles the routine, humans the critical."
        },
        {
            icon: Globe,
            title: "Unified Platform",
            desc: "Native integration with Carbon UPI. Deliver personalized support based on real-time asset history."
        },
        {
            icon: BarChart3,
            title: "Analytics & Reporting",
            desc: "Continuously improve your support impact by understanding exactly what customers ask and value."
        }
    ];

    return (
        <section id="solution" className="min-h-screen flex flex-col justify-center py-32 bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 border-y border-emerald-500/10 relative selection:bg-emerald-500/20">
            <div className="absolute top-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-px w-full bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

            <div className="max-w-7xl mx-auto px-6 w-full">
                <SectionHeader
                    badge="The Transformation"
                    title={<>How GreenPe Re-imagines <br /><span className="text-emerald-600 drop-shadow-[0_4px_20px_rgba(16,185,129,0.2)]">Climate Execution</span></>}
                    subtitle="Turn your passive knowledge base into active, verifiable intelligence. We automate the 'boring' structural work so you can finally focus on the breakthrough."
                    centered={true}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-emerald-500/20 rounded-[2.5rem] overflow-hidden border border-emerald-500/20 shadow-2xl mt-12 backdrop-blur-sm relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />

                    {features.map((feature, i) => (
                        <div key={i} className="p-12 bg-white hover:bg-emerald-50/50 transition-colors duration-500 group relative z-10">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:border-emerald-700 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:shadow-emerald-500/30">
                                <feature.icon size={26} className="text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <h4 className="text-xl font-bold mb-4 text-gray-900 group-hover:text-emerald-700 transition-colors tracking-tight">{feature.title}</h4>
                            <p className="text-gray-600 text-[15px] leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{feature.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
