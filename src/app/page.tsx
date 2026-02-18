"use client";

import Link from "next/link";
import { Shield, Zap, FileCheck, ArrowRight, CheckCircle, Cpu, Layers, Lock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Shield size={18} className="text-primary" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-tight">CarbonCore</span>
              <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase">Infrastructure</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
            <a href="#agents" className="text-sm text-muted-foreground hover:text-foreground transition-colors">AI Agents</a>
          </div>
          <Link href="/onboarding">
            <Button className="gap-2 cursor-pointer">Get Started <ArrowRight size={14} /></Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="outline" className="mb-6 gap-2 animate-fade-in">
            <Shield size={12} /> Built on Carbon UPI Infrastructure
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up">
            Stop Drowning in
            <br />
            <span className="text-gradient">Manual Reporting.</span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            GreenPe converts your real-world climate actions into machine-verifiable
            proof through AI-powered automation. No guessing. No consultants.
            Just deterministic, auditable verification.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/onboarding">
              <Button size="lg" className="gap-2 text-base cursor-pointer">
                Start Pilot Simulation <ArrowRight size={16} />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg" className="text-base cursor-pointer">Watch Demo</Button>
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            {[
              { value: "60%", label: "Faster Verification" },
              { value: "100%", label: "Auditable Proof" },
              { value: "Zero", label: "Manual Guesswork" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Visual */}
        <div className="max-w-md mx-auto mt-16 flex items-center justify-center gap-4">
          {[
            { icon: "📡", label: "Sensors" },
            { icon: "🔬", label: "MRV Engine", active: true },
            { icon: "📜", label: "Certificate" },
          ].map((node, i) => (
            <div key={node.label} className="flex items-center gap-4">
              <div className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${node.active ? "border-primary bg-primary/10" : "border-border bg-card"}`}>
                <span className="text-2xl">{node.icon}</span>
                <span className="text-xs text-muted-foreground">{node.label}</span>
              </div>
              {i < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          ))}
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Climate Action Exists. <span className="text-gradient">Execution is Broken.</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: "⏳", title: "Verification is Manual", desc: "Audits take weeks. Consultants charge thousands. Data gets lost in spreadsheets." },
              { icon: "🔓", title: "Fraud is Common", desc: "Double counting, ghost projects, and replay attacks undermine trust." },
              { icon: "🚫", title: "MSMEs are Excluded", desc: "Small businesses can't afford verification. They're locked out of carbon markets." },
              { icon: "📊", title: "Governments Can't See", desc: "No real-time visibility into climate execution. Policy decisions lack data." },
            ].map((card) => (
              <div key={card.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all">
                <p className="text-3xl mb-3">{card.icon}</p>
                <h4 className="font-semibold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">The Solution</Badge>
            <h2 className="text-3xl font-bold">
              Two-Layer System for <br /><span className="text-gradient">Climate Execution</span>
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Carbon UPI is the neutral infrastructure. GreenPe is your commercial interface.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Cpu, title: "Carbon UPI Core",
                desc: "Deterministic, boring, invisible. Converts climate activity into machine-verifiable proof using strict, replayable pipelines.",
                features: ["Formula-based calculations", "No AI guessing", "Auditor-friendly"],
              },
              {
                icon: Zap, title: "GreenPe SaaS", featured: true,
                desc: "Your commercial interface. Beautiful UX, modular workflows, and AI agents that orchestrate the entire process.",
                features: ["Multi-tenant compliance OS", "AI-powered automation", "API-first architecture"],
              },
              {
                icon: FileCheck, title: "Green Impact Certificates",
                desc: "Non-financial, non-tradable proof of climate action. Machine-verifiable and registry-ready.",
                features: ["Cryptographic hash", "Audit trail included", "CBAM compliant"],
              },
            ].map((card) => (
              <div key={card.title} className={`p-6 rounded-xl border transition-all ${card.featured ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:border-primary/30"}`}>
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <card.icon size={20} className="text-primary" />
                </div>
                <h4 className="font-semibold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                <ul className="space-y-2">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={14} className="text-primary" /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works – Pipeline */}
      <section id="how-it-works" className="py-20 px-6 border-t border-border/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">The Pipeline</Badge>
            <h2 className="text-3xl font-bold">
              7 Layers of <br /><span className="text-gradient">Deterministic Verification</span>
            </h2>
          </div>
          <div className="space-y-4">
            {[
              { icon: Lock, title: "Identity Binding", desc: "Bind who + what + where + when. Prevent double counting." },
              { icon: RefreshCw, title: "Data Ingestion", desc: "Sensors, satellites, manual entry. Every point gets a trust score." },
              { icon: Cpu, title: "MRV Engine", desc: "Formula-based calculation. No guessing. Methodology-driven.", active: true },
              { icon: Layers, title: "Audit Trail", desc: "Every step is logged, hashed, and replayable." },
              { icon: FileCheck, title: "GIC Generation", desc: "Machine-verifiable proof. Registry-ready output." },
            ].map((step, i) => (
              <div key={step.title} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${step.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                  {i + 1}
                </div>
                <div className={`flex-1 p-4 rounded-xl border ${step.active ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <step.icon size={16} className={step.active ? "text-primary" : "text-muted-foreground"} />
                    <h4 className="font-semibold text-sm">{step.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Agents */}
      <section id="agents" className="py-20 px-6 border-t border-border/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">AI Autopilot</Badge>
            <h2 className="text-3xl font-bold">
              Meet Your <br /><span className="text-gradient">Climate Agents</span>
            </h2>
            <p className="text-muted-foreground mt-3">AI for automation, validation, and orchestration — never for guessing emissions.</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { avatar: "🤖", name: "Identity Agent", role: "The Onboarding Concierge", desc: "Helps users fill forms, verify documents, and complete KYC seamlessly." },
              { avatar: "📡", name: "Ingestion Agent", role: "The Data Watchdog", desc: "Monitors sensor streams, flags gaps, classifies sources, ensures integrity." },
              { avatar: "🔍", name: "Audit Agent", role: "The Compliance Officer", desc: "Runs deterministic checks, detects anomalies, validates methodology." },
              { avatar: "📋", name: "Reporting Agent", role: "The Document Clerk", desc: "Generates GICs, packages evidence, prepares registry-ready exports." },
            ].map((agent) => (
              <div key={agent.name} className="p-6 rounded-xl border border-border bg-card text-center hover:border-primary/30 transition-all">
                <p className="text-3xl mb-3">{agent.avatar}</p>
                <p className="font-semibold text-sm">{agent.name}</p>
                <p className="text-xs text-primary mb-2">{agent.role}</p>
                <p className="text-xs text-muted-foreground">{agent.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Users Section */}
      <section className="py-20 px-6 border-t border-border/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="outline" className="mb-4">For Everyone</Badge>
            <h2 className="text-3xl font-bold">Built for <br /><span className="text-gradient">Real Climate Actors</span></h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌾", title: "Farmers & MSMEs", desc: "Register assets, connect sensors, get verified proof of your climate impact without expensive consultants.", role: "farmer" },
              { icon: "🏭", title: "Exporters", desc: "Generate CBAM-ready documentation, defend your climate claims with machine-verifiable proof.", role: "exporter" },
              { icon: "🏛️", title: "Governments", desc: "Get real-time visibility into climate execution. Detect fraud. Make data-driven policy.", role: "government" },
            ].map((card) => (
              <div key={card.title} className="p-6 rounded-xl border border-border bg-card hover:border-primary/30 transition-all group">
                <p className="text-3xl mb-3">{card.icon}</p>
                <h4 className="font-semibold mb-2">{card.title}</h4>
                <p className="text-sm text-muted-foreground mb-4">{card.desc}</p>
                <Link href={`/onboarding?role=${card.role}`} className="inline-flex items-center gap-1 text-sm text-primary group-hover:gap-2 transition-all">
                  Start as {card.title.split(" ")[0]} <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center p-12 rounded-2xl border border-primary/20 bg-primary/5">
          <h2 className="text-2xl font-bold mb-3">Ready to Verify Your Climate Impact?</h2>
          <p className="text-muted-foreground mb-8">
            Join the pilot simulation and see how Carbon UPI + GreenPe transforms your climate reporting.
          </p>
          <Link href="/onboarding">
            <Button size="lg" className="gap-2 text-base cursor-pointer">
              Start Pilot Simulation <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
                <Shield size={14} className="text-primary" />
              </div>
              <span className="font-bold text-sm">CarbonCore</span>
            </div>
            <p className="text-sm text-muted-foreground">Proof is the product. Trust is the outcome.</p>
          </div>
          <div className="flex gap-12">
            {[
              { title: "Product", links: ["Features", "How It Works", "AI Agents"] },
              { title: "Company", links: ["About", "Careers", "Blog"] },
              { title: "Legal", links: ["Privacy Policy", "Terms of Service"] },
            ].map((col) => (
              <div key={col.title}>
                <h5 className="font-semibold text-sm mb-3">{col.title}</h5>
                <div className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{link}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground">© 2026 GreenPe. Built on Carbon UPI Infrastructure.</p>
        </div>
      </footer>
    </div>
  );
}
