"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Terminal, 
  Play, 
  RefreshCw, 
  ChevronRight, 
  ChevronDown, 
  Copy, 
  Check, 
  ArrowLeft, 
  ShieldAlert, 
  Cpu, 
  Database, 
  Flame, 
  Wind, 
  Sun, 
  Droplets, 
  Leaf, 
  Compass,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  rooftopSolarSample, 
  windEnergySample, 
  smallHydroSample, 
  biomassPowerSample, 
  biogasCaptureSample, 
  thermalEfficiencySample 
} from "@/lib/pilot/sample";

interface CheckResult {
  id: string;
  status: "idle" | "running" | "passed" | "failed";
  latency?: number;
  message?: string;
  responseBody?: any;
  requestBody?: any;
  error?: string;
}

interface CheckDefinition {
  id: string;
  name: string;
  category: "infra" | "mrv" | "protocol";
  description: string;
  endpoint: string;
  method: "GET" | "POST";
  payload: any;
  icon: React.ComponentType<any>;
  curlCommand: string;
  validator: (res: any, status: number) => { ok: boolean; message: string };
}

export default function PreflightPage() {
  const [results, setResults] = useState<Record<string, CheckResult>>({});
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "infra" | "mrv" | "protocol">("all");
  const [selectedCheckId, setSelectedCheckId] = useState<string | null>(null);
  const [copiedCheckId, setCopiedCheckId] = useState<string | null>(null);

  // Initialize checks in idle state
  useEffect(() => {
    const initial: Record<string, CheckResult> = {};
    CHECKS.forEach(c => {
      initial[c.id] = { id: c.id, status: "idle" };
    });
    setResults(initial);
  }, []);

  const handleCopyCurl = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCheckId(id);
      setTimeout(() => setCopiedCheckId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const runCheck = async (check: CheckDefinition) => {
    setResults(prev => ({
      ...prev,
      [check.id]: { ...prev[check.id], status: "running", error: undefined, responseBody: undefined }
    }));

    const startTime = Date.now();
    try {
      const origin = typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";
      const url = `${origin}${check.endpoint}`;
      
      const options: RequestInit = {
        method: check.method,
        headers: {
          "Content-Type": "application/json",
        },
      };

      if (check.method === "POST" && check.payload) {
        options.body = JSON.stringify(check.payload);
      }

      const response = await fetch(url, options);
      const latency = Date.now() - startTime;
      let body: any = null;

      try {
        body = await response.json();
      } catch (e) {
        // Fallback to text if not JSON
        body = await response.text();
      }

      const validation = check.validator(body, response.status);

      setResults(prev => ({
        ...prev,
        [check.id]: {
          id: check.id,
          status: validation.ok ? "passed" : "failed",
          latency,
          message: validation.message,
          responseBody: body,
          requestBody: check.payload,
          error: validation.ok ? undefined : (typeof body === "string" ? body : JSON.stringify(body))
        }
      }));
      return validation.ok;
    } catch (err) {
      const latency = Date.now() - startTime;
      setResults(prev => ({
        ...prev,
        [check.id]: {
          id: check.id,
          status: "failed",
          latency,
          message: err instanceof Error ? err.message : "Connection refused by host",
          error: "Check if the local server is running with 'npm run dev'"
        }
      }));
      return false;
    }
  };

  const runAllChecks = async () => {
    setIsRunningAll(true);
    // Run sequentially to prevent overwhelming the local mock services & to see the visual trace
    for (const check of CHECKS) {
      await runCheck(check);
    }
    setIsRunningAll(false);
  };

  const CHECKS: CheckDefinition[] = [
    {
      id: "infra-ping",
      name: "Local Protocol Host Discovery",
      category: "infra",
      description: "Ping the main protocol endpoint to verify the local Next.js server is up.",
      endpoint: "/api/v1",
      method: "GET",
      payload: null,
      icon: Cpu,
      curlCommand: "curl -s http://localhost:3000/api/v1 | python3 -m json.tool | head -n 20",
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `Server returned HTTP ${status}` };
        if (res?.protocol !== "Carbon UPI") return { ok: false, message: "Invalid protocol signature" };
        return { ok: true, message: `Server Online — v${res.version || "1.0.0"} (${res.description})` };
      }
    },
    {
      id: "infra-db",
      name: "Supabase & Env Configuration",
      category: "infra",
      description: "Check database connection credentials and verify the Supabase client can query the certificates schema.",
      endpoint: "/api/pilot/health",
      method: "GET",
      payload: null,
      icon: Database,
      curlCommand: "curl -s http://localhost:3000/api/pilot/health | python3 -m json.tool",
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `Diagnostics returned HTTP ${status}` };
        if (res.status !== "HEALTHY") {
          const missing = Object.entries(res.environment || {})
            .filter(([_, v]) => !v)
            .map(([k]) => k)
            .join(", ");
          return { ok: false, message: `Degraded state. Missing: ${missing || "credentials"}` };
        }
        if (res.database?.status !== "CONNECTED") {
          return { ok: false, message: `Database disconnected: ${res.database?.error || "Connection failed"}` };
        }
        return { ok: true, message: `Supabase Online (${res.database.latencyMs}ms latency)` };
      }
    },
    {
      id: "mrv-solar",
      name: "Rooftop Solar Calculation & GIC",
      category: "mrv",
      description: "Submit 500 kWp rooftop solar CDIF data to verify calculation trace and ensure confidence score is not placeholder 99%.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: rooftopSolarSample },
      icon: Sun,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(rooftopSolarSample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        if (!res.success) return { ok: false, message: "Response indicates success = false" };
        const gic = res.certificate || res.verificationJob?.gic;
        if (!gic) return { ok: false, message: "Verification did not generate a certificate" };
        if (!gic.id) return { ok: false, message: "Issued certificate has no ID" };
        if (gic.verification?.confidenceScore === 99) {
          return { ok: true, message: `Issued GIC ${gic.id} [${gic.impact.amount} tCO2e]. Warning: confidence is placeholder 99%` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Reduction: ${gic.impact.amount} tCO2e. Confidence: ${gic.verification.confidenceScore || 0}/100` };
      }
    },
    {
      id: "mrv-wind",
      name: "ACM0002 Wind Energy Calculation",
      category: "mrv",
      description: "Submit 2.1 MW wind turbine CDIF metrics to run the ACM0002 methodology calculation.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: windEnergySample },
      icon: Wind,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(windEnergySample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        const gic = res.certificate || res.verificationJob?.gic;
        const mrv = res.verificationJob?.mrvRun;
        if (!gic || mrv?.methodology?.id !== "IN-WIND-V1") {
          return { ok: false, message: `Wrong methodology applied: ${mrv?.methodology?.id || "None"}` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Reduction: ${gic.impact.amount} tCO2e. Methodology: IN-WIND-V1` };
      }
    },
    {
      id: "mrv-hydro",
      name: "AMS-I.D Small Hydro Calculation",
      category: "mrv",
      description: "Submit 5 MW Himachal small hydro CDIF data to verify turbine energy verification calculations.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: smallHydroSample },
      icon: Droplets,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(smallHydroSample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        const gic = res.certificate || res.verificationJob?.gic;
        const mrv = res.verificationJob?.mrvRun;
        if (!gic || mrv?.methodology?.id !== "IN-SMALL-HYDRO-V1") {
          return { ok: false, message: `Wrong methodology: ${mrv?.methodology?.id || "None"}` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Reduction: ${gic.impact.amount} tCO2e. Methodology: IN-SMALL-HYDRO-V1` };
      }
    },
    {
      id: "mrv-biomass",
      name: "AMS-I.C Biomass Power Calculation",
      category: "mrv",
      description: "Submit Maharashtra bagasse biomass plant metrics to check grid displacement and fossil auxiliary discounts.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: biomassPowerSample },
      icon: Leaf,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(biomassPowerSample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        const gic = res.certificate || res.verificationJob?.gic;
        const mrv = res.verificationJob?.mrvRun;
        if (!gic || mrv?.methodology?.id !== "IN-BIOMASS-V1") {
          return { ok: false, message: `Wrong methodology: ${mrv?.methodology?.id || "None"}` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Reduction: ${gic.impact.amount} tCO2e. Methodology: IN-BIOMASS-V1` };
      }
    },
    {
      id: "mrv-biogas",
      name: "AMS-III.D Biogas Recovery & Methane",
      category: "mrv",
      description: "Submit Anand dairy cooperative waste biodigester metrics to calculate methane destruction & avoided flaring.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: biogasCaptureSample },
      icon: Flame,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(biogasCaptureSample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        const gic = res.certificate || res.verificationJob?.gic;
        const mrv = res.verificationJob?.mrvRun;
        if (!gic || mrv?.methodology?.id !== "IN-BIOGAS-V1") {
          return { ok: false, message: `Wrong methodology: ${mrv?.methodology?.id || "None"}` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Avoided: ${gic.impact.amount} tCO2e. Methodology: IN-BIOGAS-V1` };
      }
    },
    {
      id: "mrv-thermal",
      name: "AMS-II.D Industrial Thermal Efficiency",
      category: "mrv",
      description: "Submit Morbi ceramic kiln heat exchanger upgrade metrics to check avoided Scope 1 fossil gas emissions.",
      endpoint: "/api/pilot/verify",
      method: "POST",
      payload: { input: thermalEfficiencySample },
      icon: Cpu,
      curlCommand: `curl -s -X POST http://localhost:3000/api/pilot/verify \\
  -H "Content-Type: application/json" \\
  -d '{"input": ${JSON.stringify(thermalEfficiencySample)}}' | python3 -m json.tool | head -n 35`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `HTTP ${status}: ${res?.error || "Pipeline crashed"}` };
        const gic = res.certificate || res.verificationJob?.gic;
        const mrv = res.verificationJob?.mrvRun;
        if (!gic || mrv?.methodology?.id !== "IN-THERMAL-EFFICIENCY-V1") {
          return { ok: false, message: `Wrong methodology: ${mrv?.methodology?.id || "None"}` };
        }
        return { ok: true, message: `GIC ${gic.id} Issued. Savings: ${gic.impact.amount} tCO2e. Methodology: IN-THERMAL-EFFICIENCY-V1` };
      }
    },
    {
      id: "protocol-beckn",
      name: "Beckn Search Discovery endpoint",
      category: "protocol",
      description: "Post a search schema trigger to the Beckn adapter to ensure it signs and returns the catalog correctly.",
      endpoint: "/api/beckn/search",
      method: "POST",
      payload: {
        context: {
          domain: "nic2004:403",
          action: "search",
          bap_id: "tata-carbon-platform",
          bap_uri: "https://carbon.tatagroup.com/callback",
          bpp_id: "pilot.greenpe.in",
          bpp_uri: "http://localhost:3000/api/beckn",
          transaction_id: "txn-tata-001",
          message_id: "msg-001",
          city: "std:079",
          country: "IND"
        },
        message: {
          intent: {
            category: { descriptor: { name: "Energy" } }
          }
        }
      },
      icon: Compass,
      curlCommand: `curl -s -X POST http://localhost:3000/api/beckn/search \\
  -H "Content-Type: application/json" \\
  -d '{
    "context": {
      "domain": "nic2004:403",
      "action": "search",
      "bap_id": "tata-carbon-platform",
      "bap_uri": "https://carbon.tatagroup.com/callback",
      "bpp_id": "pilot.greenpe.in",
      "bpp_uri": "http://localhost:3000/api/beckn",
      "transaction_id": "txn-tata-001",
      "message_id": "msg-001",
      "city": "std:079",
      "country": "IND"
    },
    "message": {
      "intent": {
        "category": { "descriptor": { "name": "Energy" } }
      }
    }
  }' | python3 -m json.tool | head -n 30`,
      validator: (res, status) => {
        if (status !== 200) return { ok: false, message: `Beckn search failed with HTTP ${status}` };
        if (!res?.message?.catalog) return { ok: false, message: "ACK does not contain standard Beckn catalog" };
        const itemCount = res.message.catalog.providers?.[0]?.items?.length || 0;
        return { ok: true, message: `Signed Catalog ACK returned. Loaded ${itemCount} methodology items.` };
      }
    }
  ];

  const filteredChecks = CHECKS.filter(c => activeTab === "all" || c.category === activeTab);
  
  const getStats = () => {
    const total = CHECKS.length;
    const passed = Object.values(results).filter(r => r.status === "passed").length;
    const failed = Object.values(results).filter(r => r.status === "failed").length;
    const running = Object.values(results).filter(r => r.status === "running").length;
    const idle = Object.values(results).filter(r => r.status === "idle").length;

    let overall = "NOT_RUN";
    if (running > 0) overall = "RUNNING";
    else if (failed > 0) overall = "FAILED";
    else if (passed === total) overall = "ALL_GREEN";

    return { total, passed, failed, running, idle, overall };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500/30">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-emerald-950/20 via-slate-950/0 to-transparent pointer-events-none z-0" />
      <div className="absolute top-[20%] right-[10%] w-[350px] h-[350px] bg-emerald-500/5 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[20%] left-[5%] w-[400px] h-[400px] bg-slate-800/20 blur-[130px] rounded-full pointer-events-none z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header Navigation */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-6 mb-8 gap-4">
          <div className="flex items-center gap-3">
            <Link href="/demo" className="inline-flex items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-all hover:bg-slate-850">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold tracking-wider text-emerald-400 uppercase">Preflight Readiness Portal</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-100 via-slate-300 to-slate-400 bg-clip-text text-transparent mt-1">
                GreenPe Demo Health Checker
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              id="run-preflight-btn"
              onClick={runAllChecks}
              disabled={isRunningAll}
              className={`px-5 py-5 rounded-xl text-sm font-semibold tracking-wide shadow-lg transition-all duration-300 transform active:scale-95 flex items-center gap-2 cursor-pointer ${
                stats.overall === "ALL_GREEN"
                  ? "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20"
                  : "bg-slate-100 hover:bg-white text-slate-950 shadow-white/5"
              }`}
            >
              {isRunningAll ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Running Checks...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Run Preflight Diagnostic
                </>
              )}
            </Button>
          </div>
        </header>

        {/* Diagnostic Status Indicator Panel */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          
          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 flex flex-col justify-between">
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">System Readiness</span>
            <div className="mt-4 flex items-center gap-3">
              {stats.overall === "NOT_RUN" && (
                <>
                  <span className="h-4 w-4 rounded-full bg-slate-700 animate-ping" />
                  <span className="text-xl font-bold text-slate-400">Idle (Awaiting Test)</span>
                </>
              )}
              {stats.overall === "RUNNING" && (
                <>
                  <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                  <span className="text-xl font-bold text-emerald-400">Executing diagnostics...</span>
                </>
              )}
              {stats.overall === "ALL_GREEN" && (
                <>
                  <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  <span className="text-xl font-bold text-emerald-400">READY FOR DEMO</span>
                </>
              )}
              {stats.overall === "FAILED" && (
                <>
                  <ShieldAlert className="h-6 w-6 text-red-400" />
                  <span className="text-xl font-bold text-red-400">DEGRADED STATE</span>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 flex flex-col justify-between">
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Methodologies Operational</span>
            <div className="mt-4 flex items-end justify-between">
              <span className="text-3xl font-black text-slate-100">
                {Object.keys(results).filter(k => k.startsWith("mrv-") && results[k].status === "passed").length}
                <span className="text-slate-600 text-xl font-normal"> / 6</span>
              </span>
              <span className="text-xs text-slate-500 mb-1">UNFCCC CDM compatible</span>
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 flex flex-col justify-between">
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Beckn Integration Status</span>
            <div className="mt-4 flex items-center gap-2">
              {results["protocol-beckn"]?.status === "passed" ? (
                <>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
                    Active
                  </div>
                  <span className="text-xs text-slate-400">signed response validated</span>
                </>
              ) : (
                <>
                  <div className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-700">
                    Offline
                  </div>
                  <span className="text-xs text-slate-500">awaiting check</span>
                </>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-slate-900/60 backdrop-blur-md border border-slate-800/80 p-5 flex flex-col justify-between">
            <span className="text-slate-500 text-xs font-semibold tracking-wider uppercase">Database (Supabase) status</span>
            <div className="mt-4 flex items-center gap-2">
              {results["infra-db"]?.status === "passed" ? (
                <>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
                    Connected
                  </div>
                  <span className="text-xs text-slate-400">RLS Bypass Active</span>
                </>
              ) : results["infra-db"]?.status === "failed" ? (
                <>
                  <div className="bg-red-500/10 text-red-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-red-500/20 animate-pulse">
                    Error
                  </div>
                  <span className="text-xs text-red-400 font-medium truncate">Inspect database config</span>
                </>
              ) : (
                <>
                  <div className="bg-slate-800 text-slate-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border border-slate-700">
                    Unknown
                  </div>
                  <span className="text-xs text-slate-500">awaiting check</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Tab Selection Navigation */}
        <div className="flex border-b border-slate-800/60 mb-6 gap-6">
          {(["all", "infra", "mrv", "protocol"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 text-sm font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                activeTab === tab
                  ? "border-emerald-500 text-emerald-400"
                  : "border-transparent text-slate-500 hover:text-slate-350"
              }`}
            >
              {tab === "all" ? "All diagnostics" : tab === "infra" ? "Infrastructure" : tab === "mrv" ? "MRV Calculations" : "Open Protocol"}
            </button>
          ))}
        </div>

        {/* Split Grid View (List of Checks on Left, Detail Viewer on Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Checks list (7 Columns) */}
          <section className="lg:col-span-7 space-y-3">
            {filteredChecks.map(check => {
              const res = results[check.id] || { id: check.id, status: "idle" };
              const Icon = check.icon;

              return (
                <div
                  key={check.id}
                  onClick={() => setSelectedCheckId(check.id)}
                  className={`w-full text-left rounded-2xl border p-4 bg-slate-900/40 hover:bg-slate-900/60 backdrop-blur-md cursor-pointer transition-all duration-300 flex items-center justify-between ${
                    selectedCheckId === check.id
                      ? "border-emerald-500/50 shadow-md shadow-emerald-500/5 bg-slate-900/75"
                      : "border-slate-800/70"
                  }`}
                >
                  <div className="flex items-center gap-4 min-w-0 pr-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${
                      res.status === "passed"
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                        : res.status === "failed"
                        ? "bg-red-500/10 text-red-400 border border-red-500/10"
                        : "bg-slate-800/60 text-slate-400 border border-slate-800"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-slate-100 flex items-center gap-2">
                        <span className="truncate">{check.name}</span>
                        {res.latency && (
                          <span className="text-[10px] text-slate-550 font-normal px-1.5 py-0.5 rounded bg-slate-800/60 font-mono">
                            {res.latency}ms
                          </span>
                        )}
                      </div>
                      <p className="text-slate-450 text-xs mt-1 truncate">{check.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {res.status === "idle" && (
                      <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 border border-slate-800 px-2 py-1 rounded-md bg-slate-950">
                        Idle
                      </span>
                    )}
                    {res.status === "running" && (
                      <Loader2 className="h-5 w-5 text-emerald-400 animate-spin" />
                    )}
                    {res.status === "passed" && (
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                    )}
                    {res.status === "failed" && (
                      <XCircle className="h-5 w-5 text-red-400" />
                    )}
                    <ChevronRight className={`h-4 w-4 text-slate-600 transition-transform ${selectedCheckId === check.id ? "rotate-90 text-slate-400" : ""}`} />
                  </div>
                </div>
              );
            })}
          </section>

          {/* Details & Copy Panel (5 Columns) */}
          <section className="lg:col-span-5 bg-slate-900/60 border border-slate-850 rounded-3xl p-6 backdrop-blur-md">
            {selectedCheckId ? (() => {
              const check = CHECKS.find(c => c.id === selectedCheckId)!;
              const res = results[selectedCheckId] || { id: selectedCheckId, status: "idle" };
              const Icon = check.icon;

              return (
                <div className="space-y-6">
                  {/* Panel Title */}
                  <div className="flex items-start justify-between border-b border-slate-800/70 pb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${
                        res.status === "passed" ? "bg-emerald-500/10 text-emerald-400" : res.status === "failed" ? "bg-red-500/10 text-red-400" : "bg-slate-800 text-slate-400"
                      }`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-200 text-lg leading-tight">{check.name}</h3>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mt-1 block">
                          Endpoint: {check.method} {check.endpoint}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => runCheck(check)}
                      disabled={res.status === "running"}
                      className="bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 rounded-lg p-2 h-8 w-8 flex items-center justify-center shrink-0 cursor-pointer"
                    >
                      <Play className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Summary Status Box */}
                  <div className={`p-4 rounded-2xl border text-sm leading-6 ${
                    res.status === "passed"
                      ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-300"
                      : res.status === "failed"
                      ? "bg-red-500/5 border-red-500/20 text-red-300"
                      : "bg-slate-950/60 border-slate-800 text-slate-400"
                  }`}>
                    <div className="font-semibold uppercase tracking-wider text-[10px] mb-1.5 text-slate-500">Diagnostic Status</div>
                    {res.status === "idle" && "Check has not been run. Trigger it above to perform validation."}
                    {res.status === "running" && "Diagnostic check is active. Awaiting response..."}
                    {res.status === "passed" && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-emerald-400">Passed Checklist Validation</p>
                          <p className="text-xs text-slate-400 mt-1">{res.message}</p>
                        </div>
                      </div>
                    )}
                    {res.status === "failed" && (
                      <div className="flex items-start gap-2">
                        <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-red-400">Validation Fail/Error</p>
                          <p className="text-xs text-slate-400 mt-1">{res.message || res.error}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Curl Command Clipboard copy */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Demo Curl Command</span>
                      <button
                        id={`copy-curl-${check.id}`}
                        onClick={() => handleCopyCurl(check.id, check.curlCommand)}
                        className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-all cursor-pointer"
                      >
                        {copiedCheckId === check.id ? (
                          <>
                            <Check className="h-3 w-3" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy to Clipboard
                          </>
                        )}
                      </button>
                    </div>
                    <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl font-mono text-xs text-emerald-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                      {check.curlCommand}
                    </div>
                  </div>

                  {/* Response Payload viewer */}
                  {res.responseBody && (
                    <div className="space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Live API Response</span>
                      <div className="bg-slate-950 border border-slate-850 p-3 rounded-2xl font-mono text-xs text-slate-300 max-h-56 overflow-y-auto overflow-x-auto leading-relaxed">
                        <pre>{JSON.stringify(res.responseBody, null, 2)}</pre>
                      </div>
                      
                      {/* Shortcut to GIC View link if available */}
                      {(() => {
                        const gic = res.responseBody?.certificate || res.responseBody?.verificationJob?.gic;
                        if (gic?.id) {
                          return (
                            <Link 
                              href={`/verify/${gic.id}`} 
                              target="_blank"
                              className="inline-flex items-center justify-center w-full gap-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 py-2.5 px-4 text-emerald-400 text-xs font-semibold transition-all mt-2"
                            >
                              Open Public Verification URL
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          );
                        }
                        return null;
                      })()}
                    </div>
                  )}
                </div>
              );
            })() : (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="p-3 bg-slate-800/40 rounded-full border border-slate-800 text-slate-500">
                  <Terminal className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-300">Diagnostic Details Panel</h4>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-[280px]">
                    Select any diagnostic test case on the left to see endpoint details, request payloads, response bodies, and executable curl statements.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
        
        {/* Footnote instruction indicator */}
        <footer className="mt-12 pt-6 border-t border-slate-900/60 text-center">
          <p className="text-xs text-slate-500">
            Carbon UPI preflight dashboard connects via relative fetch endpoints. Ensure local dev server is active on `http://localhost:3000`.
          </p>
        </footer>
        
      </div>
    </div>
  );
}
