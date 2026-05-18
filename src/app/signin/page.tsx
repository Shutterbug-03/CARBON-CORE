"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Zap, ArrowRight, Loader2, User, Building2, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/providers/app-provider";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { user, completeOnboarding } = useApp();
  const [step, setStep] = useState<"who" | "details" | "loading">("who");
  const [intention, setIntention] = useState(""); // "new" | "returning"
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  // If already onboarded, redirect to dashboard
  if (user.isOnboarded) {
    router.replace("/dashboard");
    return null;
  }

  const handleGetStarted = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    setError(null);
    setStep("loading");

    // Log the visitor to Supabase via onboarding API
    try {
      await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: org.trim() || name.trim(),
          registrationId: `GP-VISIT-${Date.now()}`,
          region: "India",
          assetType: "Unspecified",
          assetDesc: `Sign-in: ${name.trim()} · ${phone || "no phone"} · ${intention}`,
        }),
      });
    } catch {
      // Non-blocking — continue even if logging fails
    }

    // Store in app context with minimal entity
    completeOnboarding(
      {
        id: "entity-" + Date.now(),
        type: intention || "visitor",
        name: org.trim() || name.trim(),
        registrationId: `GP-${Date.now()}`,
        location: { lat: 20.5937, lng: 78.9629, region: "India" },
        createdAt: new Date(),
      },
      {
        id: "asset-" + Date.now(),
        type: "Unspecified",
        ownerId: "self",
        description: "To be configured",
        metadata: { phone: phone || null, signinName: name.trim() },
        boundAt: new Date(),
      },
      `GP-CIH-${Date.now()}`
    );

    // Redirect to full onboarding if new, dashboard if returning
    if (intention === "new") {
      router.push("/onboarding");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#080d16] bg-grid-isometric flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 justify-center">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Zap size={22} className="text-black" />
          </div>
          <div>
            <p className="text-lg font-bold text-white">GreenPe</p>
            <p className="text-[10px] tracking-[0.2em] text-green-400/50 uppercase">Climate Compliance OS</p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-white/[0.03] border border-white/[0.07] backdrop-blur-xl rounded-2xl p-8">

          {step === "who" && (
            <div className="space-y-6">
              <div className="text-center">
                <h1 className="text-2xl font-black text-white">Get Started</h1>
                <p className="text-sm text-white/30 mt-2">Tell us who you are — takes 30 seconds</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: "new", label: "I'm new here", icon: User, desc: "First time — take me through setup" },
                  { id: "returning", label: "I've been here", icon: Building2, desc: "Familiar — take me to dashboard" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setIntention(opt.id); setStep("details"); }}
                    className="p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] hover:border-green-500/30 hover:bg-green-500/5 transition-all cursor-pointer text-left"
                  >
                    <opt.icon size={24} className="text-white/30 mb-3" />
                    <p className="text-sm font-bold text-white">{opt.label}</p>
                    <p className="text-[11px] text-white/25 mt-1">{opt.desc}</p>
                  </button>
                ))}
              </div>

              <div className="text-center">
                <p className="text-xs text-white/20">No password needed — just tell us who you are</p>
              </div>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-5">
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setStep("who")} className="text-white/20 hover:text-white/50 text-xs cursor-pointer">← Back</button>
                <div className="flex-1" />
                <Badge variant="outline" className="text-green-400 border-green-500/20 text-[10px]">
                  {intention === "new" ? "New User" : "Returning"}
                </Badge>
              </div>

              <div className="text-center mb-6">
                <h2 className="text-xl font-black text-white">Who should we say is visiting?</h2>
                <p className="text-xs text-white/30 mt-2">We log all access entries for audit & security</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Your Name *</label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
                    placeholder="e.g. Dharan Singh"
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Company / Organisation (optional)</label>
                  <Input
                    value={org}
                    onChange={(e) => setOrg(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
                    placeholder="e.g. Surat Textiles Pvt Ltd"
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15"
                  />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Mobile (optional, for verification)</label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleGetStarted()}
                    placeholder="+91 98765 43210"
                    className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15"
                  />
                </div>
              </div>

              {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2">{error}</p>}

              {/* Audit notice */}
              <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <Shield size={14} className="text-green-400 mt-0.5 shrink-0" />
                <p className="text-[10px] text-white/20 leading-relaxed">
                  Your entry is logged with timestamp and device metadata for platform security and audit compliance. No password stored.
                </p>
              </div>

              <Button
                onClick={handleGetStarted}
                className="w-full bg-green-500 text-black font-bold hover:bg-green-400 gap-2 shadow-lg shadow-green-500/20"
              >
                {intention === "new" ? "Start Setup" : "Enter Dashboard"} <ArrowRight size={14} />
              </Button>
            </div>
          )}

          {step === "loading" && (
            <div className="py-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Loader2 size={28} className="text-green-400 animate-spin" />
              </div>
              <p className="text-white font-semibold">Welcome, {name}!</p>
              <p className="text-sm text-white/30">Preparing your GreenPe environment...</p>
              <div className="flex flex-col gap-2 max-w-xs mx-auto mt-4">
                {["Logging entry", "Generating Climate ID", "Loading dashboard"].map((item, i) => (
                  <div key={item} className="flex items-center gap-2 text-xs text-white/30">
                    <CheckCircle size={12} className="text-green-400" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <Link href="/" className="text-xs text-white/20 hover:text-white/40 transition">← Back to GreenPe.com</Link>
        </div>
      </div>
    </div>
  );
}
