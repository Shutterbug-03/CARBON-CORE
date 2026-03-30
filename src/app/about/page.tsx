"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, CheckCircle, Target, Eye, Activity, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AboutPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "py-3" : "py-6"
      }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <nav className={`mx-auto transition-all duration-700 ${
          isScrolled
            ? "max-w-fit bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full px-6 py-3 shadow-xl shadow-black/10 scale-[0.98]"
            : "max-w-7xl bg-transparent px-6 rounded-2xl scale-100"
        }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <div className="flex items-center justify-between gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className={`font-bold tracking-tight text-foreground transition-all duration-700 ${
                isScrolled ? "text-sm" : "text-lg"
              }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>GreenPe</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/#problem" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>The Problem</Link>
              <Link href="/#how-it-works" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>How It Works</Link>
              <Link href="/#why-greenpe" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>Why GreenPe</Link>
              <span className={`font-bold text-primary transition-all duration-700 ${isScrolled ? "text-[13px]" : "text-sm"}`}>About Us</span>
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <Link href="/dashboard" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/80 hover:text-primary" : "text-sm text-foreground/90 hover:text-primary"}`}>
                Dashboard
              </Link>
              <Link href="/contact">
                <button className={`rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-foreground font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 duration-700 hover:bg-white/20 hover:border-white/40 ${
                  isScrolled ? "px-6 h-9 text-sm" : "px-8 h-11 text-base"
                }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  Contact Us
                </button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative pt-40 md:pt-48 pb-20 px-6 overflow-hidden bg-primary/5">
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider animate-in fade-in slide-in-from-bottom-2">
            WHO WE ARE
          </Badge>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal leading-tight tracking-[-0.02em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-foreground">
            Building a digital verification layer for <span className="italic text-primary/80">climate action.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            We help businesses, projects, and institutions prove that real climate action is happening — using data, not assumptions. From renewable energy to industrial efficiency, we convert real-world activity into trusted, verifiable proof that can be used across compliance, reporting, and finance.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 px-6 bg-background">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            
            <div className="p-8 rounded-2xl bg-secondary/30 border border-border/50">
              <Target className="text-primary mb-6" size={40}/>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] mb-6">Our Mission</h2>
              <p className="text-xl font-medium text-foreground mb-6 italic">
                To make climate action measurable, verifiable, and usable.
              </p>
              <p className="text-muted-foreground mb-4">
                We aim to simplify how climate impact is:
              </p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-primary"/> Captured</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-primary"/> Verified</li>
                <li className="flex items-center gap-3"><CheckCircle size={18} className="text-primary"/> And trusted</li>
              </ul>
              <p className="text-foreground font-medium">So that every organization — big or small — can participate in climate systems.</p>
            </div>

            <div className="p-8 rounded-2xl bg-primary/5 border border-primary/20">
              <Eye className="text-primary mb-6" size={40}/>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] mb-6">Our Vision</h2>
              <p className="text-xl font-medium text-foreground mb-6 italic">
                A world where climate impact is as trusted as financial transactions.
              </p>
              <p className="text-muted-foreground mb-4">We envision a future where:</p>
              <ul className="space-y-3 text-muted-foreground mb-6">
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-primary mt-1 shrink-0"/> Climate actions are not just reported, but proven</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-primary mt-1 shrink-0"/> Verification is instant, digital, and scalable</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-primary mt-1 shrink-0"/> Data enables trust, transparency, and accountability</li>
                <li className="flex items-start gap-3"><CheckCircle size={18} className="text-primary mt-1 shrink-0"/> Every unit of impact can be used across systems — compliance, finance, and policy</li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Solutions & Approaches */}
      <section className="py-24 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">SOLVING THE GAP</Badge>
              <h2 className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] mb-6">GreenPe aims to solve this by:</h2>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold mb-2">Enabling MSMEs</h4>
                  <p className="text-sm text-muted-foreground">To easily participate in climate systems and benefit from green incentives.</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold mb-2">Reducing Cost & Time</h4>
                  <p className="text-sm text-muted-foreground">Making verification continuous rather than a one-time audit process.</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold mb-2">Standardizing Impact</h4>
                  <p className="text-sm text-muted-foreground">Bringing structure to how impact is measured and reported across industries.</p>
                </div>
                <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                  <h4 className="font-bold mb-2">Large-Scale Adoption</h4>
                  <p className="text-sm text-muted-foreground">Supporting the widespread adoption of climate compliance seamlessly.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <h2 className="text-2xl font-[family-name:var(--font-playfair)] mb-6">What We Do</h2>
              <p className="text-muted-foreground mb-4">We provide a system that:</p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Activity size={16}/></div>
                  <span className="text-sm text-foreground my-auto">Connects real-world data (energy, EV, industrial, etc.)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Shield size={16}/></div>
                  <span className="text-sm text-foreground my-auto">Verifies climate impact using standardized methods</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><CheckCircle size={16}/></div>
                  <span className="text-sm text-foreground my-auto">Generates digital proof (Green Impact Certificates)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0"><Target size={16}/></div>
                  <span className="text-sm text-foreground my-auto">Enables use across reporting, compliance, and financial systems</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-24 px-6 bg-background text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">OUR APPROACH</Badge>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-12">
            We believe:
          </h2>
          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-secondary/20 rounded-xl border border-border/50">
              <h3 className="font-bold text-lg text-primary mb-3">Data-driven</h3>
              <p className="text-muted-foreground">Climate systems should be data-driven, not document-driven.</p>
            </div>
            <div className="p-6 bg-secondary/20 rounded-xl border border-border/50">
              <h3 className="font-bold text-lg text-primary mb-3">Continuous</h3>
              <p className="text-muted-foreground">Verification should be continuous, not one-time audits.</p>
            </div>
            <div className="p-6 bg-secondary/20 rounded-xl border border-border/50">
              <h3 className="font-bold text-lg text-primary mb-3">Simple & Interoperable</h3>
              <p className="text-muted-foreground">Systems should be simple, scalable, and fully interoperable.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-24 px-6 bg-primary/5 border-t border-border/50">
        <div className="max-w-5xl mx-auto text-center">
          <Users className="mx-auto text-primary mb-6" size={40}/>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl md:text-4xl font-normal text-foreground mb-8">
            Building With the Ecosystem
          </h2>
          <p className="text-muted-foreground mb-10 text-lg">GreenPe is actively working with:</p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {["Businesses and MSMEs", "Renewable & Sustainability Projects", "Technology Platforms", "Financial Institutions", "Policy and Research Organizations"].map((partner) => (
              <span key={partner} className="px-5 py-3 bg-background border border-primary/20 rounded-full text-foreground shadow-sm">
                {partner}
              </span>
            ))}
          </div>
          
          <div className="bg-background p-8 md:p-12 rounded-2xl border border-border shadow-lg">
            <h3 className="text-2xl font-[family-name:var(--font-playfair)] italic mb-6">
              "If climate action is happening, it should be provable. That's what we're building."
            </h3>
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95">
                Work With Us <ArrowRight size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Minimal */}
      <footer className="border-t border-border/50 py-12 px-6 bg-background">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Shield size={20} className="text-primary" />
            <span className="font-bold text-lg text-foreground">GreenPe</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GreenPe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
