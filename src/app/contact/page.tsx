"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ArrowRight, Mail, MapPin, Briefcase, Calendar, MessageSquare, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ContactPage() {
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
              <Link href="/about" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/70 hover:text-foreground" : "text-sm text-foreground/80 hover:text-foreground"}`}>About Us</Link>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className={`font-bold transition-all duration-700 ${isScrolled ? "text-[13px] text-foreground/80 hover:text-primary" : "text-sm text-foreground/90 hover:text-primary"}`}>
                Dashboard
              </Link>
              <span className={`font-bold text-primary transition-all duration-700 ${isScrolled ? "text-[13px]" : "text-sm"}`}>Contact Us</span>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 md:pt-48 pb-16 px-6 bg-gradient-to-b from-primary/5 to-background text-center">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-6 border-primary/30 text-primary px-4 py-1.5 text-xs font-bold tracking-wider animate-in fade-in slide-in-from-bottom-2">
            LET'S CONNECT
          </Badge>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-normal leading-tight tracking-[-0.02em] mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 text-foreground">
            Let's make climate action measurable, verifiable, and <span className="italic text-primary/80">trusted — together.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-150">
            Whether you’re exploring climate verification, looking to collaborate, or just want to learn more — we’d love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* Left Column - Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-3xl font-[family-name:var(--font-playfair)] mb-6 text-foreground">Get in Touch</h2>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Email us directly</p>
                  <a href="mailto:team@greenpe.in" className="text-lg font-bold text-foreground hover:text-primary transition-colors">team@greenpe.in</a>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors mt-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground font-medium mb-1">Location</p>
                  <p className="text-lg font-bold text-foreground">India</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><MessageSquare size={20} className="text-primary"/> Reach Out For:</h3>
              <div className="flex flex-wrap gap-3">
                {["Product demos", "Pilot projects", "Partnerships & collaborations", "ESG / compliance support", "Research or policy discussions"].map(item => (
                  <Badge key={item} variant="secondary" className="px-3 py-1.5 text-sm font-normal">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Work With Us</h3>
              <p className="text-muted-foreground mb-4">We're actively collaborating with:</p>
              <ul className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> MSMEs & enterprises</li>
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> Renewable energy companies</li>
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> EV & mobility operators</li>
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> Industrial businesses</li>
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> Financial institutions</li>
                <li className="flex items-center gap-2"><Target size={16} className="text-primary"/> Government & ecosystem partners</li>
              </ul>
              <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-xl italic text-foreground">
                If you're working on climate, sustainability, or energy—there's a strong possibility we can work together.
              </div>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="bg-card p-8 md:p-10 rounded-2xl border border-border shadow-xl">
            <h2 className="text-2xl font-[family-name:var(--font-playfair)] mb-2 text-foreground">Send a Message</h2>
            <p className="text-muted-foreground mb-8 text-sm">Fill out the form and our team will get back to you shortly.</p>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="first-name" className="text-sm font-medium text-foreground">First Name</label>
                  <input id="first-name" type="text" className="w-full flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Jane" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="last-name" className="text-sm font-medium text-foreground">Last Name</label>
                  <input id="last-name" type="text" className="w-full flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Doe" />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">Work Email</label>
                <input id="email" type="email" className="w-full flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="jane@company.com" />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium text-foreground">Company</label>
                <input id="company" type="text" className="w-full flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Acme Corp" />
              </div>

              <div className="space-y-2">
                <label htmlFor="interest" className="text-sm font-medium text-foreground">How can we help?</label>
                <select id="interest" className="w-full flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Select a topic...</option>
                  <option value="demo">Product Demo</option>
                  <option value="pilot">Pilot Project</option>
                  <option value="partnership">Partnership</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-foreground">Message</label>
                <textarea id="message" className="w-full flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Tell us about your organization and goals..." />
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button className="flex-1 h-12 rounded-full font-bold shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground">
                  Submit Inquiry <ArrowRight size={16} className="ml-2" />
                </Button>
                <Button variant="outline" className="flex-1 h-12 rounded-full font-bold border-2 border-primary/20 text-primary hover:bg-primary/5">
                  <Calendar size={16} className="mr-2" /> Schedule a Call
                </Button>
              </div>
            </form>
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
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
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
