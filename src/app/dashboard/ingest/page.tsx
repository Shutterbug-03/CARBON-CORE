"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useApp } from "@/providers/app-provider";
import {
  Upload, FileSpreadsheet, Wifi, Cable, Database, CloudUpload,
  CheckCircle2, AlertTriangle, FileText, Image, Download, Zap, ArrowRight
} from "lucide-react";

const supportedFormats = [
  { icon: FileSpreadsheet, label: "Excel / CSV", desc: "MRV Workbooks, generation logs, fuel registers", formats: ".xlsx, .xls, .csv" },
  { icon: FileText, label: "PDF / Photos", desc: "Electricity bills, diesel receipts, production logs", formats: ".pdf, .jpg, .png" },
  { icon: Database, label: "JSON / CDIF", desc: "Machine-readable data in Carbon Data Interchange Format", formats: ".json" },
];

const iotConnectors = [
  { name: "Huawei FusionSolar", status: "connected", lastSync: "2 mins ago", readings: "5,840" },
  { name: "DGVCL Smart Meter", status: "connected", lastSync: "15 mins ago", readings: "12,050" },
  { name: "Growatt ShineServer", status: "available", lastSync: "—", readings: "—" },
  { name: "SMA Sunny Portal", status: "available", lastSync: "—", readings: "—" },
  { name: "Tata Fleet Edge", status: "available", lastSync: "—", readings: "—" },
];

const apiConnectors = [
  { name: "DISCOM Smart Meter API", provider: "BESCOM / MSEDCL / TSSPDCL", status: "Phase 2" },
  { name: "NASA POWER Satellite", provider: "Solar irradiance cross-check", status: "Active" },
  { name: "Weather Station API", provider: "IMD / OpenWeather", status: "Active" },
  { name: "SAP S/4HANA", provider: "ERP energy & fuel data", status: "Phase 2" },
  { name: "Tally ERP", provider: "Fuel purchase ledger", status: "Phase 2" },
];

const templates = [
  { name: "Solar Generation Log", sector: "Solar", format: "CSV" },
  { name: "EV Trip Data", sector: "EV Fleet", format: "CSV" },
  { name: "Fuel Consumption Register", sector: "All", format: "CSV" },
  { name: "Production Output Log", sector: "Manufacturing", format: "CSV" },
];

export default function IngestPage() {
  const { user } = useApp();
  const [activeTab, setActiveTab] = useState<"upload" | "iot" | "api" | "templates">("upload");
  const [dragActive, setDragActive] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    async function loadSources() {
      try {
        const res = await fetch(`/api/sources/list?entityId=${user.entity?.id || ""}`);
        if (res.ok) {
          const data = await res.json();
          setSources(data);
        }
      } catch (err) {
        console.error("Failed to load ingest sources:", err);
      }
    }
    if (user.entity?.id) {
      loadSources();
    }
  }, [user.entity?.id]);

  const tabs = [
    { id: "upload" as const, icon: Upload, label: "Upload Data" },
    { id: "iot" as const, icon: Wifi, label: "IoT Devices" },
    { id: "api" as const, icon: Cable, label: "API Connectors" },
    { id: "templates" as const, icon: Download, label: "Templates" },
  ];

  const mergedIotConnectors = sources.length > 0 
    ? sources.map(s => ({
        name: `${s.sourceId} (${s.assetName})`,
        status: "connected",
        lastSync: s.lastActive ? new Date(s.lastActive).toLocaleTimeString() + " UTC" : "Never",
        readings: s.totalDataPoints.toLocaleString()
      })).concat(iotConnectors.filter(c => c.name !== "Huawei FusionSolar" && c.name !== "DGVCL Smart Meter"))
    : iotConnectors;

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight">Data Ingestion</h1>
          <p className="text-sm text-foreground/40 mt-1">Universal data intake — accepts any format, normalizes to CDIF</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/5 border border-green-500/10">
          <div className="w-full h-2 rounded-full bg-foreground/[0.06] w-24"><div className="h-full rounded-full bg-green-500" style={{ width: "78%" }} /></div>
          <span className="text-xs font-bold text-green-400">78%</span>
          <span className="text-[10px] text-foreground/30">Data Complete</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-foreground/[0.03] p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id ? "bg-green-500 text-black shadow" : "text-foreground/40 hover:text-foreground/70"}`}>
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Tab */}
      {activeTab === "upload" && (
        <div className="space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={() => setDragActive(false)}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive ? "border-green-500 bg-green-500/5" : "border-foreground/[0.08] hover:border-foreground/[0.15]"}`}
          >
            <CloudUpload size={40} className="mx-auto text-foreground/15 mb-4" />
            <p className="text-foreground/50 font-medium">Drag & drop your data files here</p>
            <p className="text-xs text-foreground/25 mt-1">or click to browse · Supports Excel, CSV, PDF, Photos, JSON</p>
            <p className="text-xs text-foreground/15 mt-3">AI auto-detects format and extracts data for MRV processing</p>
          </div>

          {/* Supported formats */}
          <div className="grid md:grid-cols-3 gap-3">
            {supportedFormats.map((f) => (
              <Card key={f.label} className="hover:border-foreground/10 transition-colors cursor-pointer">
                <CardContent className="py-4 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] flex items-center justify-center"><f.icon size={18} className="text-foreground/30" /></div>
                  <div>
                    <p className="text-sm font-semibold">{f.label}</p>
                    <p className="text-xs text-foreground/30 mt-0.5">{f.desc}</p>
                    <p className="text-[10px] text-foreground/15 mt-1 font-mono">{f.formats}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI Features */}
          <Card className="border-green-500/10 bg-green-500/[0.02]">
            <CardContent className="py-4">
              <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-2"><Zap size={12} /> AI Data Processing</p>
              <div className="grid md:grid-cols-3 gap-3 text-xs text-foreground/40">
                <div className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" /><span>CDIF normalisation: auto-converts to kWh, litres, tCO2e</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" /><span>Gap-fill suggestions for estimated readings</span></div>
                <div className="flex items-start gap-2"><CheckCircle2 size={12} className="text-green-400 mt-0.5 shrink-0" /><span>Cross-source validation: satellite vs inverter vs bill</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* IoT Tab */}
      {activeTab === "iot" && (
        <div className="space-y-3">
          {mergedIotConnectors.map((c) => (
            <Card key={c.name} className="hover:border-foreground/10 transition-colors">
              <CardContent className="py-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${c.status === "connected" ? "bg-green-500/10" : "bg-foreground/[0.04]"}`}>
                  <Wifi size={18} className={c.status === "connected" ? "text-green-400" : "text-foreground/20"} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-foreground/30">{c.status === "connected" ? `Last sync: ${c.lastSync} · ${c.readings} readings` : "One-click setup available"}</p>
                </div>
                <Button size="sm" variant={c.status === "connected" ? "outline" : "default"} className={c.status !== "connected" ? "bg-green-500 text-black hover:bg-green-400" : ""}>
                  {c.status === "connected" ? "Connected" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* API Tab */}
      {activeTab === "api" && (
        <div className="space-y-3">
          {apiConnectors.map((c) => (
            <Card key={c.name} className="hover:border-foreground/10 transition-colors">
              <CardContent className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] flex items-center justify-center"><Cable size={18} className="text-foreground/20" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-foreground/30">{c.provider}</p>
                </div>
                <Badge variant="outline" className={c.status === "Active" ? "text-green-400 border-green-500/20" : "text-foreground/30"}>{c.status}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === "templates" && (
        <div className="grid md:grid-cols-2 gap-3">
          {templates.map((t) => (
            <Card key={t.name} className="hover:border-foreground/10 transition-colors cursor-pointer group">
              <CardContent className="py-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-foreground/[0.04] flex items-center justify-center"><FileSpreadsheet size={18} className="text-foreground/20" /></div>
                <div className="flex-1">
                  <p className="text-sm font-semibold group-hover:text-green-400 transition-colors">{t.name}</p>
                  <p className="text-xs text-foreground/30">Sector: {t.sector} · {t.format}</p>
                </div>
                <Download size={16} className="text-foreground/15 group-hover:text-green-400 transition-colors" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
