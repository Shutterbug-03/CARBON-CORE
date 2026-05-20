"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/providers/app-provider";
import {
  BarChart3, Factory, Zap, Truck, TrendingDown, TrendingUp,
  ArrowDown, ArrowUp, Flame, Droplets, Building2
} from "lucide-react";

const scopeData = {
  scope1: {
    total: 4.087,
    change: -12.3,
    sources: [
      { name: "DG Set — Diesel Combustion", value: 3.21, unit: "tCO₂e", pct: 78.5 },
      { name: "Company Vehicles", value: 0.62, unit: "tCO₂e", pct: 15.2 },
      { name: "LPG — Canteen / Process", value: 0.257, unit: "tCO₂e", pct: 6.3 },
    ],
  },
  scope2: {
    total: 14.066,
    change: -8.7,
    sources: [
      { name: "Grid Electricity (DGVCL)", value: 12.21, unit: "tCO₂e", pct: 86.8 },
      { name: "Purchased Steam", value: 1.856, unit: "tCO₂e", pct: 13.2 },
    ],
  },
  scope3: {
    total: 28.4,
    change: +2.1,
    sources: [
      { name: "Cat 1 — Purchased Goods", value: 14.2, unit: "tCO₂e", pct: 50.0 },
      { name: "Cat 4 — Upstream Transport", value: 6.8, unit: "tCO₂e", pct: 23.9 },
      { name: "Cat 6 — Business Travel", value: 3.1, unit: "tCO₂e", pct: 10.9 },
      { name: "Cat 7 — Employee Commuting", value: 2.4, unit: "tCO₂e", pct: 8.5 },
      { name: "Others (Cat 2,3,5,8–15)", value: 1.9, unit: "tCO₂e", pct: 6.7 },
    ]
  }
};

const intensityMetrics = [
  { label: "Per ₹1Cr Revenue", value: "3.88", unit: "tCO₂e", icon: TrendingDown, trend: -14.2 },
  { label: "Per Employee", value: "0.93", unit: "tCO₂e", icon: Building2, trend: -8.1 },
  { label: "Per Tonne Product", value: "0.113", unit: "tCO₂e", icon: Factory, trend: -22.4 },
];

function ScopeCard({ title, icon: Icon, color, total, change, sources }: {
  title: string; icon: React.ComponentType<{ size?: number; className?: string }>; color: string;
  total: number; change: number; sources: { name: string; value: number; unit: string; pct: number }[];
}) {
  const isDown = change < 0;
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2"><Icon size={16} className={color} />{title}</CardTitle>
          <div className={`flex items-center gap-1 text-xs font-bold ${isDown ? "text-green-400" : "text-amber-400"}`}>
            {isDown ? <ArrowDown size={12} /> : <ArrowUp size={12} />}
            {Math.abs(change)}%
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-3xl font-black">{total.toFixed(3)}</p>
          <p className="text-xs text-foreground/30">tCO₂e · Q3 FY2024-25</p>
        </div>
        <div className="space-y-2.5">
          {sources.map((s) => (
            <div key={s.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-foreground/50">{s.name}</span>
                <span className="font-mono font-bold">{s.value.toFixed(2)} {s.unit}</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-foreground/[0.06]">
                <div className={`h-full rounded-full ${color.includes("red") ? "bg-red-400" : color.includes("amber") ? "bg-amber-400" : "bg-blue-400"}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function EmissionsPage() {
  const { user } = useApp();
  const [data, setData] = useState<typeof scopeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEmissions() {
      try {
        const res = await fetch(`/api/emissions/summary?entityId=${user.entity?.id || ""}`);
        if (res.ok) {
          const summary = await res.json();
          setData(summary);
        }
      } catch (err) {
        console.error("Failed to load emissions summary:", err);
      } finally {
        setLoading(false);
      }
    }
    if (user.entity?.id) {
      loadEmissions();
    }
  }, [user.entity?.id]);

  const activeData = data || scopeData;
  const totalEmissions = activeData.scope1.total + activeData.scope2.total + activeData.scope3.total;

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Scope 1/2/3 Tracking</h1>
          <p className="text-sm text-foreground/40 mt-1">Full emissions accounting with source-level attribution and GIC generation</p>
        </div>
        <Badge variant="outline" className="text-foreground/50 border-foreground/10 text-xs px-3 py-1">Q3 FY2024-25</Badge>
      </div>

      {/* Total Emissions Banner */}
      <Card className="bg-gradient-to-r from-foreground/[0.03] to-transparent">
        <CardContent className="py-5 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div>
            <p className="text-[10px] tracking-[0.2em] text-foreground/20 uppercase font-semibold mb-1">Total Emissions (Scope 1 + 2 + 3)</p>
            <p className="text-4xl font-black">{totalEmissions.toFixed(2)} <span className="text-lg text-foreground/30 font-normal">tCO₂e</span></p>
          </div>
          <div className="flex-1" />
          <div className="flex gap-3">
            {[
              { label: "Scope 1", value: activeData.scope1.total, color: "bg-red-400" },
              { label: "Scope 2", value: activeData.scope2.total, color: "bg-amber-400" },
              { label: "Scope 3", value: activeData.scope3.total, color: "bg-blue-400" },
            ].map((s) => (
              <div key={s.label} className="text-center px-4 py-2 rounded-xl bg-foreground/[0.03] border border-foreground/[0.06]">
                <div className="flex items-center gap-2 mb-1"><div className={`w-2 h-2 rounded-full ${s.color}`} /><span className="text-[10px] text-foreground/40">{s.label}</span></div>
                <p className="text-lg font-bold">{s.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Intensity Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {intensityMetrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="py-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] flex items-center justify-center"><m.icon size={18} className="text-foreground/25" /></div>
              <div className="flex-1">
                <p className="text-xs text-foreground/30">{m.label}</p>
                <p className="text-lg font-bold">{m.value} <span className="text-xs text-foreground/20 font-normal">{m.unit}</span></p>
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${m.trend < 0 ? "text-green-400" : "text-amber-400"}`}>
                {m.trend < 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />}{Math.abs(m.trend)}% YoY
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Three Scope Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <ScopeCard title="Scope 1 — Direct" icon={Flame} color="text-red-400" {...activeData.scope1} />
        <ScopeCard title="Scope 2 — Electricity" icon={Zap} color="text-amber-400" {...activeData.scope2} />
        <ScopeCard title="Scope 3 — Value Chain" icon={Truck} color="text-blue-400" {...activeData.scope3} />
      </div>

      {/* GIC Integration Note */}
      <Card className="border-green-500/10 bg-green-500/[0.02]">
        <CardContent className="py-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center"><BarChart3 size={18} className="text-green-400" /></div>
          <div className="flex-1">
            <p className="text-sm font-semibold">GIC Auto-Integration Active</p>
            <p className="text-xs text-foreground/30">Scope 1/2/3 data automatically feeds into MRV Engine for GIC issuance. BRSR Section C pre-populated.</p>
          </div>
          <Badge className="bg-green-500/10 text-green-400 border-green-500/20">Active</Badge>
        </CardContent>
      </Card>
    </div>
  );
}
