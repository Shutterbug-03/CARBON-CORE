"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "@/providers/theme-provider";

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-impact-green-vibrant/20 pb-2 mb-2 group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-6 hover:text-impact-green-vibrant transition-colors focus:outline-none rounded-lg px-2"
        aria-expanded={isOpen}
      >
        <span className="text-xl font-bold tracking-tight text-trust-navy dark:text-white group-hover:text-impact-green-vibrant dark:group-hover:text-impact-green-vibrant transition-colors">
          {question}
        </span>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center bg-impact-green-vibrant/10 border border-impact-green-vibrant/20 transition-all duration-300 group-hover:bg-impact-green-vibrant/20 group-hover:border-impact-green-vibrant/40 ${
            isOpen ? "bg-impact-green-deep border-impact-green-deep" : ""
          }`}
        >
          <span
            className={`material-symbols-outlined text-impact-green-vibrant transition-transform duration-500 ${
              isOpen ? "rotate-180 text-white" : ""
            }`}
          >
            expand_more
          </span>
        </div>
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out px-2 ${
          isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0 pb-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="text-secondary dark:text-slate-350 text-base leading-relaxed pr-12 font-medium">
            {answer}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Shadow background trigger
      setIsScrolled(currentScrollY > 20);

      // Hide on scroll down, show on scroll up
      if (currentScrollY < 50) {
        setNavVisible(true);
      } else {
        if (currentScrollY > lastScrollY) {
          // Swipe down: hide
          setNavVisible(false);
        } else {
          // Swipe up: show
          setNavVisible(true);
        }
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.05,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("opacity-100", "translate-y-0");
          entry.target.classList.remove("opacity-0", "translate-y-10");
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll(".reveal-card");
    revealElements.forEach((el) => {
      el.classList.add("opacity-0", "translate-y-10", "transition-all", "duration-700");
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-slate-950 text-trust-navy dark:text-white font-body-md selection:bg-impact-green-vibrant selection:text-white transition-colors duration-300">
      
      {/* Top Navigation */}
      <nav
        className={`fixed z-50 transition-all duration-500 left-1/2 -translate-x-1/2 w-[92%] max-w-4xl ${
          isScrolled ? "top-3" : "top-6"
        } ${
          navVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white/20 dark:bg-black/25 backdrop-blur-md border border-white/25 dark:border-white/10 rounded-full px-6 py-1 shadow-[0_8px_32px_rgba(0,0,0,0.15)] flex justify-center items-center gap-6 md:gap-10 h-11 transition-all duration-300 w-full">
          {/* Logo */}
          <div className="flex items-center">
            <span className="font-display-lg text-sm md:text-base font-extrabold text-white tracking-tight select-none">
              GreenPE
            </span>
          </div>
          
          {/* Nav Links */}
          <div className="hidden md:flex gap-6 items-center">
            <a className="text-white/85 hover:text-white transition-colors font-label-md text-[11px] uppercase tracking-wider" href="#solutions">
              Solutions
            </a>
            <Link className="text-white/85 hover:text-white transition-colors font-label-md text-[11px] uppercase tracking-wider" href="/dashboard">
              Impact Dashboard
            </Link>
            <a className="text-white/85 hover:text-white transition-colors font-label-md text-[11px] uppercase tracking-wider" href="#how-it-works">
              How it Works
            </a>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-white/85 hover:text-white transition-all p-1 rounded-full hover:bg-white/10"
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[16px] select-none">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>

            <Link href="/signin" className="hidden sm:block">
              <button className="text-white/85 hover:text-white transition-all px-2 py-1 font-semibold font-label-md text-[11px] uppercase tracking-wider">
                Login
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="bg-white hover:bg-slate-100 dark:bg-white/20 dark:hover:bg-white/30 text-trust-navy dark:text-white font-bold py-1.5 px-4 rounded-full transition-all text-[11px] font-label-md">
                Contact Us
              </button>
            </Link>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white/80 hover:text-white transition-all p-2 rounded-full hover:bg-white/10"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[20px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border border-white/25 dark:border-white/10 rounded-2xl shadow-xl px-margin-mobile py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-350">
            <a className="text-trust-navy dark:text-white font-bold py-2 border-b border-slate-100 dark:border-slate-800" href="#solutions" onClick={() => setMobileMenuOpen(false)}>
              Solutions
            </a>
            <Link className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800" href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
              Impact Dashboard
            </Link>
            <a className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800" href="#how-it-works" onClick={() => setMobileMenuOpen(false)}>
              How it Works
            </a>
            <a className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800" href="#about-us" onClick={() => setMobileMenuOpen(false)}>
              About Us
            </a>
            <div className="flex gap-4 pt-4">
              <Link href="/signin" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full border border-outline-variant text-trust-navy dark:text-white font-bold py-3 rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition-all text-sm">
                  Login
                </button>
              </Link>
              <Link href="/dashboard" className="flex-1" onClick={() => setMobileMenuOpen(false)}>
                <button className="w-full bg-impact-green-vibrant text-white font-bold py-3 rounded-full hover:bg-impact-green-deep transition-all text-sm">
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO SECTION (Wind Turbines Background) ─── */}
      <header className="relative min-h-screen flex items-center justify-center pt-24 pb-20 overflow-hidden bg-zinc-900">
          {/* Background Image - Day/Sunset scene */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out animate-slow-zoom" 
            style={{
              backgroundImage: "url('/images/hero-day.png')",
              opacity: theme === "light" ? 0.65 : 0
            }}
          />
          {/* Background Image - Starry Night scene */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out animate-slow-zoom" 
            style={{
              backgroundImage: "url('/images/hero-night.png')",
              opacity: theme === "dark" ? 0.55 : 0
            }}
          />
          {/* Ambient Overlays */}
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0A1B33]/70 via-transparent to-black/80 transition-colors duration-1000" />
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/50 via-transparent to-black/40" />

        <div className="max-w-max-width w-full mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          {/* Left Column: Headline copy */}
          <div className="lg:col-span-8 space-y-8 text-left">
            <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/20 text-white px-4 py-1.5 rounded-full border border-impact-green-vibrant/40 backdrop-blur-md">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span className="font-label-md text-[12px] tracking-[0.1em] uppercase">
                India's First Digital Verification Platform
              </span>
            </div>
            <h1 className="font-display-lg text-5xl md:text-7xl xl:text-8xl font-extrabold tracking-tighter leading-[0.95] text-white">
              Verify Real Climate Action. <br />
              <span className="text-impact-green-vibrant text-glow">Not Just Report It.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-2xl leading-relaxed">
              GreenPE converts real-world climate actions — like solar generation, EV usage, and industrial
              efficiency — into trusted, auditable proof.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link href="/dashboard" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto bg-white hover:bg-slate-100 text-trust-navy font-bold py-4 px-10 rounded-full transition-all shadow-xl font-label-md text-label-md flex items-center justify-center gap-3 group scale-100 active:scale-95 duration-200">
                  GET STARTED
                  <div className="w-8 h-8 rounded-full bg-trust-navy text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Widget (matches screen.png) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="relative p-[1px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.15)] animate-float">
              <div className="p-6 rounded-[calc(1.5rem-1px)] bg-white/5 dark:bg-black/10 backdrop-blur-md border border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-impact-green-vibrant animate-pulse" />
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
                      greenpe.com
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-impact-green-vibrant/20 border border-impact-green-vibrant/30 text-[8px] text-impact-green-vibrant font-black uppercase">
                    LIVE PILOT
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                  GreenPE converts climate actions into trusted, cryptographically verifiable proof artifacts.
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/10">
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-500 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">AS</div>
                    <div className="w-6 h-6 rounded-full bg-blue-500 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">KT</div>
                    <div className="w-6 h-6 rounded-full bg-purple-500 border border-slate-950 flex items-center justify-center text-[8px] font-bold text-white">GP</div>
                  </div>
                  <span className="text-[10px] text-impact-green-vibrant font-bold">12k+ Active Nodes</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─── SECTION 2: VISION & BENTO (Leaf Sphere) ─── */}
      <section id="about-us" className="py-28 relative overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Leaf Sphere Container Graphic */}
          <div className="lg:col-span-5 flex justify-center reveal-card">
            <div className="relative w-full max-w-[400px] aspect-square rounded-[3rem] overflow-hidden shadow-2xl border border-outline-variant/20 dark:border-white/10 p-4 bg-slate-50 dark:bg-slate-900/40">
              <div 
                className="w-full h-full rounded-[2.5rem] bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent rounded-[3rem]" />
              <div className="absolute bottom-8 left-8 right-8 p-4 bg-white/10 dark:bg-black/30 backdrop-blur-md border border-white/20 text-white rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-wider opacity-60">Verified Output</p>
                  <p className="text-lg font-black text-white">Radical Transparency</p>
                </div>
                <div className="text-impact-green-vibrant">
                  <span className="material-symbols-outlined text-[28px] select-none">eco</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Mission Text */}
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-impact-green-vibrant text-[24px]">filter_vintage</span>
              <span className="text-secondary dark:text-slate-400 font-label-md text-xs font-black uppercase tracking-[0.2em]">
                JOIN THE CHANGE
              </span>
            </div>
            
            <h2 className="font-display-lg text-3xl md:text-5xl font-extrabold tracking-tighter text-trust-navy dark:text-white leading-[1.05]">
              We convert real-world climate actions into trusted, auditable proof for{" "}
              <span className="text-impact-green-vibrant italic font-serif">SMEs & Exporters, Enterprises, Project Operators, and Gov & Policy.</span>
            </h2>
            
            <p className="text-secondary dark:text-slate-350 text-base leading-relaxed">
              GreenPE is the missing verification layer. No manual audits. No fragmented data. No guesswork. Just verifiable truth for a sustainable future.
            </p>

            <Link href="/dashboard" className="inline-flex items-center gap-2 text-trust-navy dark:text-white font-bold hover:text-impact-green-vibrant transition-colors group">
              <span>GET STARTED</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
            </Link>

            {/* Two-Column Grid Info */}
            <div className="grid md:grid-cols-2 gap-8 pt-6 border-t border-outline-variant/30 dark:border-white/10">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-impact-green-vibrant/10 rounded-xl flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant select-none">
                  <span className="material-symbols-outlined text-[22px]">sensors</span>
                </div>
                <h4 className="font-bold text-lg text-trust-navy dark:text-white uppercase tracking-tight">
                  REAL-WORLD ACTIVITY
                </h4>
                <p className="text-secondary dark:text-slate-355 text-sm leading-relaxed">
                  We understand that each situation requires a unique approach. We work with you to capture and verify real-time climate actions across your operations.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-10 h-10 bg-impact-green-vibrant/10 rounded-xl flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant select-none">
                  <span className="material-symbols-outlined text-[22px]">verified_user</span>
                </div>
                <h4 className="font-bold text-lg text-trust-navy dark:text-white uppercase tracking-tight">
                  VERIFIED IMPACT
                </h4>
                <p className="text-secondary dark:text-slate-355 text-sm leading-relaxed">
                  With leading technology and transparent processes, we guarantee that your climate actions are accurately verified and provide measurable impact.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── SECTION 3: SECTOR CARDS (Dark Band) ─── */}
      <section id="solutions" className="py-24 bg-trust-navy text-white relative overflow-hidden transition-colors">
        {/* Outlined Background Text */}
        <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none select-none opacity-5 text-center hidden md:block">
          <span className="text-[12rem] font-black uppercase tracking-widest block select-none">
            VERIFIED CLIMATE
          </span>
        </div>

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 space-y-16">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <Link href="/dashboard">
              <button className="bg-impact-green-vibrant text-white font-bold py-4 px-8 rounded-full hover:bg-impact-green-deep transition-all flex items-center justify-center gap-3 group scale-100 active:scale-95 duration-200">
                GET STARTED
                <div className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                </div>
              </button>
            </Link>
            <p className="max-w-md text-slate-300 text-sm leading-relaxed">
              Transforming complex climate data into usable, trusted proof for every stakeholder in the ecosystem.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Card 1: SMEs & Exporters */}
            <div className="reveal-card group rounded-3xl overflow-hidden bg-slate-900 border border-white/5 relative aspect-[3/4] flex flex-col justify-end p-8 shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy via-trust-navy/30 to-transparent" />
              <div className="relative z-10 space-y-4">
                <span className="material-symbols-outlined text-impact-green-vibrant text-[36px] block">
                  factory
                </span>
                <h4 className="font-headline-md text-xl font-bold tracking-tight text-white uppercase">
                  SMEs & Exporters
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Ensure CBAM compliance and unlock green financing with automated reporting.
                </p>
              </div>
            </div>

            {/* Card 2: Enterprises */}
            <div className="reveal-card group rounded-3xl overflow-hidden bg-slate-900 border border-white/5 relative aspect-[3/4] flex flex-col justify-end p-8 shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80&w=600')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy via-trust-navy/30 to-transparent" />
              <div className="relative z-10 space-y-4">
                <span className="material-symbols-outlined text-impact-green-vibrant text-[36px] block">
                  hub
                </span>
                <h4 className="font-headline-md text-xl font-bold tracking-tight text-white uppercase">
                  Enterprises
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Digitally verify Scope 3 emissions across your entire multi-tier supply chain.
                </p>
              </div>
            </div>

            {/* Card 3: Project Operators */}
            <div className="reveal-card group rounded-3xl overflow-hidden bg-slate-900 border border-white/5 relative aspect-[3/4] flex flex-col justify-end p-8 shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=600')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy via-trust-navy/30 to-transparent" />
              <div className="absolute top-6 right-6 z-10 bg-impact-green-vibrant/20 border border-impact-green-vibrant/40 px-3 py-1 rounded-full text-[8px] font-black uppercase text-impact-green-vibrant">
                IMPACT SOLUTIONS
              </div>
              <div className="relative z-10 space-y-4">
                <span className="material-symbols-outlined text-impact-green-vibrant text-[36px] block">
                  solar_power
                </span>
                <h4 className="font-headline-md text-xl font-bold tracking-tight text-white uppercase">
                  Project Operators
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Issue higher-value carbon credits through real-time, sensor-driven verification.
                </p>
              </div>
            </div>

            {/* Card 4: Gov & Policy */}
            <div className="reveal-card group rounded-3xl overflow-hidden bg-slate-900 border border-white/5 relative aspect-[3/4] flex flex-col justify-end p-8 shadow-2xl">
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=600')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy via-trust-navy/30 to-transparent" />
              <div className="relative z-10 space-y-4">
                <span className="material-symbols-outlined text-impact-green-vibrant text-[36px] block">
                  account_balance
                </span>
                <h4 className="font-headline-md text-xl font-bold tracking-tight text-white uppercase">
                  Gov & Policy
                </h4>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Establish national registries with auditable, high-fidelity data rails.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── SECTION 4: USABLE PROOF & TIMELINE (Holographic Turbine) ─── */}
      <section id="how-it-works" className="py-28 bg-[#FDFBF7] dark:bg-slate-950 transition-colors duration-300 relative">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Copy & Benefits */}
          <div className="lg:col-span-6 space-y-8">
            <div className="flex flex-col space-y-3">
              <span className="text-impact-green-vibrant font-label-md text-xs font-black uppercase tracking-[0.2em]">
                CLEAN BENEFITS
              </span>
              <h2 className="font-display-lg text-4xl md:text-6xl font-extrabold tracking-tighter text-trust-navy dark:text-white leading-tight">
                Usable Proof
              </h2>
            </div>
            
            <p className="text-secondary dark:text-slate-350 text-base leading-relaxed">
              We transform real-world activity into machine-readable, auditable proof using automated verification pipelines.
            </p>

            {/* List with Icons */}
            <div className="space-y-6 pt-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shrink-0 mt-0.5 select-none">
                  <span className="material-symbols-outlined text-[18px]">analytics</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-trust-navy dark:text-white">
                    Accurate Performance Measurement
                  </h4>
                  <p className="text-secondary dark:text-slate-400 text-sm leading-relaxed mt-1">
                    Provide auditable proof of real-world climate actions for complete transparency.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shrink-0 mt-0.5 select-none">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </div>
                <div>
                  <h4 className="font-bold text-lg text-trust-navy dark:text-white">
                    Verified Impact Tracking
                  </h4>
                  <p className="text-secondary dark:text-slate-400 text-sm leading-relaxed mt-1">
                    Offer reliable verification and tracking of your environmental contributions.
                  </p>
                </div>
              </div>
            </div>

            {/* Ingestion Steps (Brief Timeline) */}
            <div className="pt-8 border-t border-outline-variant/30 dark:border-white/10 space-y-4">
              <h5 className="font-bold text-xs uppercase tracking-[0.1em] text-slate-400">THE VERIFICATION LIFECYCLE</h5>
              <div className="grid grid-cols-2 gap-4 text-xs font-bold text-trust-navy dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-impact-green-vibrant/20 text-impact-green-deep dark:text-impact-green-vibrant flex items-center justify-center text-[10px]">1</span>
                  <span>Data Ingestion</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-impact-green-vibrant/20 text-impact-green-deep dark:text-impact-green-vibrant flex items-center justify-center text-[10px]">2</span>
                  <span>MRV Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-impact-green-vibrant/20 text-impact-green-deep dark:text-impact-green-vibrant flex items-center justify-center text-[10px]">3</span>
                  <span>GIC Generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-impact-green-vibrant/20 text-impact-green-deep dark:text-impact-green-vibrant flex items-center justify-center text-[10px]">4</span>
                  <span>Compliance Output</span>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Holographic Turbine Globe (matches screen.png) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center relative reveal-card">
            {/* 3D Holographic Wind Turbine Globe Image */}
            <div className="relative w-full max-w-[450px] aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl border border-outline-variant/20 dark:border-white/10 bg-slate-900/10">
              <div 
                className="w-full h-full bg-cover bg-center transition-transform duration-700 hover:scale-105" 
                style={{
                  backgroundImage: "url('https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=800')"
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy/80 via-transparent to-transparent" />
              
              {/* Overlaid Card (matches screen.png) */}
              <div className="absolute bottom-6 left-6 right-6 p-6 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                <Link href="/dashboard" className="w-full md:w-auto">
                  <button className="w-full md:w-auto bg-white text-trust-navy font-bold py-3 px-6 rounded-full hover:bg-slate-100 transition-all text-xs font-label-md">
                    GET STARTED
                  </button>
                </Link>
                <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider leading-relaxed text-center md:text-left">
                  Provide trusted and reliable climate action verification
                </span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 5: THE PROCESS (TIMELINE) ─── */}
      <section id="process" className="py-28 bg-white dark:bg-slate-950 border-t border-outline-variant/15 transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop space-y-20">
          
          {/* Title block */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="bg-impact-green-vibrant/10 text-impact-green-deep dark:text-impact-green-vibrant px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              The Process
            </span>
            <h2 className="font-display-lg text-4xl md:text-5xl font-extrabold text-trust-navy dark:text-white tracking-tighter leading-tight">
              GreenPE makes climate action verifiable and usable.
            </h2>
            <p className="text-secondary dark:text-slate-350 text-base">
              We transform real-world activity into machine-readable, auditable proof using automated systems.
            </p>
          </div>

          {/* Timeline container */}
          <div className="relative">
            {/* Central Vertical Line (hidden on mobile, centered on desktop) */}
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-impact-green-vibrant/20 -translate-x-1/2 z-0" />

            {/* Phase 1 */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center mb-20 z-10">
              {/* Content (Left column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:text-right space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/15 text-impact-green-deep dark:text-impact-green-vibrant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span>1</span>
                  <span>PHASE ONE</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-trust-navy dark:text-white">
                  Data Ingestion
                </h3>
                <p className="text-secondary dark:text-slate-350 text-sm leading-relaxed max-w-md lg:ml-auto">
                  Connect real data from smart meters, solar inverters, EV systems, and ERP / industrial systems.
                </p>
              </div>

              {/* Center Indicator Circle */}
              <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-0 lg:top-auto">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-impact-green-vibrant flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shadow-md font-bold text-xs select-none">
                  <span className="material-symbols-outlined text-[16px]">bolt</span>
                </div>
              </div>

              {/* Visual card (Right column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-8 order-3 space-y-4">
                <div className="p-6 rounded-2xl border-2 border-dashed border-impact-green-vibrant/20 bg-[#FDFBF7]/60 dark:bg-slate-900/40 backdrop-blur-sm max-w-sm flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant select-none">
                    <span className="material-symbols-outlined text-[20px]">database</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-trust-navy dark:text-white uppercase tracking-tight">Connected Assets</h4>
                    <p className="text-[10px] text-secondary dark:text-slate-400 mt-0.5">24.5k Industrial Endpoints</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center mb-20 z-10">
              {/* Visual card (Left column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-1 lg:text-right order-3 lg:order-1 flex lg:justify-end">
                <div className="p-6 rounded-2xl border-2 border-dashed border-impact-green-vibrant/20 bg-[#FDFBF7]/60 dark:bg-slate-900/40 backdrop-blur-sm max-w-sm w-full space-y-3 shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold text-trust-navy dark:text-white">
                    <span className="tracking-wider uppercase">Cross-Check Validation</span>
                    <span className="text-impact-green-deep dark:text-impact-green-vibrant">99.9% Match</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="h-full bg-impact-green-vibrant rounded-full w-[99.9%]" />
                  </div>
                </div>
              </div>

              {/* Center Indicator Circle */}
              <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-0 lg:top-auto">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-impact-green-vibrant flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shadow-md font-bold text-xs select-none">
                  <span className="material-symbols-outlined text-[16px]">account_tree</span>
                </div>
              </div>

              {/* Content (Right column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-8 space-y-4 order-2">
                <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/15 text-impact-green-deep dark:text-impact-green-vibrant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span>2</span>
                  <span>PHASE TWO</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-trust-navy dark:text-white">
                  Automated Verification
                </h3>
                <p className="text-secondary dark:text-slate-350 text-sm leading-relaxed max-w-md">
                  We apply standardized methodologies to calculate emissions, measure reductions, and validate authenticity.
                </p>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center mb-20 z-10">
              {/* Content (Left column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:text-right space-y-4 order-2 lg:order-1">
                <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/15 text-impact-green-deep dark:text-impact-green-vibrant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span>3</span>
                  <span>PHASE THREE</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-trust-navy dark:text-white">
                  Generate GIC
                </h3>
                <p className="text-secondary dark:text-slate-350 text-sm leading-relaxed max-w-md lg:ml-auto">
                  A digitally verifiable proof that the activity occurred, the impact is measured, and the data is auditable.
                </p>
              </div>

              {/* Center Indicator Circle */}
              <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-0 lg:top-auto">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-impact-green-vibrant flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shadow-md font-bold text-xs select-none">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
              </div>

              {/* Visual card (Right column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-8 order-3 space-y-4">
                {/* Certificate visual */}
                <div className="p-6 rounded-2xl border border-impact-green-vibrant/30 bg-[#FDFBF7] dark:bg-slate-900 shadow-lg max-w-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-black text-impact-green-deep dark:text-impact-green-vibrant tracking-wider uppercase">
                        Green Impact Certificate
                      </h5>
                      <p className="text-[8px] text-slate-400 font-mono">Serial No: GPE-2024-X88321</p>
                    </div>
                    <div className="w-8 h-8 rounded bg-impact-green-vibrant flex items-center justify-center text-white select-none">
                      <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Verified Offset</span>
                    <span className="text-lg font-black text-trust-navy dark:text-white">12,450 tCO2e</span>
                  </div>
                  <div className="bg-impact-green-vibrant/10 py-1.5 rounded-lg text-center text-[9px] font-black uppercase text-impact-green-deep dark:text-impact-green-vibrant tracking-widest">
                    CRYPTOGRAPHICALLY SEALED
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 4 */}
            <div className="relative grid lg:grid-cols-12 gap-8 items-center z-10">
              {/* Visual card (Left column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-1 lg:text-right order-3 lg:order-1 flex lg:justify-end gap-2 flex-wrap">
                <span className="px-3 py-1.5 rounded-full border border-outline-variant/30 bg-white/50 dark:bg-slate-900/30 text-[10px] font-bold text-trust-navy dark:text-white">
                  CBAM Report
                </span>
                <span className="px-3 py-1.5 rounded-full border border-outline-variant/30 bg-white/50 dark:bg-slate-900/30 text-[10px] font-bold text-trust-navy dark:text-white">
                  BRSR Filing
                </span>
                <span className="px-3 py-1.5 rounded-full border border-outline-variant/30 bg-white/50 dark:bg-slate-900/30 text-[10px] font-bold text-trust-navy dark:text-white">
                  Carbon Registry
                </span>
              </div>

              {/* Center Indicator Circle */}
              <div className="absolute left-4 lg:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-0 lg:top-auto">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-impact-green-vibrant flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant shadow-md font-bold text-xs select-none">
                  <span className="material-symbols-outlined text-[16px]">exit_to_app</span>
                </div>
              </div>

              {/* Content (Right column on desktop) */}
              <div className="pl-10 lg:pl-0 lg:col-span-5 lg:col-start-8 space-y-4 order-2">
                <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/15 text-impact-green-deep dark:text-impact-green-vibrant px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                  <span>4</span>
                  <span>PHASE FOUR</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold text-trust-navy dark:text-white">
                  Use the Output
                </h3>
                <p className="text-secondary dark:text-slate-350 text-sm leading-relaxed max-w-md">
                  Export for ESG & BRSR reporting, CBAM compliance, carbon market readiness, or green financing.
                </p>
              </div>
            </div>

          </div>

          {/* Quote Card (matches greenpe green box in screen.png) */}
          <div className="reveal-card max-w-4xl mx-auto rounded-[2.5rem] bg-impact-green-vibrant/10 dark:bg-impact-green-vibrant/5 border border-impact-green-vibrant/20 p-10 md:p-16 relative overflow-hidden shadow-xl">
            <div className="absolute top-6 right-10 text-9xl font-black text-impact-green-vibrant/10 pointer-events-none select-none font-serif leading-none">
              99
            </div>
            
            <div className="space-y-6 relative z-10">
              <span className="material-symbols-outlined text-impact-green-deep dark:text-impact-green-vibrant text-[48px] select-none">
                format_quote
              </span>
              <blockquote className="text-xl md:text-2xl font-bold text-trust-navy dark:text-white leading-relaxed tracking-tight">
                "GreenPE's platform has allowed us to transparently verify our energy efficiency efforts and share real proof with our stakeholders."
              </blockquote>
                <div className="flex justify-between items-center pt-4 border-t border-impact-green-vibrant/20">
                  <div>
                    <cite className="not-italic font-extrabold text-trust-navy dark:text-white block text-sm">
                      Client
                    </cite>
                  </div>
                  <span className="text-[10px] font-black uppercase text-impact-green-deep dark:text-impact-green-vibrant">
                    VERIFIED CLIENT
                  </span>
                </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── SECTION 6: PARTNER LOGOS ─── */}
      <section className="py-12 border-y border-outline-variant/20 dark:border-white/10 bg-slate-50 dark:bg-slate-900/20 transition-colors">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-wrap justify-between items-center gap-8 md:gap-12 opacity-50 dark:opacity-75">
            <span className="font-display-lg text-lg font-black uppercase tracking-widest text-slate-400">
              RotoShow
            </span>
            <span className="font-display-lg text-lg font-black uppercase tracking-widest text-slate-400">
              waves
            </span>
            <span className="font-display-lg text-lg font-black uppercase tracking-widest text-slate-400">
              travelers.
            </span>
            <span className="font-display-lg text-lg font-black uppercase tracking-widest text-slate-400">
              goldlines
            </span>
            <span className="font-display-lg text-lg font-black uppercase tracking-widest text-slate-400">
              velocity 9
            </span>
          </div>
        </div>
      </section>

      {/* ─── SECTION 7: FAQ ACCORDION (Global Rule requirement) ─── */}
      <section className="py-28 bg-[#FDFBF7] dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-20">
            <span className="bg-impact-green-vibrant/10 px-4 py-1.5 rounded-full text-impact-green-deep dark:text-impact-green-vibrant font-label-md border border-impact-green-vibrant/10 mb-6 inline-block">
              FAQ
            </span>
            <h2 className="font-display-lg text-4xl md:text-5xl font-extrabold text-trust-navy dark:text-white tracking-tighter mb-4 leading-none">
              Have Questions? We've Got Answers.
            </h2>
            <p className="text-secondary dark:text-slate-350 font-body-lg">
              Find instant responses to technical and compliance inquiries.
            </p>
          </div>
          
          <div className="space-y-4">
            <FAQItem
              question="How quickly can I set up GreenPE?"
              answer="Setting up smart integrations takes less than 15 minutes. Our deterministic ingestion pipelines can map existing IoT sensor configurations or smart meter logs, getting you live in hours rather than months."
            />
            <FAQItem
              question="What content sources or data formats does GreenPE use?"
              answer="We interface natively with IoT protocols (MQTT, HTTP APIs), SCADA, smart meters, NASA POWER solar datasets, and standard files (.xlsx, .csv, .json). We normalize all inputs through the open Climate Data Ingestion Format (CDIF)."
            />
            <FAQItem
              question="How does GreenPE ensure answers and calculations are accurate?"
              answer="Every calculation is executed by our deterministic MRV engine using verified regulatory methodologies (e.g. CEA India, IPCC AR6). We do not use black-box models or AI guessing, making every GIC fully auditable and certifiable."
            />
            <FAQItem
              question="What happens if the telemetry doesn't match the methodology?"
              answer="If telemetry lacks required parameters or if geo-coordinates/values exceed acceptable physical limits (e.g., negative generation), the validation pipeline flags the telemetry transaction, preventing verification or certificate issuance."
            />
            <FAQItem
              question="Is my customer data secure when using GreenPE?"
              answer="Yes. We leverage Composite Identity Hashing (CIH) to cryptographically anchor device streams to entity profiles without storing plaintext raw telemetry on-chain. All operations are fully encrypted, GDPR, and SOC2 compliant."
            />
            <FAQItem
              question="Does GreenPE require technical expertise to manage?"
              answer="No. Once smart connections are set up, business users can track verifications, export reports (CBAM, BRSR), and audit certificate lineages directly from our intuitive pilot dashboard."
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 8: CONTACT / FINAL CTA (Navy Block) ─── */}
      <section className="py-28 bg-[#0A1B33] text-white relative overflow-hidden transition-colors">
        {/* Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,211,95,0.1),transparent_60%)]" />

        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 grid md:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: CTA */}
          <div className="md:col-span-8 space-y-8">
            <span className="material-symbols-outlined text-impact-green-vibrant text-[54px] select-none block">
              filter_vintage
            </span>
            <h2 className="font-display-lg text-4xl md:text-6xl font-black tracking-tight leading-[0.95] text-white uppercase max-w-2xl">
              contact us <br />
              now to get <br />
              started!
            </h2>
            <div className="pt-4">
              <Link href="/dashboard" className="inline-block">
                <button className="bg-white hover:bg-slate-100 text-trust-navy font-bold py-4 px-10 rounded-full transition-all shadow-xl font-label-md text-label-md flex items-center justify-center gap-3 group scale-100 active:scale-95 duration-200">
                  GET STARTED
                  <div className="w-8 h-8 rounded-full bg-trust-navy text-white flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </div>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: CTA Paragraph */}
          <div className="md:col-span-4 text-left">
            <p className="text-slate-350 text-xs font-bold uppercase tracking-[0.2em] leading-relaxed max-w-xs border-l-2 border-impact-green-vibrant pl-6 py-2">
              START VERIFYING YOUR REAL-WORLD CLIMATE ACTIONS AND GENERATE AN AUDITABLE PROOF TODAY.
            </p>
          </div>

        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="bg-slate-950 pt-20 pb-10 border-t border-white/5 transition-colors">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          
          {/* Columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div>
              <h5 className="text-white font-black mb-6 uppercase tracking-wider text-xs">Product</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-slate-400 hover:text-white transition-colors text-sm" href="/dashboard">
                    Verification Platform
                  </Link>
                </li>
                <li>
                  <Link className="text-slate-400 hover:text-white transition-colors text-sm" href="/open-protocol">
                    API Reference
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-black mb-6 uppercase tracking-wider text-xs">Solutions</h5>
              <ul className="space-y-4">
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#solutions">
                    SMEs & Exporters
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#solutions">
                    Enterprises
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#solutions">
                    Gov & Policy
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h5 className="text-white font-black mb-6 uppercase tracking-wider text-xs">Company</h5>
              <ul className="space-y-4">
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#about-us">
                    About Us
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Careers
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="mailto:support@greenpe.in">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white font-black mb-6 uppercase tracking-wider text-xs">Resources</h5>
              <ul className="space-y-4">
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Blog
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Case Studies
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Bottom Row */}
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">
              &copy; 2024 REDEFINED. All rights reserved. Building the future of climate verification.
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              <a className="hover:text-white transition-colors" href="#">
                Terms & Condition
              </a>
              <a className="hover:text-white transition-colors" href="#">
                Privacy Policy
              </a>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
}
