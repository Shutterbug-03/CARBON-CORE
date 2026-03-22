"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Filter, ChevronRight, DownloadCloud, QrCode, CheckCircle2, Share2, FileCheck } from "lucide-react";

const certificates = [
    { id: "GP-8821", name: "Solar Array Field B4", type: "Solar", date: "2026-02-17", location: "Gujarat, IN", impact: 12.5, confidence: 98, status: "verified" },
    { id: "GP-8742", name: "WindGen Turbine Cluster", type: "Wind", date: "2026-02-10", location: "Tamil Nadu, IN", impact: 45.2, confidence: 99, status: "verified" },
    { id: "GP-8691", name: "AgriGreen Cooperative", type: "Agriculture", date: "2026-01-28", location: "Punjab, IN", impact: 8.4, confidence: 96, status: "verified" },
    { id: "GP-8553", name: "BioEnergy Solutions Plant", type: "Biogas", date: "2026-01-15", location: "Maharashtra, IN", impact: 23.1, confidence: 97, status: "verified" },
    { id: "GP-8440", name: "TechPark Efficiency Mod", type: "Efficiency", date: "2026-01-02", location: "Karnataka, IN", impact: 6.8, confidence: 94, status: "issued" },
    { id: "GP-8322", name: "Coastal Mangrove Project", type: "Reforestation", date: "2025-12-20", location: "Kerala, IN", impact: 31.4, confidence: 95, status: "issued" },
    { id: "GP-8101", name: "Urban Transit Electrification", type: "Transport", date: "2025-12-01", location: "Delhi, IN", impact: 52.0, confidence: 92, status: "retired" },
];

export default function CertificatesPage() {
    const [selected, setSelected] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const cert = certificates.find((c) => c.id === selected);

    const statusCounts = {
        verified: certificates.filter((c) => c.status === "verified").length,
        issued: certificates.filter((c) => c.status === "issued").length,
        retired: certificates.filter((c) => c.status === "retired").length,
    };

    const filtered = certificates.filter(
        (c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search certificates..." className="bg-transparent border-0 text-sm focus:outline-none placeholder:text-foreground/15 text-foreground/60 w-40" />
                    </div>
                    <Button variant="outline" className="gap-1.5 text-sm h-8 border-foreground/8 text-foreground/40 hover:bg-foreground/5 hover:text-foreground hover:border-green-400/20 transition-all cursor-pointer">
                        <Filter size={12} /> Filter
                    </Button>
                </div>
            </div>

            {/* Status Summary */}
            <div className="grid grid-cols-3 gap-3">
                {[
                    { label: "Verified", count: statusCounts.verified, color: "green" },
                    { label: "Issued", count: statusCounts.issued, color: "blue" },
                    { label: "Retired", count: statusCounts.retired, color: "gray" },
                ].map((s) => (
                    <Card key={s.label} className="card-stat glass">
                        <CardContent className="p-4 text-center">
                            <p className={`text-3xl font-black tabular-nums ${s.color === "green" ? "text-green-400" : s.color === "blue" ? "text-blue-400" : "text-foreground/30"}`}>{s.count}</p>
                            <p className="text-xs text-foreground/25 mt-1">{s.label}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* List + Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                {/* Certificate List */}
                <div className="lg:col-span-3 space-y-2">
                    {filtered.map((c) => (
                        <Card
                            key={c.id}
                            onClick={() => setSelected(c.id)}
                            className={`glass cursor-pointer transition-all duration-300 group ${selected === c.id
                                    ? "border-green-500/20 bg-green-500/[0.04] shadow-lg shadow-green-500/5"
                                    : "hover:bg-foreground/[0.04] hover:border-foreground/8 hover:shadow-md hover:shadow-black/10"
                                }`}
                        >
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 transition-all ${c.status === "verified" ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.3)]" :
                                        c.status === "issued" ? "bg-blue-400" : "bg-foreground/15"
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[13px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">{c.name}</h3>
                                        <Badge className="bg-foreground/5 text-foreground/30 border-foreground/5 text-[8px]">{c.type}</Badge>
                                    </div>
                                    <div className="flex gap-3 mt-0.5 text-xs text-foreground/20">
                                        <span>#{c.id}</span>
                                        <span>•</span>
                                        <span>{c.date}</span>
                                        <span>•</span>
                                        <span>📍 {c.location}</span>
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-bold tabular-nums">{c.impact} <span className="text-xs text-foreground/20 font-normal">tCO₂e</span></p>
                                    <p className="text-xs text-foreground/20">{c.confidence}% confidence</p>
                                </div>
                                <ChevronRight size={14} className="text-foreground/10 group-hover:text-green-400/40 group-hover:translate-x-0.5 transition-all shrink-0" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-2">
                    {cert ? (
                        <Card className="glass-green animate-scale-in sticky top-4">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileCheck size={16} className="text-green-400" />
                                        <h3 className="text-sm font-bold">Certificate Preview</h3>
                                    </div>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 rounded-md hover:bg-foreground/5 text-foreground/20 hover:text-foreground/50 transition-all cursor-pointer"><DownloadCloud size={13} /></button>
                                        <button className="p-1.5 rounded-md hover:bg-foreground/5 text-foreground/20 hover:text-foreground/50 transition-all cursor-pointer"><Share2 size={13} /></button>
                                    </div>
                                </div>
                                <div className="h-0.5 w-full bg-gradient-to-r from-green-500 via-green-400 to-transparent rounded-full opacity-40" />
                                <div className="space-y-3">
                                    {[
                                        { label: "Certificate ID", value: `#${cert.id}` },
                                        { label: "Asset Name", value: cert.name },
                                        { label: "Category", value: cert.type },
                                        { label: "Location", value: cert.location },
                                        { label: "Impact Value", value: `${cert.impact} tCO₂e`, highlight: true },
                                        { label: "Confidence", value: `${cert.confidence}%` },
                                        { label: "Issued", value: cert.date },
                                    ].map((field) => (
                                        <div key={field.label} className="flex justify-between items-center">
                                            <span className="text-xs text-foreground/20 uppercase tracking-wider">{field.label}</span>
                                            <span className={`text-sm font-medium ${field.highlight ? "text-green-400 font-bold" : "text-foreground/70"}`}>{field.value}</span>
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
