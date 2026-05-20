"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe, FileDown, CheckCircle2, Clock, AlertCircle, Shield, FileText,
  AlertTriangle, Target, TrendingDown, BarChart3
} from "lucide-react";
import { useApp } from "@/providers/app-provider";

const complianceTabs = [
  { id: "cbam" as const, label: "EU CBAM", badge: "MVP" },
  { id: "brsr" as const, label: "BRSR", badge: "Phase 2" },
  { id: "ccts" as const, label: "CCTS India", badge: "Phase 2" },
  { id: "gcp" as const, label: "Green Credit", badge: "Phase 2" },
  { id: "global" as const, label: "Global (GRI/CDP/TCFD)", badge: "Phase 3" },
];

const initialCbamQuarters = [
  { quarter: "Q1 FY2024-25", status: "Submitted", products: 4, tCO2e: "12.4", deadline: "31-Jul-2024" },
  { quarter: "Q2 FY2024-25", status: "Submitted", products: 3, tCO2e: "9.8", deadline: "31-Oct-2024" },
  { quarter: "Q3 FY2024-25", status: "Ready", products: 5, tCO2e: "14.1", deadline: "31-Jan-2025" },
  { quarter: "Q4 FY2024-25", status: "In Progress", products: 2, tCO2e: "—", deadline: "30-Apr-2025" },
];

const cbamProducts = [
  { hsn: "5208", product: "Cotton Woven Fabric", intensity: "0.023 tCO₂e/tonne", euBenchmark: "0.031", status: "Below EU avg ✓" },
  { hsn: "5209", product: "Cotton Heavy Fabric", intensity: "0.028 tCO₂e/tonne", euBenchmark: "0.035", status: "Below EU avg ✓" },
  { hsn: "5210", product: "Blended Polyester", intensity: "0.041 tCO₂e/tonne", euBenchmark: "0.038", status: "Above EU avg ⚠" },
];

const cbamDataGaps = [
  { severity: "high", item: "March electricity bill — affects 3 shipments to Germany", action: "Upload DGVCL bill" },
  { severity: "medium", item: "Scope 3 transport data for Jan containers", action: "Contact logistics partner" },
  { severity: "low", item: "Boiler natural gas meter reading (Feb)", action: "Submit reading" },
];

const brsrSections = [
  { section: "Section A", title: "General Disclosures", completed: 8, total: 8, status: "complete" },
  { section: "Section B", title: "Management & Process", completed: 6, total: 8, status: "on-track" },
  { section: "Section C - P1", title: "Ethics & Transparency", completed: 4, total: 5, status: "on-track" },
  { section: "Section C - P2", title: "Product Safety", completed: 3, total: 4, status: "in-progress" },
  { section: "Section C - P6", title: "Environment (GHG/Energy)", completed: 5, total: 9, status: "in-progress" },
  { section: "Section C - P7", title: "Policy Advocacy", completed: 2, total: 3, status: "on-track" },
];

const frameworks = [
  { id: "gri", name: "GRI Standards", sub: "GRI 305 (Emissions) + 302 (Energy)", completed: 10, total: 10, status: "complete" },
  { id: "cdp", name: "CDP Climate", sub: "Questionnaire — score optimization", completed: 14, total: 18, status: "on-track" },
  { id: "tcfd", name: "TCFD", sub: "Governance, Strategy, Risk, Metrics", completed: 6, total: 11, status: "in-progress" },
  { id: "sbti", name: "SBTi", sub: "Target setting & progress tracking", completed: 2, total: 8, status: "in-progress" },
  { id: "csrd", name: "CSRD / ESRS", sub: "EU corporate reporting — double materiality", completed: 3, total: 15, status: "in-progress" },
];

export default function CompliancePage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"cbam" | "brsr" | "ccts" | "gcp" | "global">("cbam");
  const [quarters, setQuarters] = useState(initialCbamQuarters);
  const [offsetPct, setOffsetPct] = useState(67);
  const [cbamCost, setCbamCost] = useState(760);

  useEffect(() => {
    async function loadEmissionsSummary() {
      try {
        const entityId = user.entity?.id || "";
        const res = await fetch(`/api/emissions/summary?entityId=${entityId}`);
        if (res.ok) {
          const data = await res.json();
          const dbOffset = data.scope2?.offsetSaved || 0;
          if (dbOffset > 0) {
            const reduction = Math.min(99, Math.round((dbOffset / 14.066) * 100)) || 67;
            setOffsetPct(reduction);
            setCbamCost(Math.round(2300 * (1 - reduction / 100)));
            setQuarters(prev => prev.map(q => 
              q.quarter === "Q3 FY2024-25" 
                ? { ...q, tCO2e: dbOffset.toFixed(1) } 
                : q
            ));
          }
        }
      } catch (err) {
        console.error("Failed to load emissions summary for compliance page:", err);
      }
    }
    loadEmissionsSummary();
  }, [user.entity?.id]);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500 p-4 md:p-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Compliance Suite</h1>
          <p className="text-sm text-foreground/40 mt-1">One-click generation of every climate compliance document — same GIC/MRV data powers all reports</p>
        </div>
        <Button className="bg-green-500 text-black font-semibold hover:bg-green-400 gap-2 text-sm shadow-lg shadow-green-500/20 cursor-pointer"><FileDown size={14} /> Export All Reports</Button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] p-1 rounded-xl overflow-x-auto">
        {complianceTabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "bg-green-500 text-black shadow" : "text-foreground/40 hover:text-foreground/70"}`}>
            {tab.label}
            {tab.badge !== "MVP" && <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-black/10 text-black/60" : "bg-foreground/[0.05] text-foreground/20"}`}>{tab.badge}</span>}
          </button>
        ))}
      </div>

      {/* ═══ CBAM TAB ═══ */}
      {activeTab === "cbam" && (
        <div className="space-y-5">
          {/* Price Impact Banner */}
          <Card className="bg-gradient-to-r from-amber-500/5 to-transparent border-amber-500/10">
            <CardContent className="py-4 flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center border border-amber-500/20"><Target size={18} className="text-amber-400" /></div>
              <div className="flex-1">
                <p className="text-sm font-bold">EU Carbon Price Impact</p>
                <p className="text-xs text-foreground/30">At €100/tonne, CBAM cost for your textile exports: <span className="text-amber-400 font-bold">€{cbamCost}/quarter</span> · Solar GICs reduce this by <span className="text-green-400 font-bold">{offsetPct}%</span></p>
              </div>
              <Badge className="bg-green-500/10 text-green-400 border-green-500/20">GIC Offset Active</Badge>
            </CardContent>
          </Card>

          {/* Quarterly Reports */}
          <div>
            <p className="text-xs tracking-[0.2em] text-foreground/20 uppercase font-semibold mb-3">Quarterly CBAM Reports</p>
            <div className="grid md:grid-cols-2 gap-3">
              {quarters.map((q) => (
                <Card key={q.quarter} className="hover:border-foreground/10 transition-colors">
                  <CardContent className="py-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${q.status === "Submitted" ? "bg-green-500/10" : q.status === "Ready" ? "bg-blue-500/10" : "bg-amber-500/10"}`}>
                      {q.status === "Submitted" ? <CheckCircle2 size={18} className="text-green-400" /> : q.status === "Ready" ? <FileText size={18} className="text-blue-400" /> : <Clock size={18} className="text-amber-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{q.quarter}</p>
                      <p className="text-xs text-foreground/30">{q.products} products · {q.tCO2e} tCO₂e · Due: {q.deadline}</p>
                    </div>
                    <Badge variant="outline" className={q.status === "Submitted" ? "text-green-400 border-green-500/20" : q.status === "Ready" ? "text-blue-400 border-blue-500/20" : "text-amber-400 border-amber-500/20"}>{q.status}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* EU Benchmark Comparison */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2 text-white/80"><BarChart3 size={16} className="text-foreground/30" /> Product Carbon Intensity vs EU Benchmark</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {cbamProducts.map((p) => (
                  <div key={p.hsn} className="flex items-center gap-4 p-3 rounded-xl bg-foreground/[0.02] border border-foreground/[0.04]">
                    <Badge variant="outline" className="font-mono text-[10px] shrink-0">{p.hsn}</Badge>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{p.product}</p>
                      <p className="text-xs text-foreground/30">Your intensity: {p.intensity} · EU avg: {p.euBenchmark} tCO₂e/tonne</p>
                    </div>
                    <Badge variant="outline" className={p.status.includes("Below") ? "text-green-400 border-green-500/20 text-[10px]" : "text-amber-400 border-amber-500/20 text-[10px]"}>{p.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Data Gaps */}
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2 text-white/80"><AlertTriangle size={16} className="text-amber-400" /> Data Gap Identifier</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {cbamDataGaps.map((g, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${g.severity === "high" ? "border-red-500/20 bg-red-500/[0.02]" : g.severity === "medium" ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-foreground/[0.04]"}`}>
                  <div className={`w-2 h-2 rounded-full shrink-0 ${g.severity === "high" ? "bg-red-400" : g.severity === "medium" ? "bg-amber-400" : "bg-foreground/15"}`} />
                  <div className="flex-1"><p className="text-xs text-foreground/60">{g.item}</p></div>
                  <Button size="sm" variant="outline" className="text-xs h-7 shrink-0 cursor-pointer">{g.action}</Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Cost Comparison */}
          <Card className="border-green-500/10 bg-green-500/[0.02]">
            <CardContent className="py-4 flex items-center gap-4">
              <TrendingDown size={18} className="text-green-400 shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Cost Comparison</p>
                <p className="text-xs text-foreground/30">This CBAM report would cost <span className="line-through text-foreground/15">₹18L</span> from a consultant. GreenPe cost: <span className="text-green-400 font-bold">₹6L/yr</span> — all 4 quarters included.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ BRSR TAB ═══ */}
      {activeTab === "brsr" && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-blue-500/5 to-transparent border-blue-500/10">
            <CardContent className="py-4">
              <p className="text-sm font-bold">SEBI BRSR Reporting — Auto-populated from GIC/MRV Data</p>
              <p className="text-xs text-foreground/30 mt-1">Section C Performance metrics filled automatically from your emission tracking data. AI drafts policy statements.</p>
            </CardContent>
          </Card>
          <div className="space-y-2">
            {brsrSections.map((s) => {
              const pct = Math.round((s.completed / s.total) * 100);
              return (
                <Card key={s.section} className="hover:border-foreground/10 transition-colors">
                  <CardContent className="py-3 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${s.status === "complete" ? "bg-green-500/10" : s.status === "on-track" ? "bg-blue-500/10" : "bg-amber-500/10"}`}>
                      {s.status === "complete" ? <CheckCircle2 size={14} className="text-green-400" /> : s.status === "on-track" ? <Clock size={14} className="text-blue-400" /> : <AlertCircle size={14} className="text-amber-400" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white/80">{s.section} — {s.title}</p>
                      <div className="flex items-center gap-2 mt-1"><div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06]"><div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} /></div><span className="text-[10px] text-foreground/25">{s.completed}/{s.total}</span></div>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs h-7 cursor-pointer">Fill</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ CCTS TAB ═══ */}
      {activeTab === "ccts" && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-purple-500/5 to-transparent border-purple-500/10">
            <CardContent className="py-5 text-center">
              <Shield size={32} className="mx-auto text-purple-400/30 mb-3" />
              <p className="text-sm font-bold">India Carbon Credit Trading Scheme (CCTS)</p>
              <p className="text-xs text-foreground/30 mt-1">PAT scheme monitoring · BEE registry integration · Credit surplus/deficit tracking</p>
              <Badge variant="outline" className="mt-3 text-foreground/30">Launching Phase 2</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ GREEN CREDIT TAB ═══ */}
      {activeTab === "gcp" && (
        <div className="space-y-4">
          <Card className="bg-gradient-to-r from-emerald-500/5 to-transparent border-emerald-500/10">
            <CardContent className="py-5 text-center">
              <Globe size={32} className="mx-auto text-emerald-400/30 mb-3" />
              <p className="text-sm font-bold">Green Credit Programme</p>
              <p className="text-xs text-foreground/30 mt-1">PM Surya Ghar · Afforestation · Water conservation · Waste management · Sustainable agriculture</p>
              <Badge variant="outline" className="mt-3 text-foreground/30">Launching Phase 2</Badge>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ═══ GLOBAL TAB ═══ */}
      {activeTab === "global" && (
        <div className="space-y-3">
          {frameworks.map((fw) => {
            const pct = Math.round((fw.completed / fw.total) * 100);
            return (
              <Card key={fw.id} className="hover:border-foreground/10 transition-colors">
                <CardContent className="py-4 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${fw.status === "complete" ? "bg-green-500/10" : fw.status === "on-track" ? "bg-blue-500/10" : "bg-amber-500/10"}`}>
                    <Globe size={18} className={fw.status === "complete" ? "text-green-400" : fw.status === "on-track" ? "text-blue-400" : "text-amber-400"} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-white/80">{fw.name}</p>
                    <p className="text-xs text-foreground/30">{fw.sub}</p>
                    <div className="flex items-center gap-2 mt-1.5"><div className="flex-1 h-1.5 rounded-full bg-foreground/[0.06]"><div className="h-full rounded-full bg-green-500" style={{ width: `${pct}%` }} /></div><span className="text-[10px] text-foreground/25 font-mono">{pct}%</span></div>
                  </div>
                  <Badge variant="outline" className={fw.status === "complete" ? "text-green-400 border-green-500/20" : fw.status === "on-track" ? "text-blue-400 border-blue-500/20" : "text-amber-400 border-amber-500/20"}>{fw.status}</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
