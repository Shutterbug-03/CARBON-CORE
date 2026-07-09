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
          <p className="text-secondary dark:text-slate-300 text-base leading-relaxed pr-12 font-medium">
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <div className="min-h-screen bg-background text-on-background font-body-md selection:bg-impact-green-vibrant selection:text-white transition-colors duration-300">
      {/* Top Navigation */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-surface-glass dark:bg-slate-950/80 backdrop-blur-3xl border-b border-outline-variant/20 shadow-md py-3"
            : "bg-surface-glass/40 dark:bg-transparent backdrop-blur-md border-b border-outline-variant/10 py-5"
        }`}
      >
        <div className="flex justify-between items-center h-14 px-margin-mobile md:px-margin-desktop max-w-max-width mx-auto">
          <div className="flex items-center gap-2">
            <span className="font-display-lg text-headline-md font-extrabold text-trust-navy dark:text-white tracking-tight">
              GreenPE
            </span>
          </div>
          <div className="hidden md:flex gap-8 items-center">
            <a
              className="text-impact-green-deep dark:text-impact-green-vibrant font-bold border-b-2 border-impact-green-vibrant pb-1 font-label-md text-label-md"
              href="#solutions"
            >
              Solutions
            </a>
            <Link
              className="text-secondary dark:text-slate-300 font-medium hover:text-trust-navy dark:hover:text-white transition-colors font-label-md text-label-md"
              href="/dashboard"
            >
              Impact Dashboard
            </Link>
            <a
              className="text-secondary dark:text-slate-300 font-medium hover:text-trust-navy dark:hover:text-white transition-colors font-label-md text-label-md"
              href="#how-it-works"
            >
              How it Works
            </a>
            <a
              className="text-secondary dark:text-slate-300 font-medium hover:text-trust-navy dark:hover:text-white transition-colors font-label-md text-label-md"
              href="#about-us"
            >
              About Us
            </a>
          </div>
          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-secondary dark:text-slate-300 font-semibold hover:text-trust-navy dark:hover:text-white transition-all p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle Theme"
            >
              <span className="material-symbols-outlined text-[20px] select-none">
                {theme === "light" ? "dark_mode" : "light_mode"}
              </span>
            </button>

            <Link href="/signin" className="hidden md:block">
              <button className="text-secondary dark:text-slate-300 font-semibold hover:text-trust-navy dark:hover:text-white transition-all px-4 py-2 rounded-lg font-label-md text-label-md">
                Login
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="bg-impact-green-vibrant text-white font-bold py-3 px-6 rounded-full hover:bg-impact-green-deep transition-all scale-100 active:scale-95 duration-200 shadow-lg shadow-impact-green-vibrant/20 font-label-md text-label-md">
                Get Started
              </button>
            </Link>

            {/* Mobile Menu Icon */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-secondary dark:text-slate-300 font-semibold hover:text-trust-navy dark:hover:text-white transition-all p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {mobileMenuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-950 border-b border-outline-variant/20 shadow-xl px-margin-mobile py-6 flex flex-col gap-4 animate-in fade-in slide-in-from-top-5 duration-350">
            <a
              className="text-trust-navy dark:text-white font-bold py-2 border-b border-slate-100 dark:border-slate-800"
              href="#solutions"
              onClick={() => setMobileMenuOpen(false)}
            >
              Solutions
            </a>
            <Link
              className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
            >
              Impact Dashboard
            </Link>
            <a
              className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
            >
              How it Works
            </a>
            <a
              className="text-secondary dark:text-slate-300 font-medium py-2 border-b border-slate-100 dark:border-slate-800"
              href="#about-us"
              onClick={() => setMobileMenuOpen(false)}
            >
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
                  Get Started
                </button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(0,211,95,0.15),transparent_60%)] dark:bg-[radial-gradient(circle_at_top,rgba(0,211,95,0.08),transparent_60%)]" />
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-impact-green-vibrant/10 text-impact-green-deep dark:text-impact-green-vibrant px-4 py-1.5 rounded-full mb-8 border border-impact-green-vibrant/20 dark:bg-impact-green-vibrant/5 animate-fade-in">
            <span className="material-symbols-outlined text-[18px]">verified</span>
            <span className="font-label-md text-[12px] tracking-[0.1em] uppercase">
              India's First Digital Verification Platform
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg max-w-4xl mx-auto leading-tight mb-8 text-trust-navy dark:text-white animate-slide-up">
            Verify Real Climate Action. <br />
            <span className="text-impact-green-vibrant text-glow">Not Just Report It.</span>
          </h1>
          <p className="font-body-lg text-body-lg text-secondary dark:text-slate-300 max-w-2xl mx-auto mb-12 animate-fade-in stagger-2">
            GreenPE converts real-world climate actions — like solar generation, EV usage, and industrial
            efficiency — into trusted, auditable proof.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
            <Link href="/dashboard">
              <button className="w-full sm:w-auto bg-trust-navy dark:bg-white dark:text-trust-navy text-white font-bold py-4 px-10 rounded-full hover:bg-trust-navy/90 dark:hover:bg-slate-100 transition-all shadow-xl font-label-md text-label-md scale-100 active:scale-95 duration-200">
                Get Started Free
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="w-full sm:w-auto bg-white dark:bg-slate-900 text-trust-navy dark:text-white font-bold py-4 px-10 rounded-full border border-trust-navy/10 dark:border-white/10 hover:border-trust-navy/20 dark:hover:border-white/20 transition-all font-label-md text-label-md flex items-center justify-center gap-2 scale-100 active:scale-95 duration-200 shadow-md">
                <span className="material-symbols-outlined">bar_chart</span>
                Impact Dashboard
              </button>
            </Link>
          </div>

          {/* Transparency Grid / Flow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 relative">
            {/* Connectors for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-impact-green-vibrant via-impact-green-vibrant to-impact-green-vibrant opacity-20 -z-10" />

            <div className="glass-card reveal-card p-8 rounded-3xl md:rounded-r-none md:border-r-0 dark:bg-slate-900/40 dark:border-white/5">
              <div className="w-12 h-12 bg-impact-green-vibrant/10 rounded-xl flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-4 mx-auto md:mx-0">
                <span className="material-symbols-outlined">sensors</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2 text-trust-navy dark:text-white text-left md:text-left">
                Real-world Activity
              </h3>
              <p className="text-secondary dark:text-slate-300 font-body-md text-left">
                IoT sensors & smart meters capture live emission data.
              </p>
            </div>

            <div className="glass-card reveal-card p-8 rounded-3xl md:rounded-none relative dark:bg-slate-900/40 dark:border-white/5">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-impact-green-vibrant text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase">
                Digital MRV
              </div>
              <div className="w-12 h-12 bg-impact-green-vibrant/10 rounded-xl flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-4 mx-auto md:mx-0">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified_user
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2 text-trust-navy dark:text-white text-left md:text-left">
                Verified Impact
              </h3>
              <p className="text-secondary dark:text-slate-300 font-body-md text-left">
                AI-driven validation ensures 100% data integrity.
              </p>
            </div>

            <div className="glass-card reveal-card p-8 rounded-3xl md:rounded-l-none md:border-l-0 dark:bg-slate-900/40 dark:border-white/5">
              <div className="w-12 h-12 bg-impact-green-vibrant/10 rounded-xl flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-4 mx-auto md:mx-0">
                <span className="material-symbols-outlined">description</span>
              </div>
              <h3 className="font-headline-md text-headline-md mb-2 text-trust-navy dark:text-white text-left md:text-left">
                Usable Proof
              </h3>
              <p className="text-secondary dark:text-slate-300 font-body-md text-left">
                On-chain certificates ready for ESG & Carbon Markets.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Vision / Mission Bento Grid */}
      <section id="about-us" className="py-24 bg-trust-navy text-white overflow-hidden transition-colors">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1">
              <span className="text-impact-green-vibrant font-label-md tracking-widest uppercase mb-4 block">
                Our Radical Vision
              </span>
              <h2 className="font-display-lg text-display-lg leading-tight mb-8">
                To make every climate action in India <span className="italic font-light opacity-80">measurable</span> and{" "}
                <span className="text-impact-green-vibrant">trusted at scale.</span>
              </h2>
              <p className="text-secondary-fixed-dim/80 font-body-lg text-body-lg text-slate-300">
                GreenPE is the missing verification layer. No manual audits. No fragmented data. No guesswork. Just
                verifiable truth for a sustainable future.
              </p>
            </div>
            <div className="flex-1 relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                alt="A high-tech control room with large glowing holographic displays showing green energy grids"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAyUYs-j7su-_slehbEWCEbicjt26dEXcMcrO2eQ4gBG1nW-bO1sN5rZcEODMgWK5vKUhMtjgVBY400hzWNkHDid5RH8grLodKgRaNvt4tBCXk2XxdMrQocN4oky-BKM5Zz9KOTb8WV9ufBs7-NjHJHp-U6yIz68pLJeYgU69G3ZP3vpzEvQSI0ILYjfcNMtNYpCC-O1RTsW6E1SSibWhg5hTmYBSXQa_5CT5ZbUx79s5lHw8dj12BY551swY8z9Ec1EUEww5yFEwo"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-trust-navy via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-xl flex items-center justify-between shadow-lg">
                <div>
                  <p className="font-label-md text-[10px] uppercase opacity-60">Live Network Capacity</p>
                  <p className="font-headline-md text-white">1.2 GW Verified</p>
                </div>
                <div className="text-impact-green-vibrant">
                  <span className="material-symbols-outlined text-[32px]">query_stats</span>
                </div>
              </div>
            </div>
          </div>

          {/* Service Modules Cluster */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-default group">
              <span className="material-symbols-outlined text-impact-green-vibrant mb-6 block text-[40px] group-hover:scale-110 transition-transform select-none">
                factory
              </span>
              <h4 className="font-headline-md text-[20px] mb-3 text-white">SMEs & Exporters</h4>
              <p className="text-secondary-fixed-dim/70 text-slate-300 text-sm leading-relaxed">
                Ensure CBAM compliance and unlock green financing with automated reporting.
              </p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-default group">
              <span className="material-symbols-outlined text-impact-green-vibrant mb-6 block text-[40px] group-hover:scale-110 transition-transform select-none">
                hub
              </span>
              <h4 className="font-headline-md text-[20px] mb-3 text-white">Enterprises</h4>
              <p className="text-secondary-fixed-dim/70 text-slate-300 text-sm leading-relaxed">
                Digitally verify Scope 3 emissions across your entire multi-tier supply chain.
              </p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-default group">
              <span className="material-symbols-outlined text-impact-green-vibrant mb-6 block text-[40px] group-hover:scale-110 transition-transform select-none">
                solar_power
              </span>
              <h4 className="font-headline-md text-[20px] mb-3 text-white">Project Operators</h4>
              <p className="text-secondary-fixed-dim/70 text-slate-300 text-sm leading-relaxed">
                Issue higher-value carbon credits through real-time, sensor-driven verification.
              </p>
            </div>
            <div className="p-8 bg-white/5 border border-white/10 rounded-3xl hover:bg-white/10 transition-all cursor-default group">
              <span className="material-symbols-outlined text-impact-green-vibrant mb-6 block text-[40px] group-hover:scale-110 transition-transform select-none">
                account_balance
              </span>
              <h4 className="font-headline-md text-[20px] mb-3 text-white">Gov & Policy</h4>
              <p className="text-secondary-fixed-dim/70 text-slate-300 text-sm leading-relaxed">
                Establish national registries with auditable, high-fidelity data rails.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Timeline */}
      <section id="how-it-works" className="py-24 bg-surface-container-low dark:bg-slate-950 border-b border-outline-variant/15 transition-colors">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="bg-white dark:bg-slate-900 dark:border-white/10 px-4 py-1.5 rounded-full text-impact-green-deep dark:text-impact-green-vibrant font-label-md border border-impact-green-vibrant/10 mb-6 inline-block">
              The Process
            </span>
            <h2 className="font-display-lg text-display-lg text-trust-navy dark:text-white mb-6">
              GreenPE makes climate action verifiable and usable.
            </h2>
            <p className="text-secondary dark:text-slate-300 font-body-lg">
              We transform real-world activity into machine-readable, auditable proof using automated systems.
            </p>
          </div>

          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-impact-green-vibrant/40 via-impact-green-vibrant to-impact-green-vibrant/20 -translate-x-1/2 hidden md:block" />

            <div className="space-y-12 relative">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1 md:text-right">
                  <div className="inline-flex items-center gap-2 text-impact-green-deep dark:text-impact-green-vibrant font-bold mb-2">
                    <span className="bg-impact-green-vibrant text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      1
                    </span>
                    <span className="uppercase tracking-widest text-[12px]">Phase One</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4 text-trust-navy dark:text-white">
                    Data Ingestion
                  </h3>
                  <p className="text-secondary dark:text-slate-300">
                    Connect real data from smart meters, solar inverters, EV systems, and ERP / industrial systems.
                  </p>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-impact-green-vibrant z-10 items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-impact-green-deep dark:text-impact-green-vibrant select-none">
                    bolt
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <div className="glass-card p-6 rounded-2xl border-dashed border-2 border-outline-variant/30 flex items-center gap-4 dark:bg-slate-900/40 dark:border-white/10">
                    <div className="w-12 h-12 rounded-lg bg-surface-container dark:bg-slate-800 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary dark:text-slate-300 select-none">
                        database
                      </span>
                    </div>
                    <div>
                      <p className="font-label-md text-trust-navy dark:text-white">Connected Assets</p>
                      <p className="text-sm text-secondary dark:text-slate-400">24.5k Industrial Endpoints</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                <div className="flex-1 md:text-left">
                  <div className="inline-flex items-center gap-2 text-impact-green-deep dark:text-impact-green-vibrant font-bold mb-2">
                    <span className="bg-impact-green-vibrant text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      2
                    </span>
                    <span className="uppercase tracking-widest text-[12px]">Phase Two</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4 text-trust-navy dark:text-white">
                    Automated Verification
                  </h3>
                  <p className="text-secondary dark:text-slate-300">
                    We apply standardized methodologies to calculate emissions, measure reductions, and validate authenticity.
                  </p>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-impact-green-vibrant z-10 items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-impact-green-deep dark:text-impact-green-vibrant select-none">
                    schema
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <div className="glass-card p-6 rounded-2xl border-dashed border-2 border-outline-variant/30 flex flex-col gap-3 dark:bg-slate-900/40 dark:border-white/10">
                    <div className="flex justify-between items-center text-xs font-bold uppercase text-secondary dark:text-slate-300">
                      <span>Cross-Check Validation</span>
                      <span className="text-impact-green-vibrant">99.9% Match</span>
                    </div>
                    <div className="h-2 w-full bg-surface-container dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-impact-green-vibrant w-[99.9%]" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className="flex-1 md:text-right">
                  <div className="inline-flex items-center gap-2 text-impact-green-deep dark:text-impact-green-vibrant font-bold mb-2">
                    <span className="bg-impact-green-vibrant text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      3
                    </span>
                    <span className="uppercase tracking-widest text-[12px]">Phase Three</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4 text-trust-navy dark:text-white">
                    Generate GIC
                  </h3>
                  <p className="text-secondary dark:text-slate-300">
                    A digitally verifiable proof that the activity occurred, the impact is measured, and the data is auditable.
                  </p>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-impact-green-vibrant z-10 items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-impact-green-deep dark:text-impact-green-vibrant select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    workspace_premium
                  </span>
                </div>
                <div className="flex-1 w-full">
                  {/* GIC Preview Component */}
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-impact-green-vibrant shadow-xl relative overflow-hidden transition-all duration-300 hover:scale-[1.02]">
                    <div className="absolute -right-10 -top-10 w-32 h-32 bg-impact-green-vibrant/5 rounded-full" />
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="text-[10px] font-bold text-impact-green-deep dark:text-impact-green-vibrant uppercase tracking-tighter">
                          Green Impact Certificate
                        </p>
                        <p className="text-[8px] text-secondary dark:text-slate-400">Serial No: GPE-2024-X88321</p>
                      </div>
                      <div className="w-10 h-10 bg-impact-green-vibrant rounded flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-[20px] select-none">qr_code_2</span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="h-[1px] bg-outline-variant/20" />
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-secondary dark:text-slate-400">Verified Offset</span>
                        <span className="text-sm font-bold text-trust-navy dark:text-white">12,450 tCO2e</span>
                      </div>
                      <div className="h-[1px] bg-outline-variant/20" />
                    </div>
                    <div className="bg-impact-green-vibrant/10 p-2 rounded text-[10px] text-impact-green-deep dark:text-impact-green-vibrant font-bold text-center">
                      CRYPTOGRAPHICALLY SEALED
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16">
                <div className="flex-1 md:text-left">
                  <div className="inline-flex items-center gap-2 text-impact-green-deep dark:text-impact-green-vibrant font-bold mb-2">
                    <span className="bg-impact-green-vibrant text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">
                      4
                    </span>
                    <span className="uppercase tracking-widest text-[12px]">Phase Four</span>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-4 text-trust-navy dark:text-white">
                    Use the Output
                  </h3>
                  <p className="text-secondary dark:text-slate-300">
                    Export for ESG & BRSR reporting, CBAM compliance, carbon market readiness, or green financing.
                  </p>
                </div>
                <div className="hidden md:flex w-12 h-12 bg-white dark:bg-slate-900 rounded-full border-4 border-impact-green-vibrant z-10 items-center justify-center shadow-lg">
                  <span className="material-symbols-outlined text-impact-green-deep dark:text-impact-green-vibrant select-none">
                    output
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <div className="flex flex-wrap gap-2">
                    <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-outline-variant/30 dark:border-white/10 text-xs font-semibold text-trust-navy dark:text-white shadow-sm hover:border-impact-green-vibrant/40 transition-colors">
                      CBAM Report
                    </span>
                    <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-outline-variant/30 dark:border-white/10 text-xs font-semibold text-trust-navy dark:text-white shadow-sm hover:border-impact-green-vibrant/40 transition-colors">
                      BRSR Filing
                    </span>
                    <span className="px-4 py-2 bg-white dark:bg-slate-900 rounded-full border border-outline-variant/30 dark:border-white/10 text-xs font-semibold text-trust-navy dark:text-white shadow-sm hover:border-impact-green-vibrant/40 transition-colors">
                      Carbon Registry
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why GreenPE Grid */}
      <section id="solutions" className="py-24 bg-background transition-colors duration-300">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <h2 className="font-display-lg text-display-lg text-trust-navy dark:text-white mb-4">
              Why GreenPE?
            </h2>
            <p className="text-secondary dark:text-slate-300 max-w-2xl mx-auto">
              Climate action doesn't fail due to lack of effort—it fails due to lack of trust, standardization, and
              verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  target
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">
                Real Action, Not Reporting
              </h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                Stop estimating emissions based on bill averages. We focus on verifying actual climate activity using
                real-world data feeds.
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  expand_content
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">Built for Scale</h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                Traditional audits only work for massive projects. GreenPE is designed for MSMEs, distributed assets,
                and everyday climate actions.
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  bolt
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">
                Faster, Simpler, Affordable
              </h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                No long audit cycles or heavy consulting fees. Verification becomes continuous, digital, and instantly
                accessible.
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  settings_input_component
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">
                Standardized Interoperable
              </h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                We bring structure to data formats, verification logic, and output certificates. One layer to connect
                everything.
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  monitoring
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">
                Future Compliance Ready
              </h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                Climate is moving toward stricter regulations (CBAM, ESG). GreenPE supports all of these through one
                unified verification layer.
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="group p-8 rounded-3xl bg-surface-container-lowest dark:bg-slate-900/30 border border-outline-variant/10 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-2xl bg-impact-green-vibrant/10 flex items-center justify-center text-impact-green-deep dark:text-impact-green-vibrant mb-6 group-hover:bg-impact-green-vibrant group-hover:text-white transition-all select-none">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  language
                </span>
              </div>
              <h4 className="font-headline-md text-[20px] mb-3 text-trust-navy dark:text-white">
                India-First, Global Reach
              </h4>
              <p className="text-secondary dark:text-slate-300 text-sm leading-relaxed">
                Designed for the unique challenges of India's millions of MSMEs, while maintaining compliance with
                global standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section - Gated by User Global Rule */}
      <section className="py-24 bg-surface-container-low dark:bg-slate-950 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="text-center mb-16">
            <span className="bg-white dark:bg-slate-900 dark:border-white/10 px-4 py-1.5 rounded-full text-impact-green-deep dark:text-impact-green-vibrant font-label-md border border-impact-green-vibrant/10 mb-6 inline-block">
              FAQ
            </span>
            <h2 className="font-display-lg text-display-lg text-trust-navy dark:text-white mb-4">
              Have Questions? We've Got Answers.
            </h2>
            <p className="text-secondary dark:text-slate-300">
              Clear information on integration speed, data security, and compliance verification.
            </p>
          </div>
          <div className="mt-12 space-y-2">
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

      {/* Final CTA Section */}
      <section className="py-24 bg-impact-green-vibrant">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop text-center">
          <h2 className="font-display-lg text-display-lg text-white mb-6">
            Build the Future of Climate <br className="hidden md:block" /> Verification Together.
          </h2>
          <p className="text-white/80 max-w-xl mx-auto mb-10 font-body-lg">
            We are actively working with partners across industries to build a scalable verification ecosystem. Let's
            make climate action measurable and trusted.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/dashboard" className="inline-block">
              <button className="w-full sm:w-auto bg-trust-navy text-white font-bold py-5 px-12 rounded-full hover:bg-trust-navy/90 transition-all shadow-2xl flex items-center justify-center gap-3 group scale-100 active:scale-95 duration-200">
                Collaborate With Us
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform select-none">
                  arrow_forward
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-trust-navy pt-20 pb-10">
        <div className="max-w-max-width mx-auto px-margin-mobile md:px-margin-desktop">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="font-display-lg text-headline-md font-bold text-white mb-6">GreenPE</div>
              <p className="text-slate-400 max-w-sm mb-8 text-sm">
                Building the future of climate verification. Radical transparency for a sustainable planet.
              </p>
              <div className="flex gap-4">
                <a
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-impact-green-vibrant hover:text-white transition-all select-none"
                  href="#"
                  aria-label="Share"
                >
                  <span className="material-symbols-outlined text-[20px]">share</span>
                </a>
                <a
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-impact-green-vibrant hover:text-white transition-all select-none"
                  href="#"
                  aria-label="Website"
                >
                  <span className="material-symbols-outlined text-[20px]">public</span>
                </a>
              </div>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Solutions</h5>
              <ul className="space-y-4">
                <li>
                  <Link className="text-slate-400 hover:text-white transition-colors text-sm" href="/dashboard">
                    Impact Dashboard
                  </Link>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#solutions">
                    Enterprise Solutions
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#solutions">
                    SME Portal
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-bold mb-6">Company</h5>
              <ul className="space-y-4">
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="#">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a className="text-slate-400 hover:text-white transition-colors text-sm" href="mailto:support@greenpe.in">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-[12px]">
              &copy; 2024 GreenPE. All rights reserved. Building the future of climate verification.
            </p>
            <div className="flex gap-6">
              <span className="text-impact-green-vibrant text-[12px] font-bold">
                Status: All Systems Operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
