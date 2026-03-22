import React from "react";
import { Zap, MessageSquare } from "lucide-react";

export const TrustSection = () => {
    return (
        <section id="trust" className="min-h-screen flex flex-col justify-center py-32 relative selection:bg-emerald-500/20 bg-white">
            <div className="max-w-7xl mx-auto px-6 w-full relative z-10">
                <div className="text-center mb-24">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mb-12">Trusted by Leading B2B Infrastructure Teams</p>
                    <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24 opacity-60 grayscale group hover:opacity-100 hover:grayscale-0 transition-all duration-1000">
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default text-gray-800">ADANI <span className="text-emerald-600">SOLAR</span></div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default text-gray-800">TATA <span className="text-emerald-600">POWER</span></div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default text-gray-800">RELIANCE <span className="text-emerald-600">GRID</span></div>
                        <div className="flex items-center gap-2 font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-default text-gray-800">HCL <span className="text-emerald-600">TECH</span></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-16 mt-32 items-center">
                    <div className="relative aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-gray-900 border border-emerald-500/20 shadow-2xl group cursor-pointer block transform hover:-translate-y-2 transition-transform duration-500">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-emerald-600/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                            <div className="h-20 w-20 rounded-full bg-emerald-600 flex items-center justify-center shadow-2xl shadow-emerald-500/50 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-300">
                                <Zap size={32} className="text-white fill-white ml-1 drop-shadow-md" />
                            </div>
                        </div>
                        {/* Mock Dashboard elements for the "video" thumbnail */}
                        <div className="absolute top-6 left-6 right-6 h-6 flex items-center justify-between opacity-40">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                <div className="w-3 h-3 rounded-full bg-green-500" />
                            </div>
                            <div className="h-2 w-24 bg-white/30 rounded-full" />
                        </div>
                        <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-32 flex items-end gap-2 opacity-30">
                            {[4, 7, 5, 9, 6, 8, 10, 5, 8, 6, 9].map((h, i) => (
                                <div key={i} className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${h * 10}%` }} />
                            ))}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/30 to-gray-900/50" />

                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-20">
                            <span className="text-xs font-bold text-white tracking-widest uppercase">Platform Demo</span>
                            <span className="text-xs font-bold text-white/60 tracking-widest">02:14</span>
                        </div>
                    </div>

                    <div className="p-16 rounded-[3rem] bg-emerald-600 text-white relative shadow-2xl shadow-emerald-500/30 overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-400 rounded-full blur-[100px] opacity-50 -translate-y-1/2 translate-x-1/4 pointer-events-none" />

                        <MessageSquare className="absolute -top-8 -left-8 h-32 w-32 text-emerald-900/20 -rotate-12 pointer-events-none" />

                        <p className="text-3xl lg:text-4xl font-black italic tracking-tight leading-[1.2] mb-12 relative z-10 text-white">
                            "GreenPe automated <span className="underline decoration-white/50 underline-offset-4 decoration-4">55% of our tier-1</span> compliance inquiries, freeing up our agents by 10 hours a week. It's the first tool that actually speaks B2B."
                        </p>

                        <div className="flex items-center gap-6 relative z-10">
                            <div className="h-16 w-16 rounded-full bg-white border-2 border-emerald-400 overflow-hidden shadow-lg flex items-center justify-center">
                                <span className="text-xl font-black text-emerald-700">VS</span>
                            </div>
                            <div>
                                <p className="font-black text-base uppercase tracking-widest text-white">Vikram Sahay</p>
                                <p className="text-[11px] font-bold text-emerald-50 uppercase tracking-widest mt-1">VP Customer Service, Adani Solar</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
