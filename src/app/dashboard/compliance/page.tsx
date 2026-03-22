"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, FileDown, ChevronRight, CheckCircle2, Clock, AlertCircle, Shield, FileText } from "lucide-react";

const frameworks = [
    {
        id: "cbam", name: "EU CBAM", fullName: "Carbon Border Adjustment Mechanism",
        desc: "Cross-border carbon pricing compliance for EU exports",
        disclosures: 12, completed: 10, status: "on-track",
    },
    {
        id: "brsr", name: "BRSR", fullName: "Business Responsibility & Sustainability Reporting",
        desc: "SEBI-mandated sustainability disclosures for Indian corporates",
        disclosures: 8, completed: 7, status: "on-track",
    },
    {
        id: "ccts", name: "CCTS", fullName: "Carbon Credit Trading Scheme",
        desc: "India's national carbon credit trading framework",
        disclosures: 6, completed: 4, status: "in-progress",
    },
    {
        id: "csrd", name: "EU CSRD", fullName: "Corporate Sustainability Reporting Directive",
        desc: "EU-wide sustainability reporting standards",
        disclosures: 15, completed: 9, status: "in-progress",
    },
    {
        id: "cdp", name: "CDP / GRI", fullName: "Carbon Disclosure Project & Global Reporting Initiative",
        desc: "Voluntary environmental disclosure frameworks",
        disclosures: 10, completed: 10, status: "complete",
    },
];

export default function CompliancePage() {
    return (
        <div className="space-y-5 max-w-4xl mx-auto animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold tracking-tight">Export Documentation</h1>
                    <p className="text-sm text-foreground/25">Compliance frameworks • Automated disclosure generation</p>
                </div>
                <Button className="btn-glow bg-green-500 text-black font-semibold hover:bg-green-400 gap-2 text-sm h-9 cursor-pointer shadow-lg shadow-green-500/20">
                    <FileDown size={14} /> Export All Reports
                </Button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-3 gap-3">
                <Card className="card-stat glass"><CardContent className="p-4 text-center">
                    <p className="text-2xl font-black text-green-400 tabular-nums">{frameworks.filter((f) => f.status === "complete").length}</p>
                    <p className="text-xs text-foreground/25 mt-1">Complete</p>
                </CardContent></Card>
                <Card className="card-stat glass"><CardContent className="p-4 text-center">
                    <p className="text-2xl font-black text-blue-400 tabular-nums">{frameworks.filter((f) => f.status === "in-progress").length}</p>
                    <p className="text-xs text-foreground/25 mt-1">In Progress</p>
                </CardContent></Card>
                <Card className="card-stat glass"><CardContent className="p-4 text-center">
                    <p className="text-2xl font-black tabular-nums">{frameworks.filter((f) => f.status === "on-track").length}</p>
                    <p className="text-xs text-foreground/25 mt-1">On Track</p>
                </CardContent></Card>
            </div>

            {/* Frameworks */}
            <div className="space-y-3">
                {frameworks.map((fw, i) => {
                    const progress = Math.round((fw.completed / fw.disclosures) * 100);
                    return (
                        <Card
                            key={fw.id}
                            className={`glass transition-all duration-300 group cursor-default overflow-hidden hover:bg-foreground/[0.04] hover:border-foreground/8 animate-slide-up stagger-${Math.min(i + 1, 6)}`}
                            style={{ opacity: 0 }}
                        >
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-foreground/[0.03] flex items-center justify-center group-hover:bg-green-500/8 transition-all duration-200">
                                            <Shield size={18} className="text-foreground/20 group-hover:text-green-400/60 transition-colors" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-[14px] font-bold text-foreground/80 group-hover:text-foreground transition-colors">{fw.name}</h3>
                                                <Badge className={`text-[8px] gap-0.5 ${fw.status === "complete" ? "bg-green-400/10 text-green-400 border-green-400/15" :
                                                        fw.status === "on-track" ? "bg-blue-400/10 text-blue-400 border-blue-400/15" :
                                                            "bg-amber-400/10 text-amber-400 border-amber-400/15"
                                                    }`}>
                                                    {fw.status === "complete" ? <CheckCircle2 size={8} /> : fw.status === "on-track" ? <Clock size={8} /> : <AlertCircle size={8} />}
                                                    {fw.status.replace("-", " ")}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-foreground/20 mt-0.5">{fw.fullName}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/15 hover:text-green-400/50 transition-all cursor-pointer opacity-0 group-hover:opacity-100">
                                        <FileDown size={14} />
                                    </button>
                                </div>
                                <p className="text-sm text-foreground/30 mb-3">{fw.desc}</p>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1">
                                        <div className="h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full transition-all duration-700 ${fw.status === "complete" ? "bg-green-400 shadow-lg shadow-green-400/20" :
                                                        "bg-gradient-to-r from-green-500/60 to-green-400/40"
                                                    }`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-xs text-foreground/25 tabular-nums">{fw.completed}/{fw.disclosures}</span>
                                    <span className={`text-xs font-bold tabular-nums ${progress === 100 ? "text-green-400" : "text-foreground/40"}`}>{progress}%</span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
