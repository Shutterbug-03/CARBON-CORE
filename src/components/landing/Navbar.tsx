"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            lastScrollY.current = currentScrollY;
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 border-b border-primary/10 bg-background/80 backdrop-blur-2xl transition-transform duration-300 shadow-sm ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                        <Shield size={22} className="text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <div className="flex flex-col leading-tight">
                        <span className="text-base font-black tracking-tight text-foreground group-hover:text-primary transition-colors">GREENPE</span>
                        <span className="text-[10px] tracking-[0.4em] text-primary/70 font-bold uppercase">Climate DPI</span>
                    </div>
                </Link>

                <div className="hidden md:flex items-center gap-10">
                    <Link href="/dashboard" className="text-xs font-bold text-primary hover:text-primary/80 uppercase tracking-widest transition-all">
                        Dashboard
                    </Link>
                    <a href="#problem" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors duration-200">Problem</a>
                    <a href="#solution" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors duration-200">Solution</a>
                    <a href="#trust" className="text-xs font-bold text-muted-foreground hover:text-foreground uppercase tracking-widest transition-colors duration-200">Trust</a>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="hidden sm:block">
                        <Button variant="ghost" className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors duration-200">
                            Mission Control
                        </Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold h-11 px-6 shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 gap-2 uppercase tracking-tight text-xs transition-all duration-300 transform hover:-translate-y-0.5 border-0" aria-label="Start Pilot">
                            Start Pilot <ArrowRight size={14} aria-hidden="true" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};
