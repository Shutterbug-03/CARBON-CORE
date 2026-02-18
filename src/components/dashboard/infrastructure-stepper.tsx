"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, Loader2, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const steps = [
    {
        id: 7,
        label: "Settlement",
        desc: "Instant Value Transfer / UPI Integration",
        status: "Waiting",
        icon: Clock,
        color: "text-muted-foreground",
        bg: "bg-muted"
    },
    {
        id: 6,
        label: "Certification",
        desc: "Green Impact Certificate Issuance",
        status: "Pending",
        icon: Loader2,
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    },
    {
        id: 5,
        label: "Registry Prep",
        desc: "Standardized formatting for Verra/Gold Standard",
        status: "Processing",
        icon: Loader2,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        active: true
    },
    {
        id: 4,
        label: "Tokenization",
        desc: "Impact converted to Digital Assets",
        status: "Complete",
        icon: CheckCircle2,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/20"
    }
];

export function InfrastructureStepper() {
    return (
        <Card className="h-full border-0 shadow-lg glass glass-scanline rounded-3xl overflow-hidden flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-bold text-foreground">
                    7-Layer Infrastructure
                </CardTitle>
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs h-7 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 px-2"
                    asChild
                >
                    <Link href="/dashboard/pipeline">
                        View Protocol Docs
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="pt-4 flex-1">
                <div className="relative pl-4 space-y-8">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-3 bottom-0 w-0.5 bg-border/60 z-0" />

                    {steps.map((step, i) => (
                        <div key={step.id} className="relative z-10 flex gap-4 group">
                            {/* Step Number Circle */}
                            <div className={`
                                w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 shrink-0 bg-background transition-colors
                                ${step.active
                                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.1)]"
                                    : "border-border text-muted-foreground"
                                }
                            `}>
                                {step.id}
                            </div>

                            <div className="flex-1 pb-2">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h4 className={`text-sm font-semibold ${step.active ? "text-foreground" : "text-muted-foreground"}`}>
                                        {step.label}
                                    </h4>
                                    <span className={`
                                        text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full
                                        ${step.active ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-muted text-muted-foreground"}
                                    `}>
                                        {step.status}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                    {step.desc}
                                </p>
                                {step.active && (
                                    <div className="mt-2 h-1.5 w-24 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500 rounded-full animate-progress-indeterminate" />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Visual bottom indicator for continued steps */}
                    <div className="relative z-10 flex gap-4 opacity-50">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-border bg-background shrink-0">
                            <CheckCircle2 size={14} className="text-emerald-500" />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
