"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Landmark, Sun, Bike, Leaf, Droplets, MapPin, Users, IndianRupee,
  Shield, AlertTriangle, CheckCircle2, TrendingUp, BarChart3, Eye
} from "lucide-react";

const dbtSchemes = [
  {
    name: "PM Surya Ghar",
    icon: Sun,
    desc: "Rooftop solar MRV → GIC → UPI payment to beneficiary's Aadhaar-linked account",
    beneficiaries: "12,400",
    gicsIssued: "8,720",
    subsidyPaid: "₹14.2 Cr",
    status: "Active",
  },
  {
    name: "FAME II (EV)",
    icon: Bike,
    desc: "Telematics-verified EV usage → GIC → subsidy claim for electric vehicle adoption",
    beneficiaries: "3,200",
    gicsIssued: "2,140",
    subsidyPaid: "₹4.8 Cr",
    status: "Active",
  },
  {
    name: "Green Credit Programme",
    icon: Leaf,
    desc: "Afforestation / water / waste MRV → GCP credit → DBT payment",
    beneficiaries: "890",
    gicsIssued: "560",
    subsidyPaid: "₹1.2 Cr",
    status: "Active",
  },
  {
    name: "State Solar Subsidy",
    icon: Droplets,
    desc: "Configurable per state — custom MRV parameters for state-level solar schemes",
    beneficiaries: "—",
    gicsIssued: "—",
    subsidyPaid: "—",
    status: "Phase 2",
  },
];

const claimsWorkflow = [
  { step: 1, label: "Beneficiary Registers", desc: "Aadhaar + GSTIN + asset details → CIH generated", icon: Users },
  { step: 2, label: "Asset Connected", desc: "Inverter API or photo upload of smart meter reading", icon: Sun },
  { step: 3, label: "MRV Runs", desc: "kWh generated × grid EF = tCO₂e → GIC issued", icon: BarChart3 },
  { step: 4, label: "GIC Triggers Payment", desc: "DBT system receives GIC → UPI credit to beneficiary", icon: IndianRupee },
];

const fraudAlerts = [
  { type: "warning", msg: "Same GPS coordinates registered for 3 different solar installations in Ahmedabad", time: "2h ago" },
  { type: "critical", msg: "Generation reading 340% above nameplate capacity — Rajkot district ID #44821", time: "5h ago" },
  { type: "info", msg: "Aadhaar mismatch flagged for 12 beneficiaries in Surat taluka — manual review pending", time: "1d ago" },
];

const programmeDashboard = [
  { label: "Total Beneficiaries", value: "16,490", icon: Users },
  { label: "GICs Issued", value: "11,420", icon: CheckCircle2 },
  { label: "Subsidy Disbursed", value: "₹20.2 Cr", icon: IndianRupee },
  { label: "Fraud Blocked", value: "₹2.1 Cr", icon: Shield },
];

export default function GovernmentPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Government Modules</h1>
          <p className="text-sm text-foreground/40 mt-1">White-label programme infrastructure for climate schemes — verification, tracking & fraud prevention</p>
        </div>
        <Badge variant="outline" className="text-foreground/50 border-foreground/10 text-xs px-3 py-1">Secretary-Level Access</Badge>
      </div>

      {/* Programme Dashboard Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {programmeDashboard.map((m) => (
          <Card key={m.label}>
            <CardContent className="py-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><m.icon size={18} className="text-green-400" /></div>
              <div>
                <p className="text-lg font-black">{m.value}</p>
                <p className="text-[10px] text-foreground/30">{m.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* DBT Schemes */}
      <div>
        <p className="text-xs tracking-[0.2em] text-foreground/20 uppercase font-semibold mb-3">DBT Schemes Available</p>
        <div className="grid md:grid-cols-2 gap-4">
          {dbtSchemes.map((s) => (
            <Card key={s.name} className="hover:border-foreground/10 transition-colors">
              <CardContent className="py-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center"><s.icon size={22} className="text-green-400" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{s.name}</p>
                      <Badge variant="outline" className={s.status === "Active" ? "text-green-400 border-green-500/20 text-[9px]" : "text-foreground/30 text-[9px]"}>{s.status}</Badge>
                    </div>
                    <p className="text-xs text-foreground/30 mt-1">{s.desc}</p>
                  </div>
                </div>
                {s.status === "Active" && (
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: "Beneficiaries", value: s.beneficiaries },
                      { label: "GICs Issued", value: s.gicsIssued },
                      { label: "Subsidy Paid", value: s.subsidyPaid },
                    ].map((m) => (
                      <div key={m.label} className="text-center px-2 py-2 rounded-lg bg-foreground/[0.02] border border-foreground/[0.04]">
                        <p className="text-sm font-bold">{m.value}</p>
                        <p className="text-[9px] text-foreground/20">{m.label}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subsidy Claims Workflow */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Subsidy Claims Workflow — GIC → DBT → UPI</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {claimsWorkflow.map((w, i) => (
              <div key={w.step} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-black font-bold text-sm shrink-0">{w.step}</div>
                <div>
                  <p className="text-sm font-semibold">{w.label}</p>
                  <p className="text-xs text-foreground/30 mt-0.5">{w.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fraud Detection Feed */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2"><Shield size={16} className="text-amber-400" /> Fraud Detection Feed</CardTitle>
            <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[9px]">AI-Monitored</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {fraudAlerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${a.type === "critical" ? "border-red-500/20 bg-red-500/[0.02]" : a.type === "warning" ? "border-amber-500/20 bg-amber-500/[0.02]" : "border-foreground/[0.04] bg-foreground/[0.01]"}`}>
              <AlertTriangle size={14} className={`mt-0.5 shrink-0 ${a.type === "critical" ? "text-red-400" : a.type === "warning" ? "text-amber-400" : "text-foreground/20"}`} />
              <div className="flex-1">
                <p className="text-xs text-foreground/60">{a.msg}</p>
                <p className="text-[10px] text-foreground/20 mt-1">{a.time}</p>
              </div>
              <Button size="sm" variant="outline" className="text-xs h-7 shrink-0">Investigate</Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Programme Map Placeholder */}
      <Card className="border-foreground/[0.06]">
        <CardContent className="py-12 text-center">
          <MapPin size={32} className="mx-auto text-foreground/10 mb-3" />
          <p className="text-sm text-foreground/30 font-medium">Live Beneficiary Map — District-level tracking</p>
          <p className="text-xs text-foreground/15 mt-1">Color-coded by GIC issuance rate · Launching with state solar scheme integration</p>
        </CardContent>
      </Card>
    </div>
  );
}
