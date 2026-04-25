"use client";

import { useState, useRef, useCallback } from "react";
import {
  Upload, FileJson, CheckCircle2, AlertCircle, Download,
  Loader2, Zap, ArrowRight, ExternalLink, FileSpreadsheet,
  FileText, X, RefreshCw
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const SAMPLE_PAYLOAD = {
  projectIdentity: {
    projectName: "Surat Textiles Pvt Ltd — Rooftop Solar MRV",
    projectId: "GP-PRJ-2024-GJ-SOL-0442",
    cihReference: "GP-IND-2024-GJ-044821-SOL",
    companyName: "Surat Textiles Private Limited",
    gstin: "24AADCS7412M1Z8",
    udyam: "UDYAM-GJ-06-0044821",
    pan: "AADCS7412M",
    location: "Plot No. 44, GIDC Industrial Estate, Pandesara, Surat — 394221, Gujarat",
    gps: "21.1702°N, 72.8311°E",
    industry: "NIC-13111 — Preparation and Spinning of Textile Fibres",
    contact: "compliance@surattextiles.in | +91-9876543210"
  },
  physicalAsset: {
    assetType: "Rooftop Solar PV — Grid-tied",
    installedCapacity: "50 kWp (kilowatt-peak)",
    panelConfiguration: "91 × Waaree 550W Mono PERC panels",
    inverter: "Huawei SUN2000-50KTL-M3 (50 kW)",
    commissioningDate: "15-July-2024",
    installer: "Tata Power Solar Systems Ltd",
    rooftopArea: "280 sq. metres",
    iotDeviceId: "HW-FUS-SRT-2024-0442 (Huawei FusionSolar API)",
    deviceFingerprint: "Device-registered and fingerprint-verified"
  },
  monitoringPeriod: {
    periodStart: "01-October-2024 (00:00:00 IST)",
    periodEnd: "31-December-2024 (23:59:59 IST)",
    durationDays: 92,
    reportingQuarter: "Q3 FY2024-25",
    reportingFrequency: "Daily IoT readings (15-minute intervals, daily batch)",
    totalReadingsExpected: 92,
    verifiedReadings: 90
  },
  metrics: {
    totalSolarGenKWh: 17540,
    totalDieselLitres: 1525,
    fabricProducedTonnes: 412.5
  }
};

type ProcessState = "idle" | "uploading" | "processing" | "success" | "error";
type InputMode = "json" | "file";

interface MRVResult {
  success: boolean;
  certificateId: string;
  verificationUrl: string;
  pdf: string;
  pdfUrl: string | null;
  dbSaved: boolean;
  metadata: Record<string, unknown>;
}

function StepBadge({ n, label, active, done }: { n: number; label: string; active: boolean; done: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-xs transition-all duration-300 ${done ? "text-green-400" : active ? "text-foreground/70" : "text-foreground/20"}`}>
      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 transition-all duration-300 ${done ? "bg-green-500 text-black" : active ? "bg-foreground/10 border border-green-500/30 animate-pulse" : "bg-foreground/5"}`}>
        {done ? <CheckCircle2 size={10} /> : n}
      </div>
      <span className="hidden sm:inline">{label}</span>
    </div>
  );
}

export default function MRVPage() {
  const [inputMode, setInputMode] = useState<InputMode>("file");
  const [jsonInput, setJsonInput] = useState(JSON.stringify(SAMPLE_PAYLOAD, null, 2));
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [processState, setProcessState] = useState<ProcessState>("idle");
  const [result, setResult] = useState<MRVResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setProcessState("idle");
    setResult(null);
    setError(null);
    setStep(0);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) setUploadedFile(f);
  }, []);

  const handleProcess = async () => {
    setError(null);
    setResult(null);
    setStep(1);

    let cdifData: unknown;

    if (inputMode === "file" && uploadedFile) {
      setProcessState("uploading");
      try {
        const fd = new FormData();
        fd.append("file", uploadedFile);
        const uploadRes = await fetch("/api/mrv/upload", { method: "POST", body: fd });
        const uploadJson = await uploadRes.json();
        if (!uploadRes.ok || !uploadJson.success) {
          throw new Error(uploadJson.error || "File parsing failed");
        }
        cdifData = uploadJson.data;
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : "Upload failed");
        setProcessState("error");
        setStep(0);
        return;
      }
    } else {
      try {
        cdifData = JSON.parse(jsonInput);
      } catch {
        setError("Invalid JSON. Please check your input.");
        setProcessState("error");
        setStep(0);
        return;
      }
    }

    setProcessState("processing");
    setStep(2);
    await new Promise((r) => setTimeout(r, 600));
    setStep(3);

    try {
      const res = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cdifData),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Processing failed");

      setStep(4);
      await new Promise((r) => setTimeout(r, 400));
      setResult(data as MRVResult);
      setProcessState("success");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Processing failed");
      setProcessState("error");
      setStep(0);
    }
  };

  const handleDownloadPdf = () => {
    if (!result?.pdf) return;
    const a = document.createElement("a");
    a.href = result.pdf;
    a.download = `${result.certificateId}.pdf`;
    a.target = "_blank";
    a.click();
  };

  const meta = result?.metadata as Record<string, unknown> | undefined;
  const isProcessing = processState === "uploading" || processState === "processing";

  const stepLabel = () => {
    if (processState === "uploading") return "Parsing uploaded file...";
    if (step === 2) return "Running MRV Engine (AMS-I.D v18)...";
    if (step === 3) return "Generating 3-page GIC PDF...";
    if (step === 4) return "Saving to Supabase...";
    return "Working...";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight">MRV Processing Engine</h1>
          <p className="text-sm text-foreground/25">Upload a data file or paste JSON → Verify → Issue Green Impact Certificate</p>
        </div>
        <div className="flex items-center gap-2 glass-green rounded-full px-3 py-1">
          <Zap size={12} className="text-green-400" />
          <span className="text-xs text-green-400 font-medium">AMS-I.D v18</span>
        </div>
      </div>

      {/* Pipeline Steps */}
      <Card className="glass border-foreground/[0.04]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap">
            <StepBadge n={1} label="Parse Input" active={step === 1} done={step > 1 || processState === "success"} />
            <ArrowRight size={10} className="text-foreground/10 shrink-0" />
            <StepBadge n={2} label="Run MRV Engine" active={step === 2} done={step > 2 || processState === "success"} />
            <ArrowRight size={10} className="text-foreground/10 shrink-0" />
            <StepBadge n={3} label="Generate GIC PDF" active={step === 3} done={step > 3 || processState === "success"} />
            <ArrowRight size={10} className="text-foreground/10 shrink-0" />
            <StepBadge n={4} label="Save to Supabase" active={step === 4} done={processState === "success"} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ── Left panel: Input ─────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-1 glass rounded-lg p-1 w-fit">
            <button
              onClick={() => { setInputMode("file"); reset(); }}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${inputMode === "file" ? "bg-green-500 text-black" : "text-foreground/40 hover:text-foreground/70"}`}
            >
              Upload File
            </button>
            <button
              onClick={() => { setInputMode("json"); reset(); }}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${inputMode === "json" ? "bg-green-500 text-black" : "text-foreground/40 hover:text-foreground/70"}`}
            >
              Paste JSON
            </button>
          </div>

          <Card className="glass border-foreground/[0.04]">
            <CardContent className="p-4 space-y-3">
              {inputMode === "file" ? (
                <>
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet size={15} className="text-green-400/60" />
                    <span className="text-sm font-semibold">Upload MRV Data File</span>
                    <span className="text-xs text-foreground/20 ml-auto">.xlsx · .csv · .json</span>
                  </div>

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${dragOver ? "border-green-400/50 bg-green-500/5" : uploadedFile ? "border-green-500/20 bg-green-500/[0.03]" : "border-foreground/[0.06] hover:border-green-400/20 hover:bg-foreground/[0.02]"}`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".xlsx,.xls,.csv,.json"
                      className="hidden"
                      onChange={(e) => { if (e.target.files?.[0]) setUploadedFile(e.target.files[0]); }}
                    />
                    {uploadedFile ? (
                      <div className="space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-green-500/10 flex items-center justify-center">
                          <FileSpreadsheet size={20} className="text-green-400" />
                        </div>
                        <p className="text-sm font-semibold text-green-400">{uploadedFile.name}</p>
                        <p className="text-xs text-foreground/20">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                          className="text-xs text-foreground/30 hover:text-red-400 transition-colors flex items-center gap-1 mx-auto cursor-pointer"
                        >
                          <X size={10} /> Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-10 h-10 mx-auto rounded-xl bg-foreground/5 flex items-center justify-center">
                          <Upload size={18} className="text-foreground/20" />
                        </div>
                        <p className="text-sm text-foreground/40">Drag & drop or click to upload</p>
                        <p className="text-xs text-foreground/20">Supports GreenPe MRV Workbook (.xlsx), CSV, or JSON</p>
                      </div>
                    )}
                  </div>

                  {/* Accepted formats cheat sheet */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: FileSpreadsheet, label: ".xlsx / .xls", desc: "MRV Workbook" },
                      { icon: FileText, label: ".csv", desc: "Flat data CSV" },
                      { icon: FileJson, label: ".json", desc: "CDIF JSON" },
                    ].map((f) => (
                      <div key={f.label} className="glass rounded-lg p-2 text-center border border-foreground/[0.04]">
                        <f.icon size={14} className="mx-auto text-foreground/20 mb-1" />
                        <p className="text-[10px] font-mono text-foreground/40">{f.label}</p>
                        <p className="text-[9px] text-foreground/20">{f.desc}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileJson size={15} className="text-green-400/60" />
                      <span className="text-sm font-semibold">CDIF Input JSON</span>
                    </div>
                    <button
                      onClick={() => setJsonInput(JSON.stringify(SAMPLE_PAYLOAD, null, 2))}
                      className="text-xs text-foreground/30 hover:text-green-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={10} /> Load sample
                    </button>
                  </div>
                  <textarea
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    rows={20}
                    spellCheck={false}
                    className="w-full bg-foreground/[0.02] border border-foreground/[0.06] rounded-lg p-3 text-xs font-mono text-foreground/70 focus:outline-none focus:border-green-500/30 resize-none transition-all"
                  />
                </>
              )}

              {error && (
                <div className="flex items-start gap-2 text-red-400 bg-red-500/5 border border-red-500/10 rounded-lg p-3">
                  <AlertCircle size={14} className="shrink-0 mt-0.5" />
                  <p className="text-xs">{error}</p>
                </div>
              )}

              <Button
                onClick={handleProcess}
                disabled={isProcessing || (inputMode === "file" && !uploadedFile)}
                className="w-full bg-green-500 hover:bg-green-400 text-black font-semibold transition-all btn-glow cursor-pointer disabled:opacity-40"
              >
                {isProcessing ? (
                  <><Loader2 size={14} className="animate-spin mr-2" />Processing...</>
                ) : (
                  <><Zap size={14} className="mr-2" />Run MRV Engine & Issue Certificate</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* ── Right panel: Output ───────────────────────────────────────────── */}
        <div>
          {processState === "idle" && (
            <Card className="glass border-foreground/[0.04] h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-green-500/5 border border-green-500/10 flex items-center justify-center mb-4">
                  <Zap size={28} className="text-green-500/30" />
                </div>
                <p className="text-sm font-semibold text-foreground/30">Awaiting Input</p>
                <p className="text-xs text-foreground/15 mt-1 max-w-48">Upload your MRV workbook or paste CDIF JSON to generate a verified Green Impact Certificate</p>
              </CardContent>
            </Card>
          )}

          {isProcessing && (
            <Card className="glass border-green-500/10 h-full">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <div className="w-16 h-16 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-4">
                  <Loader2 size={28} className="text-green-400 animate-spin" />
                </div>
                <p className="text-sm font-semibold text-green-400/70">{stepLabel()}</p>
                <p className="text-xs text-foreground/20 mt-2">Carbon UPI v1.0 · Deterministic Calculation</p>
              </CardContent>
            </Card>
          )}

          {processState === "success" && result && meta && (
            <Card className="glass-green border-green-500/15 animate-scale-in">
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 size={16} className="text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-green-400">GIC Issued</p>
                      <p className="text-xs text-foreground/30">
                        {result.dbSaved ? "✓ Saved to Supabase" : "⚠ DB not configured — PDF still generated"}
                      </p>
                    </div>
                  </div>
                  <button onClick={reset} className="text-foreground/20 hover:text-foreground/50 transition-colors cursor-pointer">
                    <X size={14} />
                  </button>
                </div>

                <div className="h-px bg-green-500/10" />

                {/* Net reduction */}
                <div className="text-center py-3 bg-green-500/5 rounded-xl border border-green-500/10">
                  <p className="text-4xl font-black text-green-400 tabular-nums">
                    {(meta.step7NetVerifiedReduction as number)?.toFixed(4)}
                  </p>
                  <p className="text-sm text-foreground/30 mt-1">tCO₂e Net Verified Reduction</p>
                </div>

                <div className="h-px bg-foreground/[0.04]" />

                {/* Key fields */}
                <div className="space-y-2">
                  {[
                    { label: "GIC ID", value: result.certificateId },
                    { label: "Confidence Score", value: `${meta.overallConfidenceScore}/100 — HIGH` },
                    { label: "Methodology", value: String(meta.methodologyId) },
                    { label: "Grid EF", value: `${meta.gridEf} kg CO₂/kWh` },
                    { label: "CAF Applied", value: `${(meta.conservativeAdjFactor as number) * 100}% discount` },
                    { label: "Issue Date", value: String(meta.issueDate) },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between items-center">
                      <span className="text-xs text-foreground/20 uppercase tracking-wider">{f.label}</span>
                      <span className="text-xs font-medium text-foreground/70 text-right max-w-[55%] truncate">{f.value}</span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-foreground/[0.04]" />

                {/* Calc trace */}
                <div>
                  <p className="text-xs text-foreground/20 uppercase tracking-wider mb-2">Calculation Trace</p>
                  <div className="space-y-1 text-xs font-mono">
                    {[
                      `Step 1: ${meta.step1SolarEnergyGeneratedKWh} kWh solar`,
                      `Step 2: ${meta.step2DataCompletenessAdjKWh} kWh × ${meta.dataCompletenessScore}`,
                      `Step 3: ${meta.step3BaselineEmissionsRawKg} kg CO₂ baseline`,
                      `Step 4: ${meta.step4ConvertToTonnes} tCO₂e`,
                      `Step 5: ${meta.step5ApplyCAF} tCO₂e × CAF`,
                      `Step 6: ${meta.step6Scope1DieselTco2e} tCO₂e diesel`,
                      `Step 7: ${meta.step7NetVerifiedReduction} tCO₂e NET ✔`,
                    ].map((line, i) => (
                      <div key={i} className={`px-2 py-0.5 rounded ${i === 6 ? "bg-green-500/10 text-green-400 font-bold" : "text-foreground/30"}`}>
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px bg-foreground/[0.04]" />

                {/* Hash */}
                <div>
                  <p className="text-xs text-foreground/20 uppercase tracking-wider mb-1">GIC Hash (SHA-256)</p>
                  <p className="text-[9px] font-mono text-foreground/30 break-all">{String(meta.gicHash)}</p>
                </div>

                <div className="h-px bg-foreground/[0.04]" />

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    onClick={handleDownloadPdf}
                    className="flex-1 bg-green-500 hover:bg-green-400 text-black font-semibold text-sm btn-glow cursor-pointer"
                  >
                    <Download size={13} className="mr-1.5" />
                    Download GIC PDF
                  </Button>
                  <a href={result.verificationUrl} target="_blank" rel="noreferrer"
                    className="p-2.5 glass rounded-lg flex items-center justify-center hover:bg-foreground/5 text-foreground/30 hover:text-green-400 transition-all">
                    <ExternalLink size={14} />
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
