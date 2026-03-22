import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "./ProblemSection";

export const CTASection = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-32 relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
            <div className="absolute inset-0 bg-emerald-600/10 blur-[150px] rounded-full translate-y-1/2 pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>

            <div className="max-w-5xl mx-auto px-6 text-center relative z-10 w-full">
                <SectionHeader
                    badge="Start Now"
                    title={<>Ready to Elevate Your B2B <br />Climate Support Experience?</>}
                    subtitle="Join the elite infrastructure teams using GreenPe to deliver intelligent, integrated, and verified AI support."
                />
                <div className="flex flex-col items-center gap-10 mt-16">
                    <Link href="/onboarding">
                        <Button size="lg" className="h-20 px-16 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg uppercase tracking-widest shadow-2xl shadow-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/50 gap-4 border-0 transition-all duration-300 transform hover:-translate-y-1 active:scale-95">
                            Request Your Managed Demo <ArrowRight size={24} />
                        </Button>
                    </Link>
                    <Link href="#trust" className="group p-2">
                        <p className="text-sm font-bold text-gray-600 group-hover:text-emerald-600 transition-colors flex items-center gap-3 uppercase tracking-[0.2em]">
                            Or Watch a 2-Minute Overview Video
                            <span className="h-6 w-6 rounded-full bg-emerald-500/10 group-hover:bg-emerald-500/20 flex items-center justify-center transition-colors">
                                <ExternalLink size={12} className="text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                            </span>
                        </p>
                    </Link>
                </div>
            </div>
        </section>
    );
};
