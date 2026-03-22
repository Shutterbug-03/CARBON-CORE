"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, Zap, FileCheck, ArrowRight, CheckCircle, Cpu, Layers, Lock, RefreshCw } from "lucide-react";
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
    <div className="min-h-screen bg-background">
      {/* Header - Static to Pill on Scroll */}
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
              <a href="#features" className={`font-bold transition-all duration-700 ${
                isScrolled
                  ? "text-[13px] text-foreground/70 hover:text-foreground"
                  : "text-sm text-foreground/80 hover:text-foreground"
              }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>Features</a>
              <a href="#how-it-works" className={`font-bold transition-all duration-700 ${
                isScrolled
                  ? "text-[13px] text-foreground/70 hover:text-foreground"
                  : "text-sm text-foreground/80 hover:text-foreground"
              }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>How It Works</a>
              <a href="#impact" className={`font-bold transition-all duration-700 ${
                isScrolled
                  ? "text-[13px] text-foreground/70 hover:text-foreground"
                  : "text-sm text-foreground/80 hover:text-foreground"
              }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>Impact</a>
            </div>
            <Link href="/onboarding">
              <button className={`rounded-full bg-white/15 backdrop-blur-md border border-white/30 text-foreground font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 duration-700 hover:bg-white/20 hover:border-white/40 ${
                isScrolled ? "px-6 h-9 text-sm" : "px-8 h-11 text-base"
              }`} style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}>
                Get Involved
              </button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section - Premium Editorial with Video Background */}
      <section className="relative pt-40 md:pt-56 pb-32 md:pb-40 px-6 overflow-hidden">
        {/* Video Background - Top Positioned (Upper Half Visible) */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover object-top"
          >
            <source src="/videos/hero-background.mp4" type="video/mp4" />
          </video>

          {/* Gradient Mask - Fade from bottom to show upper half clearly */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

          {/* Strong bottom fade to blend with rest of page */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />

          {/* Subtle side fade for edge cleanup */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/60 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/60 to-transparent" />
        </div>

        {/* Subtle Vignette Overlay Behind Text */}
        <div className="absolute inset-0 z-5 bg-gradient-radial from-transparent via-black/5 to-transparent"></div>
        <div className="absolute top-0 left-0 right-0 h-[70%] bg-gradient-to-b from-black/20 via-black/5 to-transparent z-5"></div>

        {/* Content - Centered with relative positioning */}
        <div className="relative z-10 max-w-5xl mx-auto text-center">

          {/* Massive Serif Headline */}
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl lg:text-8xl font-normal leading-[0.95] tracking-[-0.03em] mb-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <span className="text-black">Restoring our forests,</span><br />
            <span className="italic text-[#F5F5F0] font-light">one hectare at a time</span>
          </h1>

          {/* Centered Subtitle */}
          <p className="text-base md:text-lg text-white max-w-[600px] mx-auto mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            Generate Green Impact Certificates from real-world climate actions.
            No consultants. No guessing. Just deterministic, auditable verification
            powered by AI.
          </p>

          {/* Pill-Shaped Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
            <Link href="/onboarding">
              <Button size="lg" className="rounded-full px-8 h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95">
                Get Involved
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 border-2 border-primary/30 text-primary hover:bg-primary/5 font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 bg-background/60 backdrop-blur-sm">
                Explore Our Impact
              </Button>
            </a>
          </div>

          {/* Stats - Subtle & Organic */}
          <div className="grid grid-cols-3 gap-8 md:gap-12 max-w-2xl mx-auto opacity-0 animate-in fade-in duration-1000 delay-500" style={{ animationFillMode: 'forwards' }}>
            {[
              { value: "63%", label: "Faster Verification" },
              { value: "100%", label: "Auditable Proof" },
              { value: "0", label: "Manual Guesswork" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-[family-name:var(--font-playfair)] font-semibold text-primary mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section - Clean Card Layout */}
      <section className="py-24 md:py-32 px-6 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Climate Action Exists. <span className="italic text-accent">Execution is Broken.</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The infrastructure for climate verification is manual, expensive, and excludes those who need it most.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "⏳", title: "Manual Verification", desc: "Audits take weeks. Consultants charge thousands. Critical data gets lost in spreadsheets and email chains.", color: "from-red-500/10 to-orange-500/10" },
              { icon: "🔓", title: "Rampant Fraud", desc: "Double counting, ghost projects, and replay attacks continue to undermine trust in carbon markets.", color: "from-orange-500/10 to-amber-500/10" },
              { icon: "🚫", title: "MSMEs Excluded", desc: "Small businesses can't afford verification infrastructure. They're systematically locked out.", color: "from-amber-500/10 to-yellow-500/10" },
              { icon: "📊", title: "No Visibility", desc: "Governments lack real-time climate execution data. Policy decisions are made in the dark.", color: "from-yellow-500/10 to-red-500/10" },
            ].map((card) => (
              <div
                key={card.title}
                className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <p className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{card.icon}</p>
                  <h4 className="font-bold text-foreground mb-3 text-lg group-hover:text-primary transition-colors duration-300">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Two-Layer System */}
      <section id="features" className="py-24 md:py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">THE SOLUTION</Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Two-Layer System for <br /><span className="italic text-accent">Climate Execution</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Carbon UPI is the neutral infrastructure. GreenPe is your commercial interface.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu, title: "Carbon UPI Core",
                desc: "Deterministic, boring, invisible. Converts climate activity into machine-verifiable proof using strict, replayable pipelines.",
                features: ["Formula-based calculations", "Zero AI guessing", "Auditor-friendly design"],
                color: "from-blue-500/10 to-cyan-500/10"
              },
              {
                icon: Zap, title: "GreenPe SaaS", featured: true,
                desc: "Your commercial interface. Beautiful UX, modular workflows, and AI agents that orchestrate the entire verification process.",
                features: ["Multi-tenant compliance OS", "AI-powered automation", "API-first architecture"],
                color: "from-primary/10 to-accent/10"
              },
              {
                icon: FileCheck, title: "Green Impact Certificates",
                desc: "Non-financial, non-tradable proof of climate action. Machine-verifiable, cryptographically secured, and registry-ready.",
                features: ["Cryptographic hash sealing", "Complete audit trail", "CBAM compliance ready"],
                color: "from-emerald-500/10 to-green-500/10"
              },
            ].map((card) => (
              <div
                key={card.title}
                className={`group p-8 rounded-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden ${
                  card.featured
                    ? "bg-primary/5 border-2 border-primary/30 shadow-lg shadow-primary/10 hover:border-primary/50"
                    : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-primary/10"
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500">
                    <card.icon size={22} className="text-primary transition-all duration-500 group-hover:scale-110" strokeWidth={2} />
                  </div>
                  <h4 className="font-bold text-foreground mb-3 text-lg group-hover:text-primary transition-colors duration-300">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">{card.desc}</p>
                  <ul className="space-y-2.5">
                    {card.features.map((f, idx) => (
                      <li
                        key={f}
                        className="flex items-start gap-2.5 text-sm transform transition-all duration-300"
                        style={{ transitionDelay: `${idx * 50}ms` }}
                      >
                        <CheckCircle size={16} className="text-primary mt-0.5 shrink-0 group-hover:scale-110 transition-transform duration-300" strokeWidth={2.5} />
                        <span className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works – Pipeline */}
      <section id="how-it-works" className="py-24 md:py-32 px-6 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">THE PIPELINE</Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Seven Layers of <br /><span className="italic text-accent">Deterministic Verification</span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              { icon: Lock, title: "Identity Binding", desc: "Bind who + what + where + when. Every asset gets a unique fingerprint to prevent double counting.", color: "from-purple-500/10 to-indigo-500/10" },
              { icon: RefreshCw, title: "Data Ingestion", desc: "Sensors, satellites, manual entry. Every data point receives a trust score and source attribution.", color: "from-indigo-500/10 to-blue-500/10" },
              { icon: Cpu, title: "MRV Engine", desc: "Formula-based calculation. No guessing. Every methodology is deterministic and replayable.", active: true, color: "from-primary/10 to-accent/10" },
              { icon: Layers, title: "Audit Trail", desc: "Every calculation step is logged, cryptographically hashed, and independently verifiable.", color: "from-emerald-500/10 to-teal-500/10" },
              { icon: FileCheck, title: "GIC Generation", desc: "Machine-verifiable proof packages. Registry-ready exports with complete evidence chains.", color: "from-teal-500/10 to-cyan-500/10" },
            ].map((step, i) => (
              <div key={step.title} className="flex items-start gap-5 group">
                <div className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all duration-500 group-hover:scale-110 ${
                  step.active
                    ? "bg-primary text-primary-foreground shadow-md group-hover:shadow-xl"
                    : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
                }`}>
                  {i + 1}
                </div>
                <div className={`flex-1 p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 hover:shadow-xl relative overflow-hidden ${
                  step.active
                    ? "bg-primary/5 border-2 border-primary/30 hover:border-primary/50"
                    : "bg-card border border-border/50 hover:border-primary/30 hover:shadow-primary/10"
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2.5 mb-2">
                      <step.icon size={18} className={`transition-all duration-500 group-hover:scale-110 ${step.active ? "text-primary" : "text-muted-foreground group-hover:text-primary"}`} strokeWidth={2} />
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors duration-300">{step.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section id="impact" className="py-24 md:py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider">FOR EVERYONE</Badge>
            <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-4">
              Built for <span className="italic text-accent">Real Climate Actors</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌾", title: "Farmers & MSMEs", desc: "Register assets, connect sensors, and receive verified proof of climate impact without expensive consultants or complex paperwork.", role: "farmer", color: "from-amber-500/10 to-yellow-500/10" },
              { icon: "🏭", title: "Exporters", desc: "Generate CBAM-ready documentation instantly. Defend climate claims with machine-verifiable proof that stands up to regulatory scrutiny.", role: "exporter", color: "from-blue-500/10 to-indigo-500/10" },
              { icon: "🏛️", title: "Governments", desc: "Gain real-time visibility into national climate execution. Detect fraud early. Make data-driven policy decisions with confidence.", role: "government", color: "from-emerald-500/10 to-teal-500/10" },
            ].map((card) => (
              <div key={card.title} className="group p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 relative overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <p className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-500">{card.icon}</p>
                  <h4 className="font-bold text-foreground mb-3 text-lg group-hover:text-primary transition-colors duration-300">{card.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-5">{card.desc}</p>
                  <Link href={`/onboarding?role=${card.role}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary group-hover:gap-3 transition-all duration-300">
                    Start as {card.title.split(" ")[0]} <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - High Contrast */}
      <section className="py-24 md:py-32 px-6 bg-secondary/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-normal text-foreground mb-6">
            Ready to Verify Your <span className="italic text-accent">Climate Impact?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Join the pilot simulation and see how Carbon UPI + GreenPe transforms
            your climate reporting from manual chaos to automated certainty.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="rounded-full px-10 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base cursor-pointer shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95">
              Start Pilot Simulation <ArrowRight size={18} className="ml-2" strokeWidth={2.5} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer - Minimal & Clean */}
      <footer className="border-t border-border/50 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <Shield size={16} className="text-primary" />
                </div>
                <span className="font-bold text-lg text-foreground">GreenPe</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Proof is the product. Trust is the outcome. Built on Carbon UPI Infrastructure.
              </p>
            </div>

            <div className="flex gap-16">
              {[
                { title: "Product", links: ["Features", "How It Works", "Impact Stories"] },
                { title: "Company", links: ["About Us", "Careers", "Blog"] },
                { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
              ].map((col) => (
                <div key={col.title}>
                  <h5 className="font-bold text-sm text-foreground mb-4">{col.title}</h5>
                  <div className="flex flex-col gap-3">
                    {col.links.map((link) => (
                      <a key={link} href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{link}</a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">© 2026 GreenPe. Restoring forests, one hectare at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
