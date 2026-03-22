import React from "react";
import { CheckCircle2, Lock, Globe } from "lucide-react";
import { SectionHeader } from "./ProblemSection";

export const DifferentiationSection = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center py-32 border-t border-emerald-500/10 relative selection:bg-emerald-500/20 bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center w-full relative z-10">
                <div>
                    <SectionHeader
                        badge="Why GreenPe?"
                        title={<>More Than Just a Chatbot: <br /><span className="text-gray-400">Fully Integrated AI Support</span></>}
                        centered={false}
                    />
                    <div className="space-y-8 mt-4">
                        {[
                            { title: "Native Integration", desc: "It's a foundational part of your unified climate platform, not a bolted-on tool. Direct read/write access to your asset registry." },
                            { title: "Zero-Code Simplicity", desc: "No-code declarative setup allows your entire compliance team to manage impact claims without writing a single script." },
                            { title: "Trust & Transparency", desc: "Verifiable, cited answers provide a unique trust factor specifically designed for stringent B2B compliance workflows." }
                        ].map((item, i) => (
                            <div key={i} className="flex gap-5 group">
                                <div className="mt-1">
                                    <CheckCircle2 size={24} className="text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
                                </div>
                                <div>
                                    <h5 className="font-bold text-gray-900 mb-2 uppercase tracking-tight text-base group-hover:text-emerald-600 transition-colors">{item.title}</h5>
                                    <p className="text-gray-600 text-[15px] leading-relaxed font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6 lg:ml-10">
                    <div className="space-y-6 pt-12">
                        <div className="aspect-square rounded-[2rem] bg-white border border-emerald-500/20 shadow-xl p-8 flex flex-col justify-between group hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500">
                            <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 mb-4 group-hover:scale-110 group-hover:bg-emerald-600 transition-all">
                                <Lock size={26} className="text-emerald-600 group-hover:text-white transition-colors" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-800 leading-relaxed">Secured at <br /><span className="text-emerald-600">the Core</span></p>
                        </div>

                        <div className="aspect-[3/4] rounded-[2rem] bg-gray-50 border border-gray-200 p-8 flex flex-col justify-between shadow-xl overflow-hidden relative group hover:shadow-2xl transition-shadow duration-500">
                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10 w-full">
                                <div className="h-1.5 w-16 bg-emerald-500/30 rounded-full mb-6" />
                                <div className="space-y-3">
                                    <div className="h-2 w-full bg-gray-200 rounded-full" />
                                    <div className="h-2 w-3/4 bg-gray-200 rounded-full" />
                                    <div className="h-2 w-5/6 bg-gray-200 rounded-full" />
                                </div>
                            </div>
                            <div className="relative z-10 w-full space-y-3 mt-12">
                                <div className="h-3 w-full bg-emerald-500/40 rounded-full shadow-lg shadow-emerald-500/30" />
                                <div className="h-3 w-4/5 bg-emerald-500/40 rounded-full shadow-lg shadow-emerald-500/30" />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="aspect-[3/4] rounded-[2rem] bg-white border border-blue-500/20 p-8 flex flex-col items-center justify-center shadow-xl group hover:bg-blue-50 hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 text-center">
                            <div className="h-20 w-20 bg-blue-500/10 rounded-full border border-blue-500/30 flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-500">
                                <Globe size={32} className="text-blue-600 group-hover:text-white drop-shadow-md transition-colors" />
                            </div>
                            <p className="text-xs font-black text-gray-600 uppercase tracking-[0.3em] group-hover:text-blue-600 transition-colors">Global Reach</p>
                        </div>

                        <div className="aspect-square rounded-[2rem] bg-white border border-emerald-500/20 shadow-xl p-8 flex flex-col justify-end group hover:border-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:bg-emerald-500/20 transition-colors duration-700" />
                            <p className="text-6xl font-black italic tracking-tighter text-emerald-600 mb-3 drop-shadow-sm relative z-10">99%</p>
                            <p className="text-xs font-black uppercase tracking-[0.3em] text-gray-600 group-hover:text-gray-900 transition-colors relative z-10">Audit Ready</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
