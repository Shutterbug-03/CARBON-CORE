"use client";

/**
 * Premium Hero Section - Taste-Skill Enhanced
 * Design Philosophy: Soft Structuralism + Editorial Luxury
 * - Double-Bezel nested architecture
 * - Custom spring physics
 * - Asymmetric layout with massive whitespace
 * - Geist font stack with tracking-tighter
 */

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shield } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";

export const HeroSectionPremium = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[100dvh] flex items-center py-32 md:py-40 overflow-hidden bg-gradient-to-br from-[#FDFBF7] via-[#F9FAF9] to-[#F5F7F5]">
      {/* Premium Grain Overlay */}
      <div className="fixed inset-0 z-[1] pointer-events-none opacity-[0.015]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="4" stitchTiles="stitch"/>
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Radial Mesh Gradient Background */}
      <div className="absolute inset-0 z-0" style={{
        transform: `translateY(${scrollY * 0.3}px)`,
      }}>
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-emerald-500/[0.08] rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-400/[0.05] rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 w-full relative z-10">
        {/* Asymmetric Grid */}
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left: Massive Typography */}
          <div className="lg:col-span-7 space-y-12">

            {/* Eyebrow Tag */}
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200/50 shadow-[0_2px_8px_rgba(16,185,129,0.08)]">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-700">
                Climate Infrastructure
              </span>
            </div>

            {/* Display Headline - Geist + Tracking-Tighter */}
            <h1 className="text-6xl md:text-7xl xl:text-8xl font-black tracking-tighter leading-[0.9] text-[#1a1a1a]">
              Automate Carbon
              <br />
              Compliance with
              <br />
              <span className="text-emerald-600 italic font-serif">
                Intelligence
              </span>
            </h1>

            {/* Body Copy - Editorial Style */}
            <p className="text-lg md:text-xl text-zinc-600 leading-relaxed max-w-[55ch] font-normal">
              Turn raw emissions data into ISO-verified certificates in seconds. AI analyzes, calculates, and generates audit-ready documentation while you focus on impact.
            </p>

            {/* Double-Bezel CTA Button */}
            <div className="flex flex-col sm:flex-row items-start gap-6 pt-4">

              {/* Primary CTA - Nested Architecture */}
              <Link href="/demo">
                <div className="group relative">
                  {/* Outer Shell */}
                  <div className="relative p-[3px] rounded-full bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 shadow-[0_8px_24px_rgba(16,185,129,0.25)] transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:shadow-[0_12px_40px_rgba(16,185,129,0.35)] group-hover:scale-[1.02] active:scale-[0.98]">
                    {/* Inner Core */}
                    <div className="relative flex items-center gap-3 px-8 py-4 bg-emerald-600 rounded-full">
                      <span className="text-sm font-bold uppercase tracking-[0.1em] text-white">
                        Generate Certificate
                      </span>
                      {/* Button-in-Button Icon */}
                      <div className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 backdrop-blur-sm transition-all duration-500 group-hover:translate-x-1 group-hover:-translate-y-[2px] group-hover:scale-110">
                        <ArrowRight size={14} weight="bold" className="text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Secondary Action - Soft Outline */}
              <Link href="/verify">
                <button className="flex items-center gap-2 px-6 py-4 rounded-full border border-zinc-300/60 bg-white/60 backdrop-blur-sm text-sm font-medium text-zinc-700 transition-all duration-500 hover:border-zinc-400 hover:bg-white hover:shadow-[0_4px_16px_rgba(0,0,0,0.06)] active:scale-[0.98]">
                  <Shield size={16} weight="duotone" className="text-emerald-600" />
                  Verify Certificate
                </button>
              </Link>
            </div>

            {/* Trust Indicators - Airy Layout */}
            <div className="pt-12 flex items-center gap-8 opacity-60">
              <div className="flex -space-x-4">
                {["AS", "KT", "RM", "DB"].map((initials, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-zinc-100 to-zinc-200 border-2 border-white flex items-center justify-center text-xs font-bold text-zinc-700 shadow-sm"
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div className="h-12 w-px bg-zinc-300" />
              <p className="text-xs font-medium text-zinc-600 leading-snug max-w-[20ch]">
                Trusted by 1,200+ organizations globally
              </p>
            </div>
          </div>

          {/* Right: Floating Card with Double-Bezel */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative" style={{
              transform: `translateY(${-scrollY * 0.15}px)`,
            }}>

              {/* Glow Effect */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-400/20 via-blue-400/10 to-emerald-300/20 rounded-[3rem] blur-3xl opacity-50" />

              {/* Outer Shell - Double Bezel */}
              <div className="relative p-2 rounded-[2.5rem] bg-gradient-to-br from-white/80 to-zinc-50/80 backdrop-blur-xl border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">

                {/* Inner Core */}
                <div className="relative aspect-[3/4] rounded-[calc(2.5rem-0.5rem)] overflow-hidden bg-gradient-to-br from-zinc-50 to-white border border-zinc-200/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),inset_0_-1px_2px_rgba(0,0,0,0.02)]">

                  {/* Content Inside Card */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-between">

                    {/* Top Stats */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
                            Live Impact
                          </span>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/50 text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                          Verified
                        </div>
                      </div>

                      {/* Big Number */}
                      <div>
                        <div className="text-6xl font-black tracking-tighter text-zinc-900 leading-none">
                          247.3
                          <span className="text-2xl font-normal text-zinc-400 ml-2">tCO₂e</span>
                        </div>
                        <p className="text-sm text-zinc-500 mt-2 font-medium">
                          Carbon offset this month
                        </p>
                      </div>
                    </div>

                    {/* Bottom Chart Visualization */}
                    <div className="space-y-4">
                      <div className="h-32 flex items-end gap-1.5 rounded-2xl bg-gradient-to-t from-emerald-50/80 to-transparent p-4 border border-emerald-100/50">
                        {[45, 72, 38, 90, 65, 82, 100, 78].map((height, i) => (
                          <div
                            key={i}
                            className="flex-1 bg-gradient-to-t from-emerald-400 to-emerald-300 rounded-sm transition-all duration-700 hover:from-emerald-500 hover:to-emerald-400"
                            style={{
                              height: `${height}%`,
                              transitionDelay: `${i * 80}ms`,
                            }}
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span className="text-emerald-600">Apr</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
