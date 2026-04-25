"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Wallet, LineChart, CreditCard, Shield, TrendingUp, ArrowRight,
  Code2, Lock, BadgeDollarSign, Banknote, AlertTriangle
} from "lucide-react";

const apiEndpoints = [
  { method: "GET", path: "/api/verify/gic/{ID}", desc: "Instant GIC verification — returns status, tCO₂e, methodology, confidence, hash", status: "Live" },
  { method: "GET", path: "/api/portfolio/{entityId}", desc: "Portfolio monitoring — real-time GIC status for all borrower's certificates", status: "Live" },
  { method: "POST", path: "/api/covenant/check", desc: "SLL KPI tracking — automated sustainability covenant check against thresholds", status: "Live" },
  { method: "GET", path: "/api/risk-score/{entityId}", desc: "AI Green Loan Risk Score (0–100) — updated monthly, feeds into credit model", status: "Beta" },
];

const finProducts = [
  {
    title: "Carbon Credit Marketplace",
    desc: "List verified GICs for sale — spot trading & forward contracts across Verra, Gold Standard, CCTS India",
    icon: BadgeDollarSign,
    status: "Phase 3",
    features: ["Spot & forward trading", "Multi-registry", "Retirement service", "Double-counting prevention"],
  },
  {
    title: "UPI Settlement",
    desc: "GIC-triggered DBT — government subsidy auto-released via Aadhaar-linked UPI when verified GIC issued",
    icon: Banknote,
    status: "Phase 3",
    features: ["Aadhaar-linked UPI payment", "Carbon credit sale settlement", "Zero transaction fees"],
  },
  {
    title: "Parametric Insurance",
    desc: "IoT data triggers payout — solar below 70% for 30 days = event, payout within 48 hours",
    icon: Shield,
    status: "Phase 3",
    features: ["Solar performance insurance", "EV fleet premium discount", "Carbon credit reversal protection"],
  },
];

const portfolioMetrics = [
  { label: "Borrowers Monitored", value: "142", trend: "+12" },
  { label: "Total Verified tCO₂e", value: "8,419", trend: "+340" },
  { label: "Covenant Compliance", value: "94%", trend: "+2%" },
  { label: "Avg Risk Score", value: "72/100", trend: "+3" },
];

export default function FinancePage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">Financial Services</h1>
        <p className="text-sm text-foreground/40 mt-1">Green finance API, carbon credits, UPI settlement & parametric insurance</p>
      </div>

      {/* Green Finance API */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2"><Code2 size={18} className="text-green-400" /> Green Finance API</CardTitle>
            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Live</Badge>
          </div>
          <p className="text-xs text-foreground/30">Bank-grade verification endpoints for green loan underwriting and portfolio monitoring</p>
        </CardHeader>
        <CardContent className="space-y-2">
          {apiEndpoints.map((ep) => (
            <div key={ep.path} className="flex items-start gap-3 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04] hover:border-foreground/[0.08] transition-colors">
              <Badge variant="outline" className={`font-mono text-[10px] shrink-0 mt-0.5 ${ep.method === "GET" ? "text-green-400 border-green-500/20" : "text-blue-400 border-blue-500/20"}`}>{ep.method}</Badge>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-mono font-medium text-foreground/70 truncate">{ep.path}</p>
                <p className="text-xs text-foreground/30 mt-0.5">{ep.desc}</p>
              </div>
              <Badge variant="outline" className={ep.status === "Live" ? "text-green-400 border-green-500/20" : "text-amber-400 border-amber-500/20"}>{ep.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Portfolio Metrics (Bank view) */}
      <div>
        <p className="text-xs tracking-[0.2em] text-foreground/20 uppercase font-semibold mb-3">Portfolio Overview (Bank Dashboard)</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {portfolioMetrics.map((m) => (
            <Card key={m.label}>
              <CardContent className="py-4 text-center">
                <p className="text-2xl font-black">{m.value}</p>
                <p className="text-xs text-foreground/30 mt-1">{m.label}</p>
                <p className="text-[10px] text-green-400 mt-1 font-semibold">{m.trend} this quarter</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Financial Products */}
      <div>
        <p className="text-xs tracking-[0.2em] text-foreground/20 uppercase font-semibold mb-3">Financial Products</p>
        <div className="grid md:grid-cols-3 gap-4">
          {finProducts.map((p) => (
            <Card key={p.title} className="hover:border-foreground/10 transition-colors relative overflow-hidden">
              <div className="absolute top-3 right-3"><Badge variant="outline" className="text-foreground/25 text-[9px]">{p.status}</Badge></div>
              <CardContent className="pt-6 pb-4 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-foreground/[0.04] flex items-center justify-center"><p.icon size={24} className="text-foreground/20" /></div>
                <div>
                  <p className="text-sm font-bold">{p.title}</p>
                  <p className="text-xs text-foreground/30 mt-1">{p.desc}</p>
                </div>
                <div className="space-y-1.5">
                  {p.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-xs text-foreground/40">
                      <div className="w-1 h-1 rounded-full bg-foreground/15" />{f}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Green Loan CTA */}
      <Card className="border-green-500/10 bg-gradient-to-r from-green-500/5 to-transparent">
        <CardContent className="py-5 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center"><Wallet size={24} className="text-green-400" /></div>
          <div className="flex-1">
            <p className="text-sm font-bold">Apply for a Green Loan</p>
            <p className="text-xs text-foreground/30 mt-1">Your verified GIC history qualifies you for sustainability-linked financing at preferential rates</p>
          </div>
          <Button className="bg-green-500 text-black hover:bg-green-400 gap-2">Generate Qualification Report <ArrowRight size={14} /></Button>
        </CardContent>
      </Card>
    </div>
  );
}
