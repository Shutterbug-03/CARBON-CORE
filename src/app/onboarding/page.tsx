"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Shield, ArrowRight, ArrowLeft, CheckCircle, Loader2, Building2,
  Factory, Truck, Sun, Leaf, Landmark, CreditCard, Zap, BarChart3,
  FileText, Globe, Target, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/providers/app-provider";
import { Suspense } from "react";

// ── STEP DATA ──────────────────────────────────────────────────

const industries = [
  "Textiles", "Steel", "Cement", "Pharma", "Auto Components", "Logistics",
  "Solar", "Wind", "Biogas", "EV / Electric Mobility", "Recycling / Waste",
  "Agriculture", "Chemicals", "Food Processing", "Others"
];

const exportMarkets = ["EU", "UK", "US", "Canada", "Middle East", "None"];

const revenueBands = [
  "Below ₹5 Cr", "₹5 Cr – ₹25 Cr", "₹25 Cr – ₹100 Cr",
  "₹100 Cr – ₹500 Cr", "₹500 Cr – ₹2,000 Cr", "Above ₹2,000 Cr"
];

const userTypes = [
  {
    id: "msme-exporter", label: "MSME / Exporter", icon: Truck, color: "from-blue-500 to-blue-600",
    desc: "I export to the EU or UK and need to prove my carbon footprint to my buyers"
  },
  {
    id: "msme-impact", label: "MSME / Impact Creator", icon: Sun, color: "from-green-500 to-green-600",
    desc: "I have solar panels / EVs / do recycling and want to earn from my green actions"
  },
  {
    id: "enterprise", label: "Large Enterprise", icon: Building2, color: "from-purple-500 to-purple-600",
    desc: "I am a listed company that needs ESG reporting and BRSR compliance"
  },
  {
    id: "bank", label: "Bank / Insurer", icon: CreditCard, color: "from-amber-500 to-amber-600",
    desc: "I provide green loans or insurance and need verified impact data from my borrowers"
  },
  {
    id: "government", label: "Government Body", icon: Landmark, color: "from-red-500 to-red-600",
    desc: "I run a subsidy scheme or climate programme and need to track verified claims"
  },
];

const goalsByType: Record<string, { id: string; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[]> = {
  "msme-exporter": [
    { id: "cbam", label: "CBAM Compliance", icon: Globe },
    { id: "brsr", label: "BRSR / ESG Report", icon: FileText },
    { id: "credits", label: "Generate Carbon Credits", icon: Leaf },
    { id: "green-finance", label: "Green Finance", icon: TrendingUp },
  ],
  "msme-impact": [
    { id: "solar", label: "Earn from Solar", icon: Sun },
    { id: "ev", label: "Earn from EV", icon: Truck },
    { id: "recycling", label: "Earn from Recycling", icon: Leaf },
    { id: "green-loan", label: "Get Verified for Green Loan", icon: CreditCard },
    { id: "subsidy", label: "Govt Subsidy Claim", icon: Landmark },
  ],
  "enterprise": [
    { id: "brsr", label: "BRSR Reporting", icon: FileText },
    { id: "ccts", label: "CCTS Compliance", icon: Shield },
    { id: "scope3", label: "Scope 3 Tracking", icon: BarChart3 },
    { id: "carbon-programme", label: "Carbon Credit Programme", icon: Leaf },
    { id: "esg-dashboard", label: "Internal ESG Dashboard", icon: Target },
  ],
  "bank": [
    { id: "underwriting", label: "Green Loan Underwriting", icon: CreditCard },
    { id: "portfolio", label: "Portfolio Monitoring", icon: BarChart3 },
    { id: "insurance", label: "Insurance Product", icon: Shield },
    { id: "parametric", label: "Parametric Trigger", icon: Zap },
  ],
  "government": [
    { id: "pm-surya", label: "PM Surya Ghar Scheme", icon: Sun },
    { id: "fame", label: "FAME II (EV Subsidy)", icon: Truck },
    { id: "gcp", label: "Green Credit Programme", icon: Leaf },
    { id: "ccts-oversight", label: "CCTS Oversight", icon: Shield },
    { id: "analytics", label: "Programme Analytics", icon: BarChart3 },
  ],
};

const firstOutputByType: Record<string, { title: string; desc: string; items: string[] }> = {
  "msme-exporter": {
    title: "Preliminary CBAM Carbon Footprint Estimate",
    desc: "Based on your industry and export markets, here's your estimated CBAM exposure:",
    items: [
      "Estimated carbon intensity: 0.023 tCO₂e/tonne for textile products",
      "EU carbon price impact: ~€760/quarter at €100/tonne",
      "3 critical data gaps identified with severity rating",
      "GreenPe can reduce your CBAM cost by up to 67% with verified GICs",
    ],
  },
  "msme-impact": {
    title: "Carbon Credit Revenue Potential",
    desc: "Based on your sector, here's what you could earn from verified green actions:",
    items: [
      "Estimated annual reduction: 37 tCO₂e from rooftop solar",
      "Carbon credit potential: ₹3.8L – ₹5.2L at current VCM prices",
      "Sample GIC certificate preview ready for download",
      "Registry submission (Verra/Gold Standard) timeline: 45 days",
    ],
  },
  "enterprise": {
    title: "BRSR Data Gap Analysis",
    desc: "Based on your profile, here's your BRSR readiness assessment:",
    items: [
      "Section A (General): 90% pre-populated from GSTIN data",
      "Section C - P6 (Environment): 4 critical KPIs missing",
      "Estimated completion time: 12 working days",
      "AI-drafted policy statements available for Section B",
    ],
  },
  "bank": {
    title: "Sample GIC Verification API Response",
    desc: "Here's what your integration will receive for each borrower verification:",
    items: [
      "GET /api/verify/gic/{ID} → returns JSON with tCO₂e, confidence, methodology",
      "Portfolio risk score example: 72/100 (Green) for sample borrower",
      "Covenant monitoring: real-time SLL KPI tracking with breach prediction",
      "Fraud detection: cross-checks GIC against registered assets + satellite imagery",
    ],
  },
  "government": {
    title: "Sample Programme Dashboard",
    desc: "Here's a preview of your programme monitoring infrastructure:",
    items: [
      "Live beneficiary tracking: 12,400 registered across 8 districts",
      "GIC-triggered DBT: ₹14.2 Cr disbursed automatically via UPI",
      "Fraud detection: ₹2.1 Cr in fraudulent claims blocked this quarter",
      "CAG audit report: auto-generated with full verification trail",
    ],
  },
};

function OnboardingContent() {
  const router = useRouter();
  const { completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    companyName: "", gstin: "", pan: "", udyam: "", mobile: "", email: "",
    industry: "", exportMarkets: [] as string[], revenueBand: "",
    userType: "", goal: "",
  });

  const totalSteps = 5;

  const handleComplete = async () => {
    setIsVerifying(true);
    setError(null);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.companyName || "GreenPe User",
          registrationId: formData.gstin || "DEMO-" + Date.now(),
          region: "India",
          assetType: formData.industry || "Solar",
          assetDesc: `${formData.userType} — ${formData.goal}`,
        }),
      });
      if (!res.ok) throw new Error("Onboarding failed");
      const entity = {
        id: "entity-" + Date.now(),
        type: formData.userType || "msme-exporter",
        name: formData.companyName || "GreenPe Demo",
        registrationId: formData.gstin || "DEMO-GP",
        location: { lat: 21.1702, lng: 72.8311, region: "India" },
        createdAt: new Date(),
      };
      const asset = { id: "asset-1", type: formData.industry || "Solar", ownerId: entity.id, description: formData.goal || "Impact", metadata: {} as Record<string, unknown>, boundAt: new Date() };
      const hash = "GP-CIH-" + Date.now();
      completeOnboarding(entity, asset, hash);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleExportMarket = (m: string) => {
    setFormData((prev) => ({
      ...prev,
      exportMarkets: prev.exportMarkets.includes(m) ? prev.exportMarkets.filter((x) => x !== m) : [...prev.exportMarkets, m],
    }));
  };

  return (
    <div className="min-h-screen bg-[#080d16] bg-grid-isometric flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl">
        {/* Progress Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg shadow-green-500/20">
            <Zap size={18} className="text-black" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">GreenPe Onboarding</p>
            <p className="text-xs text-white/30">Step {step + 1} of {totalSteps}</p>
          </div>
          <span className="text-xs text-white/20 font-mono">Climate Compliance OS</span>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-1.5 mb-8">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-green-500" : "bg-white/5"}`} />
          ))}
        </div>

        {/* ═══ STEP 1: Company Identity ═══ */}
        {step === 0 && (
          <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2"><Shield size={20} className="text-green-400" /> Company Identity</CardTitle>
              <CardDescription className="text-white/30">Verified via GSTIN & PAN — binds your climate actions to a legal entity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">Company / Organisation Name *</label>
                <Input value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} placeholder="e.g. Surat Textiles Private Limited" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">GSTIN *</label>
                  <div className="relative">
                    <Input value={formData.gstin} onChange={(e) => setFormData({ ...formData, gstin: e.target.value })} placeholder="24AADCS7412M1Z8" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15 pr-20" />
                    {formData.gstin.length > 10 && <Badge className="absolute right-2 top-2 bg-green-500/10 text-green-400 border-green-500/20 text-[9px]">VERIFIED ✓</Badge>}
                  </div>
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">PAN</label>
                  <Input value={formData.pan} onChange={(e) => setFormData({ ...formData, pan: e.target.value })} placeholder="AADCS7412M" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15" />
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-1.5 block">UDYAM / MSME Number (Optional)</label>
                <Input value={formData.udyam} onChange={(e) => setFormData({ ...formData, udyam: e.target.value })} placeholder="UDYAM-GJ-06-0044821" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Mobile (OTP Verified)</label>
                  <Input value={formData.mobile} onChange={(e) => setFormData({ ...formData, mobile: e.target.value })} placeholder="+91 98765 43210" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15" />
                </div>
                <div>
                  <label className="text-xs text-white/40 mb-1.5 block">Email</label>
                  <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="name@company.com" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/15" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ═══ STEP 2: Industry & Activity ═══ */}
        {step === 1 && (
          <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2"><Factory size={20} className="text-green-400" /> Industry & Activity</CardTitle>
              <CardDescription className="text-white/30">Auto-selects your MRV methodology and enables relevant compliance modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <label className="text-xs text-white/40 mb-2 block">Industry / Sector *</label>
                <div className="grid grid-cols-3 gap-2">
                  {industries.map((ind) => (
                    <button key={ind} onClick={() => setFormData({ ...formData, industry: ind })} className={`p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${formData.industry === ind ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/10 hover:text-white/60"}`}>
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block">Export Markets (Select all that apply)</label>
                <div className="flex flex-wrap gap-2">
                  {exportMarkets.map((m) => (
                    <button key={m} onClick={() => toggleExportMarket(m)} className={`px-4 py-2 rounded-full text-xs font-medium transition-all cursor-pointer border ${formData.exportMarkets.includes(m) ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/10"}`}>
                      {m} {formData.exportMarkets.includes(m) && "✓"}
                    </button>
                  ))}
                </div>
                {formData.exportMarkets.includes("EU") && (
                  <p className="text-[10px] text-green-400 mt-2 flex items-center gap-1"><CheckCircle size={10} /> CBAM module will be auto-enabled</p>
                )}
              </div>
              <div>
                <label className="text-xs text-white/40 mb-2 block">Annual Revenue Band</label>
                <div className="grid grid-cols-2 gap-2">
                  {revenueBands.map((rb) => (
                    <button key={rb} onClick={() => setFormData({ ...formData, revenueBand: rb })} className={`p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer border ${formData.revenueBand === rb ? "bg-green-500/10 border-green-500/30 text-green-400" : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/10"}`}>
                      {rb}
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ═══ STEP 3: User Type ═══ */}
        {step === 2 && (
          <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white">Who are you?</CardTitle>
              <CardDescription className="text-white/30">This determines which dashboard loads, which modules are enabled, and your first output</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {userTypes.map((ut) => (
                <button key={ut.id} onClick={() => setFormData({ ...formData, userType: ut.id, goal: "" })} className={`w-full flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer border text-left ${formData.userType === ut.id ? "bg-green-500/5 border-green-500/30" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ut.color} flex items-center justify-center shadow-lg shrink-0`}>
                    <ut.icon size={22} className="text-white" />
                  </div>
                  <div>
                    <p className={`text-sm font-bold ${formData.userType === ut.id ? "text-green-400" : "text-white/70"}`}>{ut.label}</p>
                    <p className="text-xs text-white/30 mt-0.5">{ut.desc}</p>
                  </div>
                  {formData.userType === ut.id && <CheckCircle size={18} className="text-green-400 shrink-0 mt-1 ml-auto" />}
                </button>
              ))}
            </CardContent>
          </Card>
        )}

        {/* ═══ STEP 4: Goal ═══ */}
        {step === 3 && (
          <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2"><Target size={20} className="text-green-400" /> What's your primary goal?</CardTitle>
              <CardDescription className="text-white/30">This narrows the modules shown on Day 1</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {(goalsByType[formData.userType] || goalsByType["msme-exporter"]).map((g) => (
                  <button key={g.id} onClick={() => setFormData({ ...formData, goal: g.id })} className={`flex items-center gap-3 p-4 rounded-xl transition-all cursor-pointer border ${formData.goal === g.id ? "bg-green-500/5 border-green-500/30" : "bg-white/[0.02] border-white/[0.06] hover:border-white/[0.12]"}`}>
                    <g.icon size={18} className={formData.goal === g.id ? "text-green-400" : "text-white/20"} />
                    <span className={`text-sm font-medium ${formData.goal === g.id ? "text-green-400" : "text-white/50"}`}>{g.label}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* ═══ STEP 5: First Output Preview ═══ */}
        {step === 4 && (
          <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-xl text-white flex items-center gap-2"><Zap size={20} className="text-green-400" /> Your First Output — Preview</CardTitle>
              <CardDescription className="text-white/30">Here's what GreenPe can do for you right now</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(() => {
                const output = firstOutputByType[formData.userType] || firstOutputByType["msme-exporter"];
                return (
                  <>
                    <div className="p-4 rounded-xl bg-green-500/5 border border-green-500/20">
                      <p className="text-sm font-bold text-green-400">{output.title}</p>
                      <p className="text-xs text-white/30 mt-1">{output.desc}</p>
                    </div>
                    <div className="space-y-2">
                      {output.items.map((item, i) => (
                        <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                          <CheckCircle size={14} className="text-green-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-white/50">{item}</span>
                        </div>
                      ))}
                    </div>
                    {formData.companyName && (
                      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <p className="text-[10px] text-white/20 mb-1">Your GreenPe Climate ID</p>
                        <p className="text-sm font-mono text-green-400 font-bold">GP-IND-2024-{formData.gstin?.slice(0, 2) || "XX"}-{formData.companyName.slice(0, 4).toUpperCase()}-SOL</p>
                      </div>
                    )}
                  </>
                );
              })()}
              {error && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg p-2">{error}</p>}
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          {step > 0 ? (
            <Button onClick={() => setStep(step - 1)} variant="outline" className="gap-2 bg-white/[0.03] border-white/[0.08] text-white/50 hover:bg-white/[0.06] hover:text-white cursor-pointer">
              <ArrowLeft size={14} /> Back
            </Button>
          ) : <div />}

          {step < totalSteps - 1 ? (
            <Button onClick={() => setStep(step + 1)} className="gap-2 bg-green-500 text-black font-semibold hover:bg-green-400 cursor-pointer shadow-lg shadow-green-500/20">
              Continue <ArrowRight size={14} />
            </Button>
          ) : (
            <Button onClick={handleComplete} disabled={isVerifying} className="gap-2 bg-green-500 text-black font-semibold hover:bg-green-400 cursor-pointer shadow-lg shadow-green-500/20 min-w-[180px]">
              {isVerifying ? <><Loader2 size={14} className="animate-spin" /> Activating...</> : <>Launch Dashboard <ArrowRight size={14} /></>}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080d16] flex items-center justify-center"><Loader2 className="animate-spin text-green-400" /></div>}>
      <OnboardingContent />
    </Suspense>
  );
}
