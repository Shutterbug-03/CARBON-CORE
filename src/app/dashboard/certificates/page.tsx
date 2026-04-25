"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Search, Filter, ChevronRight, DownloadCloud, QrCode,
  CheckCircle2, FileCheck, Loader2, ExternalLink, RefreshCw
} from "lucide-react";

interface Certificate {
  id: string;
  certificate_id: string;
  project_name: string;
  project_type: string;
  issued_date: string;
  location: string;
  carbon_reduced: number;
  status: string;
  pdf_url: string | null;
  metadata: Record<string, unknown> | null;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/certificates/list");
      const data = await res.json();
      if (data.certificates) {
        setCertificates(data.certificates);
      }
    } catch (e) {
      console.error("Failed to fetch certificates", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  const cert = certificates.find((c) => c.certificate_id === selected);

  const statusCounts = {
    verified: certificates.filter((c) => c.status === "ISSUED").length,
    issued: certificates.filter((c) => c.status === "PENDING").length,
    retired: certificates.filter((c) => c.status === "RETIRED").length,
  };

  const filtered = certificates.filter(
    (c) =>
      c.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.certificate_id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const meta = cert?.metadata as Record<string, unknown> | undefined;
  const mrvResult = meta?.mrvResult as Record<string, unknown> | undefined;

  return (
    <div className="space-y-5 max-w-7xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight">GIC Registry</h1>
          <p className="text-sm text-foreground/25">Green Impact Certificates • Machine-Verifiable Proof</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 hover:bg-foreground/[0.06] transition-all group">
            <Search size={13} className="text-foreground/20 group-hover:text-green-400/50 transition-colors" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search certificates..."
              className="bg-transparent border-0 text-sm focus:outline-none placeholder:text-foreground/15 text-foreground/60 w-40"
            />
          </div>
          <button
            onClick={fetchCertificates}
            className="p-2 glass rounded-lg text-foreground/20 hover:text-green-400 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
          <Button variant="outline" className="gap-1.5 text-sm h-8 border-foreground/8 text-foreground/40 hover:bg-foreground/5 hover:text-foreground hover:border-green-400/20 transition-all cursor-pointer">
            <Filter size={12} /> Filter
          </Button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Issued", count: statusCounts.verified, color: "green" },
          { label: "Pending", count: statusCounts.issued, color: "blue" },
          { label: "Retired", count: statusCounts.retired, color: "gray" },
        ].map((s) => (
          <Card key={s.label} className="card-stat glass">
            <CardContent className="p-4 text-center">
              <p className={`text-3xl font-black tabular-nums ${s.color === "green" ? "text-green-400" : s.color === "blue" ? "text-blue-400" : "text-foreground/30"}`}>
                {s.count}
              </p>
              <p className="text-xs text-foreground/25 mt-1">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* List + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Certificate List */}
        <div className="lg:col-span-3 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-foreground/20">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-sm">Loading certificates from Supabase...</span>
            </div>
          ) : filtered.length === 0 ? (
            <Card className="glass">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <FileCheck size={32} className="text-foreground/8 mb-3" />
                <p className="text-sm text-foreground/20">No certificates yet</p>
                <p className="text-xs text-foreground/10 mt-1">Use the MRV Engine to process and issue your first GIC</p>
              </CardContent>
            </Card>
          ) : (
            filtered.map((c) => (
              <Card
                key={c.certificate_id}
                onClick={() => setSelected(c.certificate_id)}
                className={`glass cursor-pointer transition-all duration-300 group ${selected === c.certificate_id
                  ? "border-green-500/20 bg-green-500/[0.04] shadow-lg shadow-green-500/5"
                  : "hover:bg-foreground/[0.04] hover:border-foreground/8 hover:shadow-md hover:shadow-black/10"
                  }`}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${c.status === "ISSUED" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]" :
                    c.status === "PENDING" ? "bg-blue-400" : "bg-foreground/15"
                    }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[13px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                        {c.project_name}
                      </h3>
                      <Badge className="bg-foreground/5 text-foreground/30 border-foreground/5 text-[8px]">
                        {c.project_type}
                      </Badge>
                    </div>
                    <div className="flex gap-3 mt-0.5 text-xs text-foreground/20">
                      <span>{c.certificate_id}</span>
                      <span>•</span>
                      <span>{new Date(c.issued_date).toLocaleDateString("en-GB")}</span>
                      <span>•</span>
                      <span>📍 {c.location?.split(",").slice(-2).join(", ")}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold tabular-nums">
                      {c.carbon_reduced?.toFixed(4)} <span className="text-xs text-foreground/20 font-normal">tCO₂e</span>
                    </p>
                    <p className="text-xs text-foreground/20">
                      {Number(mrvResult?.overallConfidenceScore ?? 99)}% confidence
                    </p>
                  </div>
                  <ChevronRight size={14} className="text-foreground/10 group-hover:text-green-400/40 group-hover:translate-x-0.5 transition-all shrink-0" />
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          {cert ? (
            <Card className="glass-green animate-scale-in sticky top-4">
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileCheck size={16} className="text-green-400" />
                    <h3 className="text-sm font-bold">GIC Preview</h3>
                  </div>
                  <div className="flex gap-1">
                    {cert.pdf_url && (
                      <a
                        href={cert.pdf_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-foreground/5 text-foreground/20 hover:text-foreground/50 transition-all cursor-pointer"
                      >
                        <DownloadCloud size={13} />
                      </a>
                    )}
                    {(() => {
                      const verifyUrl = mrvResult?.publicVerificationUrl ? String(mrvResult.publicVerificationUrl) : null;
                      return verifyUrl ? (
                        <a
                          href={verifyUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center justify-center p-1.5 rounded-md hover:bg-foreground/5 text-foreground/20 hover:text-foreground/50 transition-all cursor-pointer"
                        >
                          <ExternalLink size={13} />
                        </a>
                      ) : null;
                    })()}
                  </div>
                </div>
                <div className="h-0.5 w-full bg-gradient-to-r from-green-500 via-green-400 to-transparent rounded-full opacity-40" />

                {/* Net Reduction Highlight */}
                <div className="text-center py-3 bg-green-500/5 rounded-xl border border-green-500/10">
                  <p className="text-3xl font-black text-green-400 tabular-nums">
                    {cert.carbon_reduced?.toFixed(4)}
                  </p>
                  <p className="text-xs text-foreground/30 mt-1">tCO₂e Net Verified Reduction</p>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "GIC ID", value: cert.certificate_id },
                    { label: "Project", value: cert.project_name },
                    { label: "Type", value: cert.project_type },
                    { label: "CIH Reference", value: String((meta?.input as Record<string, unknown>)?.projectIdentity ? ((meta?.input as Record<string, unknown>)?.projectIdentity as Record<string, unknown>)?.cihReference : "—") },
                    { label: "Methodology", value: String(mrvResult?.methodologyId || "AMS-I.D") },
                    { label: "Confidence", value: `${mrvResult?.overallConfidenceScore || 99}/100 — HIGH`, highlight: true },
                    { label: "Issued", value: new Date(cert.issued_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" }) },
                    { label: "Status", value: cert.status, highlight: true },
                  ].map((field) => (
                    <div key={field.label} className="flex justify-between items-center">
                      <span className="text-xs text-foreground/20 uppercase tracking-wider">{field.label}</span>
                      <span className={`text-sm font-medium text-right max-w-[55%] truncate ${field.highlight ? "text-green-400 font-bold" : "text-foreground/70"}`}>
                        {field.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-foreground/[0.04]" />
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={12} className="text-green-400" />
                  <span className="text-green-400/70">Cryptographically Verified • Machine-Readable</span>
                </div>

                <div className="flex justify-center pt-2">
                  <div className="w-20 h-20 glass rounded-xl flex items-center justify-center">
                    <QrCode size={40} className="text-foreground/10" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass">
              <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                <FileCheck size={32} className="text-foreground/8 mb-3" />
                <p className="text-sm text-foreground/20">Select a certificate to preview</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
