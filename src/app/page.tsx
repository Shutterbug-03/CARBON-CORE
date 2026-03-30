"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Zap, FileCheck, ArrowRight, CheckCircle, Cpu, Layers, Lock, RefreshCw, BarChart, Server, Activity, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
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
      {/* Header - Static to Pill on Scroll */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? "py-3" : "py-6"
      }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
        <nav className={`mx-auto transition-all duration-700 ${
          isScrolled
            ? "max-w-fit bg-white/10 backdrop-blur-2xl border border-white/20 rounded-full px-6 py-3 shadow-xl shadow-black/10 scale-[0.98]"
            : "max-w-7xl bg-transparent px-6 rounded-2xl scale-100"
        }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
          <div className="flex items-center justify-between gap-4 w-full">
            <div className="flex-1 flex justify-start">
              <Link href="/" className="flex items-center gap-2">
                <span className={`font-bold tracking-tight text-foreground transition-all duration-700 ${
                  isScrolled ? "text-sm" : "text-lg"
                }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>GreenPe</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center justify-center gap-8 px-4 shrink-0">
              <Link href="/#how-it-works" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>Platform</Link>
              <Link href="/#why-greenpe" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>Why Us</Link>
              <Link href="/about" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>About</Link>
            </div>
            <div className="flex-1 flex items-center justify-end gap-3 md:gap-4 shrink-0">
              <Link href="/dashboard">
                <button className={`rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-foreground font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 duration-700 hover:bg-white/20 hover:border-white/40 ${
                  isScrolled ? "px-6 h-9 text-sm" : "px-8 h-11 text-base"
                }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
                  Dashboard
                </button>
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
      <section className="relative pt-40 md:pt-56 pb-20 md:pb-24 px-6 overflow-hidden">
        {/* Simple Background Gradient for clean flow */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-background to-background" />

        {/* Content - Centered */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider animate-in fade-in slide-in-from-bottom-2">
            INDIA'S FIRST DIGITAL VERIFICATION PLATFORM
          </Badge>
          {/* PAS Headline */}
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl lg:text-7xl font-normal leading-tight tracking-[-0.02em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-foreground">
            Verify Real Climate Action.<br/>
            <span className="italic text-primary/80">Not Just Report It.</span>
          </h1>

          {/* Sub-headline */}
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            GreenPe converts real-world climate actions — like solar generation, EV usage, and industrial efficiency — into trusted, auditable proof.
          </p>

          <div className="flex items-center justify-center gap-2 md:gap-4 font-medium text-sm md:text-base mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200 text-foreground/80">
            <span>From activity</span>
            <ArrowRight size={16} className="text-primary"/>
            <span>To verified impact</span>
            <ArrowRight size={16} className="text-primary"/>
            <span className="text-primary font-semibold">To usable proof</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                Let's Build Together
              </Button>
            </Link>
          </div>

          <div className="max-w-4xl mx-auto p-6 md:p-8 rounded-2xl bg-secondary/30 border border-border/50 text-left animate-in fade-in duration-1000 delay-500">
            <h3 className="font-bold text-lg mb-4 text-center">Built for the entire ecosystem:</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-muted-foreground text-center">
              <div className="p-4 rounded-xl bg-background border border-border/50 shadow-sm flex flex-col items-center">
                <Shield className="mb-2 text-primary" size={24}/>
                MSMEs & Exporters
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/50 shadow-sm flex flex-col items-center">
                <Layers className="mb-2 text-primary" size={24}/>
                Enterprises & Supply Chains
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/50 shadow-sm flex flex-col items-center">
                <Zap className="mb-2 text-primary" size={24}/>
                Renewable Project Operators
              </div>
              <div className="p-4 rounded-xl bg-background border border-border/50 shadow-sm flex flex-col items-center">
                <Globe className="mb-2 text-primary" size={24}/>
                Government & Policy
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-16 md:py-20 px-6 bg-primary/5 text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">OUR VISION</Badge>
          <h2 className="text-2xl md:text-4xl font-[family-name:var(--font-playfair)] leading-relaxed italic text-foreground">
            "To make every climate action in India measurable, verifiable, and trusted at scale."
          </h2>
          <p className="mt-6 text-muted-foreground max-w-2xl mx-auto">
            Our goal is to become the default verification layer for climate action in India connecting real-world activity to trusted outcomes. No manual audits. No fragmented data. No guesswork.
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-red-500/30 text-red-600 px-4 py-1.5 text-xs font-bold tracking-wider">THE PROBLEM</Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Climate action is happening. <br/>
              <span className="italic text-red-600/80">But it is not trusted, standardized, or usable.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Today's system is fundamentally broken. "Reported" does not mean "Verified".
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              { icon: "❌", title: "Fragmented Data", desc: "Data is split across bills, spreadsheets, and disconnected devices." },
              { icon: "❌", title: "Slow & Expensive", desc: "Verification takes months and costs ₹10L+." },
              { icon: "❌", title: "Exclusive", desc: "MSMEs and small projects are systematically excluded." },
              { icon: "❌", title: "No Standard Format", desc: "Different standards across regulators, registries, or ESG systems." }
            ].map((problem, i) => (
              <div key={i} className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 text-center">
                <div className="text-3xl mb-3">{problem.icon}</div>
                <h4 className="font-bold text-foreground mb-2">{problem.title}</h4>
                <p className="text-sm text-muted-foreground">{problem.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto text-center p-8 bg-secondary/30 rounded-2xl border border-border/50">
            <h3 className="font-bold text-xl mb-4 text-foreground">The Result:</h3>
            <p className="text-muted-foreground mb-4">Climate impact cannot be reliably used for:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {['Compliance (CBAM, BRSR)', 'Carbon Markets', 'Green Finance', 'Policy Incentives'].map((item) => (
                <span key={item} className="px-4 py-2 bg-background rounded-full text-sm font-medium border border-border shadow-sm">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* The Solution & How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">THE SOLUTION</Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              GreenPe makes climate action <br/>
              <span className="italic text-primary/80">verifiable, digital, and usable.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              We transform real-world activity into machine-readable, auditable proof of impact using automated verification systems.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: "1", title: "Data Ingestion",
                desc: "Connect real data from smart meters, solar inverters, EV systems, and ERP / industrial systems.",
                icon: Activity, color: "from-blue-500/10 to-indigo-500/10"
              },
              {
                step: "2", title: "Automated Verification (Digital MRV)",
                desc: "We apply standardized methodologies to calculate emissions, measure reductions, and validate authenticity.",
                icon: Cpu, color: "from-indigo-500/10 to-purple-500/10"
              },
              {
                step: "3", title: "Generate Green Impact Certificate (GIC)",
                desc: "A digitally verifiable proof that the activity occurred, the impact is measured, and the data is auditable.",
                icon: FileCheck, color: "from-primary/10 to-emerald-500/10"
              },
              {
                step: "4", title: "Use the Output",
                desc: "Export for ESG & BRSR reporting, CBAM compliance, carbon market readiness, supply chain disclosures, and green financing.",
                icon: BarChart, color: "from-emerald-500/10 to-teal-500/10"
              }
            ].map((step) => (
              <div key={step.step} className="flex flex-col md:flex-row items-center gap-6 bg-card p-6 md:p-8 rounded-2xl border border-border/50 hover:border-primary/30 transition-all hover:shadow-lg relative overflow-hidden group">
                <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                    <step.icon size={28} strokeWidth={2}/>
                  </div>
                </div>
                <div className="relative z-10 flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="text-primary font-bold text-sm">Step {step.step}</span>
                    <h3 className="text-xl font-bold text-foreground">{step.title}</h3>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is a GIC? */}
      <section className="py-24 px-6 bg-primary text-primary-foreground text-center">
        <div className="max-w-4xl mx-auto">
          <FileCheck className="mx-auto mb-6 opacity-80" size={48} />
          <h2 className="text-3xl md:text-5xl font-[family-name:var(--font-playfair)] font-normal mb-8">
            What is a Green Impact Certificate (GIC)?
          </h2>
          <p className="text-xl md:text-2xl font-light mb-12 opacity-90">
            A GIC is a digital proof of verified climate action.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20 backdrop-blur-sm">
              <Shield className="mx-auto mb-4" size={32}/>
              <h4 className="font-bold text-lg mb-2">Verified Evidence Layer</h4>
              <p className="text-sm opacity-80">Cryptographically secured proof of real-world activity.</p>
            </div>
            <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20 backdrop-blur-sm">
              <Server className="mx-auto mb-4" size={32}/>
              <h4 className="font-bold text-lg mb-2">Machine-Readable</h4>
              <p className="text-sm opacity-80">Easily integrated into enterprise systems and databases.</p>
            </div>
            <div className="bg-primary-foreground/10 p-6 rounded-xl border border-primary-foreground/20 backdrop-blur-sm">
              <CheckCircle className="mx-auto mb-4" size={32}/>
              <h4 className="font-bold text-lg mb-2">Compliance-Ready</h4>
              <p className="text-sm opacity-80">Designed for ESG, BRSR, CBAM, and global standards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why GreenPe */}
      <section id="why-greenpe" className="py-24 px-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Why GreenPe?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Because climate action doesn't fail due to lack of effort—it fails due to lack of trust, standardization, and verification.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: "We Focus on Real Action, Not Just Reporting", desc: "Most platforms estimate emissions & generate reports. We focus on verifying real-world climate activity using actual data." },
              { title: "Built for Scale, Not Just Large Projects", desc: "Traditional systems work only for large projects & high-budget verification. GreenPe is designed for MSMEs, distributed assets, and everyday climate actions." },
              { title: "Faster, Simpler, Affordable", desc: "No long audit cycles. No heavy consulting dependency. No fragmented workflows. Verification becomes continuous and digital." },
              { title: "Standardized & Interoperable", desc: "We bring structure to data formats, verification logic, and output certificates. So systems can connect easily, scale efficiently, and be trusted." },
              { title: "Built for Future Compliance & Finance", desc: "Climate is moving toward stricter regulations (CBAM, ESG), carbon markets, and green financing. GreenPe supports all of these through one verification layer." },
              { title: "Designed for India, Scalable Globally", desc: "India has millions of MSMEs, distributed climate actions, and growing compliance needs. We are building for India-first challenges → global scalability." }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-secondary/20 border border-border/50 hover:bg-secondary/40 transition-colors">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                  {idx + 1}
                </div>
                <h4 className="font-bold text-lg text-foreground mb-3">{feature.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-xl font-medium text-foreground italic">
              "Others measure or monetize climate impact. We make it verifiable, trusted, and usable."
            </p>
          </div>
        </div>
      </section>

      {/* Why Now / Impact / CTA */}
      <section className="py-24 md:py-32 px-6 bg-secondary/50 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">WHY NOW</Badge>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-8">
            Climate action is entering a new phase — <br/>
            <span className="italic text-accent">where proof matters more than intent.</span>
          </h2>
          
          <div className="text-left bg-background p-8 rounded-2xl border border-border shadow-sm mb-12">
            <p className="text-muted-foreground mb-6">Across India and globally, regulations are tightening, carbon markets are expanding, and businesses are under pressure to prove impact, not just report it.</p>
            <p className="text-muted-foreground mb-6 font-semibold text-foreground">But the system is not ready. Today:</p>
            <ul className="space-y-3 text-muted-foreground mb-6">
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-red-500 mt-0.5 shrink-0"/> Verification is manual and expensive</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-red-500 mt-0.5 shrink-0"/> Data is fragmented and inconsistent</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-red-500 mt-0.5 shrink-0"/> Small businesses are excluded</li>
              <li className="flex items-start gap-3"><CheckCircle size={18} className="text-red-500 mt-0.5 shrink-0"/> No standard system exists to verify climate actions at scale</li>
            </ul>
            <p className="text-lg font-bold text-primary mt-8 pt-6 border-t border-border">
              The next phase of climate action will be driven by verification — not declarations.
            </p>
          </div>

          <div className="flex flex-col items-center">
            <h3 className="text-2xl font-bold mb-6 text-foreground">Let's Build the Future of Climate Verification Together</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl">
              We are actively working with partners across industries to build a scalable verification ecosystem. Let's make climate action measurable and trusted.
            </p>
            <Link href="/contact">
              <Button size="lg" className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base shadow-xl transition-all hover:scale-105 active:scale-95">
                Collaborate With Us <ArrowRight size={18} className="ml-2" />
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
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
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

