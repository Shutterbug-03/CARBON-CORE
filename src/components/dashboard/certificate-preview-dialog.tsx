"use client";

import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, CheckCircle2, FileEdit, XCircle, Check, ZoomIn, ZoomOut, Download, Eye, Maximize2, Minimize2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { generateGreenImpactCertificate, CertificateData } from "@/lib/generate-certificate";

interface CertificatePreviewDialogProps {
    defaultData: CertificateData;
    trigger?: React.ReactNode;
}

export function CertificatePreviewDialog({ defaultData, trigger }: CertificatePreviewDialogProps) {
    const [open, setOpen] = useState(false);

    // State for interactive preview
    const [recipientName, setRecipientName] = useState("");
    const [recipientAddress, setRecipientAddress] = useState("");
    const [gstin, setGstin] = useState("24AAACA4311M1Z5");
    const [zoomLevel, setZoomLevel] = useState(1);
    const [autoScale, setAutoScale] = useState(true);
    const [view, setView] = useState<'certificate' | 'audit'>('certificate');

    const containerRef = useRef<HTMLDivElement>(null);

    // Sync default data when modal opens
    useEffect(() => {
        if (open) {
            setRecipientName(defaultData.recipientName);
        }
    }, [open, defaultData]);

    // Auto-scale logic
    useEffect(() => {
        if (!autoScale || !containerRef.current) return;

        const calculateScale = () => {
            if (!containerRef.current) return;
            const containerHeight = containerRef.current.clientHeight;
            const containerWidth = containerRef.current.clientWidth;

            // A4 dimensions in pixels (assuming 96 DPI approx, but using mm ratio)
            const padding = 64; // More breathing room
            const availableHeight = containerHeight - padding;
            const availableWidth = containerWidth - padding;

            const A4_HEIGHT_MM = 297;
            const A4_WIDTH_MM = 210;
            const BASE_HEIGHT_PX = A4_HEIGHT_MM * 3.78;
            const BASE_WIDTH_PX = A4_WIDTH_MM * 3.78;

            const scaleHeight = availableHeight / BASE_HEIGHT_PX;
            const scaleWidth = availableWidth / BASE_WIDTH_PX;

            const scale = Math.min(scaleHeight, scaleWidth, 1.5);
            setZoomLevel(scale);
        };

        calculateScale();
        window.addEventListener('resize', calculateScale);
        return () => window.removeEventListener('resize', calculateScale);
    }, [open, autoScale, view]);

    const handleZoomIn = () => { setAutoScale(false); setZoomLevel(prev => Math.min(prev + 0.1, 2.5)); };
    const handleZoomOut = () => { setAutoScale(false); setZoomLevel(prev => Math.max(prev - 0.1, 0.4)); };
    const handleFit = () => { setAutoScale(true); };

    const handleGenerate = () => {
        generateGreenImpactCertificate({
            ...defaultData,
            recipientName: recipientName || defaultData.recipientName,
            recipientAddress: recipientAddress,
            gstin: gstin,
        });
    };

    const steps = [
        {
            id: 'org-details',
            title: 'Organization',
            status: recipientName ? 'verified' : 'pending',
            content: (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Registered Entity</Label>
                        <Input
                            placeholder="Organization Name"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">Address</Label>
                        <Input
                            placeholder="Registered Address"
                            className="bg-white/5 border-white/10 text-white placeholder:text-white/20 focus:border-emerald-500/50 focus:ring-emerald-500/20"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label className="text-xs font-semibold text-emerald-400/80 uppercase tracking-wider">GSTIN</Label>
                        <Input
                            value={gstin}
                            onChange={(e) => setGstin(e.target.value)}
                            className="bg-white/5 border-white/10 text-white font-mono"
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'project-meta',
            title: 'Metadata',
            status: 'verified',
            content: (
                <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-3">
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-sm font-medium text-white">Adani Solar Park IV</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <span className="text-xs text-white/40 uppercase block mb-0.5">Vintage</span>
                            <span className="text-base font-mono font-bold text-white">2024</span>
                        </div>
                        <div>
                            <span className="text-xs text-white/40 uppercase block mb-0.5">Volume</span>
                            <span className="text-base font-mono font-bold text-emerald-400">{defaultData.carbonReduced}</span>
                        </div>
                    </div>
                </div>
            )
        }
    ];

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Eye size={14} /> Verify & Export
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="max-w-none w-screen h-screen m-0 p-0 rounded-none border-none bg-[#050505] flex overflow-hidden translate-x-0 translate-y-0 top-0 left-0 data-[state=open]:slide-in-from-bottom-0 sm:max-w-none">
                <DialogTitle className="sr-only">Certificate Verification</DialogTitle>
                <DialogDescription className="sr-only">Verify and export certificate data</DialogDescription>

                {/* Visual "Matte" Background */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-900/10 via-[#050505] to-[#050505] z-0 pointer-events-none" />

                {/* Left Panel - Controls & Verification */}
                <div className="w-[380px] shrink-0 border-r border-white/5 bg-[#0A0A0A] flex flex-col z-10 h-full shadow-[5px_0_30px_rgba(0,0,0,0.5)]">

                    {/* Minimal Header */}
                    <div className="h-16 border-b border-white/5 flex items-center px-6 gap-3 shrink-0">
                        <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                            <ShieldCheck className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                            <h2 className="font-bold text-sm text-white tracking-tight">Verification Console</h2>
                            <p className="text-xs text-white/40 font-mono">ID: {defaultData.certificateId}</p>
                        </div>
                    </div>

                    {/* Compact Scrollable Steps */}
                    <div className="flex-1 overflow-y-auto py-8 px-6 space-y-10 custom-scrollbar">
                        {steps.map((step, idx) => (
                            <div key={step.id} className="relative group">
                                {idx !== steps.length - 1 && (
                                    <div className="absolute left-[11px] top-7 bottom-[-32px] w-[1px] bg-white/5" />
                                )}
                                <div className="flex items-start gap-4">
                                    <div className={`mt-0.5 h-6 w-6 rounded-full border flex items-center justify-center shrink-0 transition-colors duration-300 ${step.status === 'verified' ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'bg-transparent border-white/10 text-white/20'
                                        }`}>
                                        {step.status === 'verified' && <Check className="h-3.5 w-3.5" />}
                                    </div>
                                    <div className="space-y-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wide">{step.title}</h3>
                                            {step.status === 'verified' && <Badge variant="outline" className="text-xs h-5 px-1.5 border-emerald-500/20 text-emerald-500/70">VERIFIED</Badge>}
                                        </div>
                                        {step.content && (
                                            <div className="pt-1">
                                                {step.content}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Actions */}
                    <div className="p-6 border-t border-white/5 bg-white/[0.02] shrink-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-xs text-white/40 font-mono">
                                <span>VALIDATION SCORE</span>
                                <span className="text-emerald-500 font-bold">100%</span>
                            </div>
                            <Button
                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 transition-all font-medium h-11"
                                onClick={handleGenerate}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                                Approve & Download
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-white/40 hover:text-white hover:bg-white/5 h-9 text-xs"
                                onClick={() => setOpen(false)}
                            >
                                Cancel Operation
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Panel - The Canvas */}
                <div className="flex-1 flex flex-col relative bg-[#0d0d0d] overflow-hidden">

                    {/* Floating Toolbar */}
                    <div className="absolute top-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#0A0A0A]/90 backdrop-blur-md border border-white/10 p-2 rounded-full shadow-2xl">
                        <div className="flex bg-white/5 rounded-full p-1 border border-white/5">
                            <button onClick={() => setView('certificate')} className={cn("px-4 py-1.5 rounded-full text-xs font-semibold transition-all", view === 'certificate' ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white")}>
                                Certificate
                            </button>
                            <button onClick={() => setView('audit')} className={cn("px-4 py-1.5 rounded-full text-xs font-semibold transition-all", view === 'audit' ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white")}>
                                Audit Log
                            </button>
                        </div>
                        <div className="w-[1px] h-5 bg-white/10 mx-1" />
                        <div className="flex items-center gap-1">
                            <button onClick={handleZoomOut} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                <Minimize2 className="h-4 w-4" />
                            </button>
                            <span className="text-xs font-mono text-white/40 min-w-[3ch] text-center">
                                {Math.round(zoomLevel * 100)}%
                            </span>
                            <button onClick={handleZoomIn} className="p-2 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                                <Maximize2 className="h-4 w-4" />
                            </button>
                            <button onClick={handleFit} className={cn("p-2 rounded-full hover:bg-white/10 transition-colors ml-1", autoScale ? "text-emerald-500 bg-emerald-500/10" : "text-white/60 hover:text-white")}>
                                <span className="text-xs font-bold">FIT</span>
                            </button>
                        </div>
                    </div>

                    {/* Preview Container */}
                    <div ref={containerRef} className="flex-1 w-full h-full flex items-center justify-center p-12 relative">

                        {/* Dynamic Scale Wrapper */}
                        <div
                            style={{
                                transform: `scale(${zoomLevel})`,
                                width: '210mm',
                                height: '297mm', // Fixed A4 height
                                transition: 'transform 0.4s cubic-bezier(0.2, 0, 0, 1)'
                            }}
                            className="bg-white shadow-[0_0_100px_-20px_rgba(0,0,0,0.7)] origin-center relative transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-transform"
                        >

                            {/* Corner Borders Effect (The "Tech" Look) */}
                            <div className="absolute -top-4 -left-4 w-8 h-8 border-t-2 border-l-2 border-white/20 pointer-events-none" />
                            <div className="absolute -top-4 -right-4 w-8 h-8 border-t-2 border-r-2 border-white/20 pointer-events-none" />
                            <div className="absolute -bottom-4 -left-4 w-8 h-8 border-b-2 border-l-2 border-white/20 pointer-events-none" />
                            <div className="absolute -bottom-4 -right-4 w-8 h-8 border-b-2 border-r-2 border-white/20 pointer-events-none" />

                            {view === 'certificate' ? (
                                <div className="w-full h-full p-[15mm] flex flex-col relative text-gray-900">

                                    {/* INNER CERTIFICATE BORDER */}
                                    <div className="absolute inset-[10mm] border-[4px] border-double border-gray-200 pointer-events-none" />

                                    {/* CONTENT */}
                                    <div className="relative z-10 h-full flex flex-col items-center text-center">

                                        {/* Minimal Header */}
                                        <div className="mt-16 mb-10 flex flex-col items-center">
                                            <div className="h-16 w-16 bg-emerald-900/10 rounded-full flex items-center justify-center mb-6 border border-emerald-900/20">
                                                <ShieldCheck className="h-8 w-8 text-emerald-800" />
                                            </div>
                                            <h1 className="text-4xl font-serif text-gray-900 tracking-tight font-bold uppercase">Certificate of Impact</h1>
                                            <div className="h-1 w-16 bg-emerald-500 mt-6 rounded-full" />
                                        </div>

                                        <p className="text-xs font-bold tracking-[0.3em] text-emerald-600/60 uppercase mb-16">Verified Carbon Reduction Asset</p>

                                        {/* Main Pronouncement */}
                                        <div className="flex-1 flex flex-col justify-center w-full max-w-2xl space-y-10 -mt-12">
                                            <div>
                                                <p className="font-serif italic text-xl text-gray-500 mb-3">This certifies that</p>
                                                <h2 className="text-4xl font-bold text-gray-900 leading-tight">
                                                    {recipientName || <span className="text-gray-300 decoration-dotted underline underline-offset-8">Organization Name</span>}
                                                </h2>
                                                {(recipientAddress || gstin) && (
                                                    <div className="mt-3 text-sm text-gray-400 font-mono">
                                                        {recipientAddress} {gstin && `• GSTIN: ${gstin}`}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="py-10 border-y border-gray-100 bg-gray-50/50">
                                                <p className="text-gray-500 mb-4 text-base">Has successfully retired verified carbon credits equivalent to:</p>
                                                <div className="flex items-baseline justify-center gap-3">
                                                    <span className="text-7xl font-bold text-gray-900 tracking-tighter">{defaultData.carbonReduced}</span>
                                                    <span className="text-xl font-semibold text-emerald-600 uppercase tracking-wide">tCO₂e</span>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-12 text-left px-12">
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Project Origin</p>
                                                    <p className="font-serif text-xl text-gray-900">Adani Solar Park IV</p>
                                                    <p className="text-xs text-gray-500">Khavda, Gujarat, India</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs uppercase tracking-wider text-gray-400 font-bold mb-1.5">Vintage Allocation</p>
                                                    <p className="font-serif text-xl text-gray-900">2024</p>
                                                    <p className="text-xs text-gray-500">Verified Q1-Q4</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="w-full pt-10 border-t border-gray-100 flex items-end justify-between mt-auto">
                                            <div className="text-left">
                                                <div className="h-10 w-32 bg-gray-100/50 mb-2 rounded-sm" /> {/* Signature Placeholder */}
                                                <p className="text-sm uppercase font-bold text-gray-400">Authorized Signatory</p>
                                                <p className="text-xs text-gray-400/80">CarbonCore Verification</p>
                                            </div>

                                            <div className="text-right">
                                                <div className="h-20 w-20 bg-white border border-gray-100 ml-auto p-1.5 shadow-sm">
                                                    <div className="w-full h-full bg-gray-900" /> {/* QR Placeholder */}
                                                </div>
                                                <p className="text-xs font-mono text-gray-300 mt-1.5">{defaultData.certificateId}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // AUDIT VIEW
                                <div className="w-full h-full bg-white p-16 font-mono text-sm text-gray-600 overflow-hidden flex flex-col relative">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-emerald-500" />
                                    <h3 className="text-2xl font-bold text-gray-900 mb-10 border-b border-gray-200 pb-5">Infrastructure Verification Log</h3>

                                    <div className="space-y-6 flex-1 overflow-hidden relative">
                                        <div className="absolute left-3.5 top-0 bottom-0 w-[1px] bg-gray-100" />

                                        {[
                                            { time: '10:00:01', event: 'IoT Device #8821 handshake successful', status: 'OK' },
                                            { time: '10:05:22', event: 'Solar output 850W verified against satellite data', status: 'OK' },
                                            { time: '10:05:23', event: 'Data block #99231 hashed', status: 'LOCKED' },
                                            { time: '12:00:00', event: 'dMRV Engine validation complete', status: 'VALID' },
                                            { time: '12:01:45', event: 'Token minting initialized', status: 'PENDING' },
                                        ].map((log, i) => (
                                            <div key={i} className="flex gap-6 relative">
                                                <div className="w-2.5 h-2.5 rounded-full bg-gray-300 mt-1.5 relative z-10 ring-4 ring-white" />
                                                <div className="flex-1 p-4 bg-gray-50 rounded border border-gray-100">
                                                    <div className="flex justify-between mb-2">
                                                        <span className="text-gray-400 text-xs">{log.time}</span>
                                                        <span className={cn("font-bold text-xs px-2 py-0.5 rounded", log.status === 'OK' ? "bg-emerald-100 text-emerald-700" : "bg-gray-200 text-gray-600")}>{log.status}</span>
                                                    </div>
                                                    <p className="text-gray-800 font-medium">{log.event}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-gray-400 flex justify-between">
                                        <span>HASH: 0x8f2...9a12</span>
                                        <span>BLOCK: 19284112</span>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
