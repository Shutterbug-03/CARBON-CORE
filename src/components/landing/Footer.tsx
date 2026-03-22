import React from "react";
import { Shield } from "lucide-react";

export const Footer = () => {
    return (
        <footer className="py-24 border-t border-emerald-500/20 bg-white">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="flex items-center gap-4 group cursor-pointer">
                    <div className="h-10 w-10 border border-emerald-500/20 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-600 group-hover:border-emerald-700 transition-colors duration-300">
                        <Shield className="h-5 w-5 text-emerald-600 group-hover:text-white transition-colors" />
                    </div>
                    <span className="text-base font-black tracking-tight uppercase text-gray-900 group-hover:text-emerald-600 transition-colors">
                        GreenPe <span className="text-gray-400 font-bold ml-1">Infrastructure</span>
                    </span>
                </div>

                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em] order-3 md:order-2">
                    © 2026 GreenPe. Built on Carbon UPI Infrastructure.
                </p>

                <div className="flex gap-10 order-2 md:order-3">
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors duration-200">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-xs font-bold text-gray-500 hover:text-gray-900 uppercase tracking-widest transition-colors duration-200">
                        Terms of Service
                    </a>
                </div>
            </div>
        </footer>
    );
};
