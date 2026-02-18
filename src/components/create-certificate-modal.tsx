"use client";

import { useState } from "react";
import { X, Zap, ChevronRight, CheckCircle2, MapPin, Leaf, ArrowRight, Satellite, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAgents } from "@/providers/agent-provider";
import { nasaPowerService } from "@/lib/services/nasa-power";
import { carbonCalculator } from "@/lib/engines/carbon-calculator";

const ASSET_TYPES = [
    { value: "Solar", emoji: "☀️" },
    { value: "Wind", emoji: "💨" },
    { value: "Agriculture", emoji: "🌾" },
    { value: "Reforestation", emoji: "🌲" },
    { value: "Biogas", emoji: "⚡" },
    { value: "Efficiency", emoji: "📊" },
    { value: "Transport", emoji: "🚃" },
    { value: "Industrial", emoji: "🏭" },
];

const REGIONS = [
    { name: "Gujarat, IN", lat: 22.2587, lng: 71.1924, grid: "India-West" },
    { name: "Tamil Nadu, IN", lat: 11.1271, lng: 78.6569, grid: "India-South" },
    { name: "Maharashtra, IN", lat: 19.7515, lng: 75.7139, grid: "India-West" },
    { name: "Karnataka, IN", lat: 15.3173, lng: 75.7139, grid: "India-South" },
    { name: "Punjab, IN", lat: 31.1471, lng: 75.3412, grid: "India-North" },
    { name: "Rajasthan, IN", lat: 27.0238, lng: 74.2179, grid: "India-North" },
    { name: "Kerala, IN", lat: 10.8505, lng: 76.2711, grid: "India-South" },
    { name: "Delhi, IN", lat: 28.7041, lng: 77.1025, grid: "India-North" },
];

interface CreateCertificateModalProps {
    open: boolean;
    onClose: () => void;
}

export function CreateCertificateModal({ open, onClose }: CreateCertificateModalProps) {
    const { dispatchTask } = useAgents();
    const [step, setStep] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [certId, setCertId] = useState("");
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [carbonResult, setCarbonResult] = useState<any>(null);

    const [form, setForm] = useState({
        name: "",
        type: "Solar",
        location: "Gujarat, IN",
        energyKWh: "",
        panelArea: "",
        description: "",
    });

    const update = (key: string, value: string) => setForm(prev => ({ ...prev, [key]: value }));

    const canNext = step === 0
        ? form.name.length > 2 && form.type
        : step === 1
            ? form.energyKWh && Number(form.energyKWh) > 0 && (form.type !== 'Solar' || form.panelArea)
            : true;

    const handleVerify = async () => {
        setVerifying(true);
        try {
            const region = REGIONS.find(r => r.name === form.location)!;
            const today = new Date();
            const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');

            // NASA Satellite Verification (for Solar only)
            let verification = null;
            if (form.type === 'Solar' && form.panelArea) {
                verification = await nasaPowerService.verifyGeneration(
                    Number(form.energyKWh),
                    region.lat,
                    region.lng,
                    dateStr,
                    Number(form.panelArea)
                );
                setVerificationResult(verification);
            }

            // Carbon Credit Calculation
            const carbon = carbonCalculator.calculate({
                energyKWh: Number(form.energyKWh),
                gridRegion: region.grid,
                assetType: form.type as any,
                projectStartDate: new Date().toISOString(),
                verified: verification?.verified ?? true
            });
            setCarbonResult(carbon);

            setStep(2);
        } catch (error) {
            console.error('Verification failed:', error);
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const result = await dispatchTask("gic-agent", "ISSUE_CERTIFICATE", {
                assetName: form.name,
                assetType: form.type,
                location: form.location,
                energyKWh: Number(form.energyKWh),
                carbonCredits: carbonResult?.credits || 0,
                verified: verificationResult?.verified ?? true,
                verificationSource: verificationResult ? 'NASA POWER Satellite' : 'Manual',
                description: form.description,
            });
            const id = `CC-${Date.now().toString(36).toUpperCase()}`;
            setCertId(id);
            setSuccess(true);
        } catch {
            // Error handled by provider
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setStep(0);
        setSuccess(false);
        setCertId("");
        setVerificationResult(null);
        setCarbonResult(null);
        setForm({ name: "", type: "Solar", location: "Gujarat, IN", energyKWh: "", panelArea: "", description: "" });
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={handleClose}>
            <div className="w-full max-w-lg mx-4 animate-scale-in" onClick={e => e.stopPropagation()}>
                <div className="glass-strong rounded-2xl overflow-hidden border border-white/[0.08] dark:border-white/[0.08] shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.04] dark:border-white/[0.04]">
                        <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                                <Leaf size={16} className="text-green-400" />
                            </div>
                            <div>
                                <h3 className="text-[14px] font-bold">New Green Impact Certificate</h3>
                                <p className="text-[9px] text-foreground/30">AI-powered issuance via GIC Agent</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-1.5 rounded-lg hover:bg-foreground/5 transition-colors cursor-pointer">
                            <X size={16} className="text-foreground/30" />
                        </button>
                    </div>

                    {success ? (
                        /* Success State */
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center animate-scale-in">
                                <CheckCircle2 size={32} className="text-green-400" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">Certificate Issued!</h3>
                            <p className="text-[12px] text-foreground/30 mb-4">Your GIC has been created and registered</p>
                            <div className="glass rounded-xl p-4 mb-6 text-left space-y-2">
                                {[
                                    { label: "Certificate ID", value: `#${certId}` },
                                    { label: "Asset", value: form.name },
                                    { label: "Type", value: form.type },
                                    { label: "Carbon Credits", value: `${carbonResult?.credits.toFixed(3) || '0'} tCO₂e` },
                                    { label: "Verified By", value: verificationResult ? 'NASA Satellite' : 'Manual' },
                                    { label: "Location", value: form.location },
                                ].map(f => (
                                    <div key={f.label} className="flex justify-between">
                                        <span className="text-[10px] text-foreground/25 uppercase tracking-wider">{f.label}</span>
                                        <span className="text-[11px] font-medium text-foreground/70">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleClose} className="bg-green-500 text-black font-semibold hover:bg-green-400 btn-glow cursor-pointer w-full">
                                Done
                            </Button>
                        </div>
                    ) : (
                        <>
                            {/* Steps indicator */}
                            <div className="px-6 pt-4 flex items-center gap-2">
                                {["Asset Details", "Emissions Data", "Review"].map((label, i) => (
                                    <div key={label} className="flex items-center gap-2 flex-1">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${i <= step ? "bg-green-500/20 text-green-400 border border-green-500/20" : "bg-foreground/5 text-foreground/20 border border-foreground/5"
                                            }`}>
                                            {i < step ? "✓" : i + 1}
                                        </div>
                                        <span className={`text-[10px] hidden sm:block ${i <= step ? "text-foreground/60" : "text-foreground/20"}`}>{label}</span>
                                        {i < 2 && <ChevronRight size={12} className="text-foreground/10 ml-auto" />}
                                    </div>
                                ))}
                            </div>

                            {/* Form content */}
                            <div className="p-6 space-y-4">
                                {step === 0 && (
                                    <>
                                        <div>
                                            <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Asset Name</label>
                                            <input
                                                value={form.name}
                                                onChange={e => update("name", e.target.value)}
                                                placeholder="e.g. Solar Array Field B4"
                                                className="w-full glass rounded-lg px-3 py-2.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-500/30 placeholder:text-foreground/15 text-foreground/80 bg-transparent"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Asset Type</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {ASSET_TYPES.map(t => (
                                                    <button
                                                        key={t.value}
                                                        onClick={() => update("type", t.value)}
                                                        className={`px-2 py-2 rounded-lg text-[10px] font-medium transition-all cursor-pointer ${form.type === t.value
                                                            ? "bg-green-500/15 text-green-400 border border-green-500/20"
                                                            : "glass text-foreground/40 hover:text-foreground/60"
                                                            }`}
                                                    >
                                                        <span className="text-[14px] block mb-0.5">{t.emoji}</span>
                                                        {t.value}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Location</label>
                                            <select
                                                value={form.location}
                                                onChange={e => update("location", e.target.value)}
                                                className="w-full glass rounded-lg px-3 py-2.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-500/30 text-foreground/70 bg-transparent cursor-pointer"
                                            >
                                                {REGIONS.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                            </select>
                                        </div>
                                    </>
                                )}

                                {step === 1 && (
                                    <>
                                        <div>
                                            <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Energy Generated (kWh)</label>
                                            <input
                                                type="number"
                                                value={form.energyKWh}
                                                onChange={e => update("energyKWh", e.target.value)}
                                                placeholder="e.g. 1000"
                                                min="0.1"
                                                step="0.1"
                                                className="w-full glass rounded-lg px-3 py-2.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-500/30 placeholder:text-foreground/15 text-foreground/80 bg-transparent"
                                            />
                                            <p className="text-[9px] text-foreground/20 mt-1">Total energy generated by this asset</p>
                                        </div>
                                        {form.type === 'Solar' && (
                                            <div>
                                                <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Panel Area (m²)</label>
                                                <input
                                                    type="number"
                                                    value={form.panelArea}
                                                    onChange={e => update("panelArea", e.target.value)}
                                                    placeholder="e.g. 50"
                                                    min="1"
                                                    step="0.1"
                                                    className="w-full glass rounded-lg px-3 py-2.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-500/30 placeholder:text-foreground/15 text-foreground/80 bg-transparent"
                                                />
                                                <p className="text-[9px] text-foreground/20 mt-1">Required for NASA satellite verification</p>
                                            </div>
                                        )}
                                        <div>
                                            <label className="text-[10px] text-foreground/30 uppercase tracking-wider font-semibold mb-1.5 block">Description (Optional)</label>
                                            <textarea
                                                value={form.description}
                                                onChange={e => update("description", e.target.value)}
                                                placeholder="Brief description of the carbon impact project..."
                                                rows={3}
                                                className="w-full glass rounded-lg px-3 py-2.5 text-[12px] focus:outline-none focus:ring-1 focus:ring-green-500/30 placeholder:text-foreground/15 text-foreground/80 bg-transparent resize-none"
                                            />
                                        </div>
                                    </>
                                )}

                                {step === 2 && (
                                    <div className="space-y-4">
                                        {/* Verification Results */}
                                        {verificationResult && (
                                            <div className={`glass rounded-xl p-4 border ${verificationResult.verified ? 'border-green-500/20' : 'border-red-500/20'}`}>
                                                <div className="flex items-center gap-2 mb-3">
                                                    {verificationResult.verified ? (
                                                        <CheckCircle2 size={16} className="text-green-400" />
                                                    ) : (
                                                        <AlertTriangle size={16} className="text-red-400" />
                                                    )}
                                                    <p className="text-[11px] font-semibold">
                                                        {verificationResult.verified ? 'Satellite Verification Passed' : 'Verification Failed'}
                                                    </p>
                                                </div>
                                                <div className="space-y-2 text-[10px]">
                                                    <div className="flex justify-between">
                                                        <span className="text-foreground/40">Claimed Generation</span>
                                                        <span className="text-foreground/70 font-medium">{verificationResult.claimed} kWh</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-foreground/40">Max Possible (NASA)</span>
                                                        <span className="text-foreground/70 font-medium">{verificationResult.maxPossible.toFixed(2)} kWh</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-foreground/40">Confidence</span>
                                                        <span className="text-green-400 font-bold">{verificationResult.confidence}%</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[9px] text-foreground/30 mt-2">
                                                        <Satellite size={10} />
                                                        <span>Source: {verificationResult.source}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Carbon Calculation */}
                                        {carbonResult && (
                                            <div className="glass rounded-xl p-4">
                                                <p className="text-[10px] text-foreground/25 uppercase tracking-wider font-semibold mb-3">Carbon Credit Calculation</p>
                                                <div className="space-y-2 text-[10px]">
                                                    <div className="flex justify-between">
                                                        <span className="text-foreground/40">Energy Generated</span>
                                                        <span className="text-foreground/70">{carbonResult.energyMWh} MWh</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span className="text-foreground/40">Grid Emission Factor</span>
                                                        <span className="text-foreground/70">{carbonResult.gridEmissionFactor} tCO₂e/MWh</span>
                                                    </div>
                                                    <div className="h-px bg-foreground/5 my-2" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-foreground/40">Carbon Credits (VCUs)</span>
                                                        <span className="text-green-400 font-bold text-[14px]">{carbonResult.credits.toFixed(3)} tCO₂e</span>
                                                    </div>
                                                    <p className="text-[8px] text-foreground/20 mt-2">{carbonResult.methodology}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Summary */}
                                        <div className="glass rounded-xl p-4">
                                            <p className="text-[10px] text-foreground/25 uppercase tracking-wider font-semibold mb-2">Asset Summary</p>
                                            {[
                                                { label: "Asset Name", value: form.name },
                                                { label: "Type", value: form.type },
                                                { label: "Location", value: form.location },
                                                { label: "Description", value: form.description || "—" },
                                            ].map(f => (
                                                <div key={f.label} className="flex justify-between items-center py-1">
                                                    <span className="text-[10px] text-foreground/25 uppercase tracking-wider">{f.label}</span>
                                                    <span className="text-[11px] font-medium text-foreground/70">{f.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-[9px] text-foreground/20 text-center">This will invoke the GIC Agent to issue, sign, and register the certificate.</p>
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="px-6 pb-5 flex items-center gap-3">
                                {step > 0 && (
                                    <Button
                                        variant="outline"
                                        onClick={() => setStep(step - 1)}
                                        className="text-[11px] border-foreground/8 text-foreground/40 hover:text-foreground/70 cursor-pointer"
                                    >
                                        Back
                                    </Button>
                                )}
                                <div className="flex-1" />
                                {step < 2 ? (
                                    <Button
                                        onClick={step === 1 ? handleVerify : () => setStep(step + 1)}
                                        disabled={!canNext || (step === 1 && verifying)}
                                        className="bg-green-500 text-black font-semibold hover:bg-green-400 text-[11px] btn-glow cursor-pointer gap-1.5 disabled:opacity-30"
                                    >
                                        {step === 1 ? (
                                            verifying ? (
                                                <>
                                                    <Satellite size={14} className="animate-pulse" />
                                                    Verifying...
                                                </>
                                            ) : (
                                                <>
                                                    <Satellite size={14} />
                                                    Verify & Calculate
                                                </>
                                            )
                                        ) : (
                                            <>
                                                Next <ArrowRight size={14} />
                                            </>
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                        className="bg-green-500 text-black font-semibold hover:bg-green-400 text-[11px] btn-glow cursor-pointer gap-1.5 disabled:opacity-50"
                                    >
                                        {submitting ? (
                                            <>Processing...</>
                                        ) : (
                                            <><Zap size={14} /> Issue Certificate</>
                                        )}
                                    </Button>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
