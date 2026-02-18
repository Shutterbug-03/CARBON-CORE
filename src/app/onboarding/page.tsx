"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Shield, ArrowRight, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/providers/app-provider";
import { Suspense } from "react";

function OnboardingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { completeOnboarding } = useApp();

    const [step, setStep] = useState(0);
    const [role, setRole] = useState(searchParams.get("role") || "");
    const [formData, setFormData] = useState({
        name: "", registrationId: "", region: "", assetType: "", assetDesc: "",
    });
    const [isVerifying, setIsVerifying] = useState(false);

    const roles = [
        { id: "farmer", label: "Asset Provider", icon: "🌾", desc: "Farmer, MSME, or facility owner generating climate impact" },
        { id: "exporter", label: "Exporter / Buyer", icon: "🏭", desc: "Need CBAM-ready documentation and compliance proof" },
        { id: "government", label: "Government Body", icon: "🏛️", desc: "Real-time climate execution visibility and policy data" },
        { id: "auditor", label: "Auditor / Verifier", icon: "🔍", desc: "Third-party verification and methodology review" },
    ];

    const handleComplete = async () => {
        setIsVerifying(true);
        await new Promise((r) => setTimeout(r, 2000));

        const entity = {
            id: `ENT-${Date.now()}`,
            type: role.toUpperCase(),
            name: formData.name,
            registrationId: formData.registrationId,
            location: { lat: 28.6139, lng: 77.209, region: formData.region },
            createdAt: new Date(),
        };

        const asset = {
            id: `AST-${Date.now()}`,
            type: formData.assetType.toUpperCase(),
            ownerId: entity.id,
            description: formData.assetDesc,
            metadata: {},
            boundAt: new Date(),
        };

        const hash = `0x${Math.random().toString(16).slice(2, 18)}`;
        completeOnboarding(entity, asset, hash);
        setIsVerifying(false);
        router.push("/dashboard");
    };

    const steps = [
        // Step 0: Role Selection
        <div key="role" className="space-y-4">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
                <p className="text-muted-foreground text-sm">Choose how you interact with the CarbonCore infrastructure</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {roles.map((r) => (
                    <Card
                        key={r.id}
                        className={`cursor-pointer transition-all hover:border-primary/50 ${role === r.id ? "border-primary ring-1 ring-primary/30 bg-primary/5" : ""}`}
                        onClick={() => setRole(r.id)}
                    >
                        <CardContent className="pt-6 pb-6">
                            <p className="text-2xl mb-2">{r.icon}</p>
                            <p className="font-semibold text-sm">{r.label}</p>
                            <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>,

        // Step 1: Identity Info
        <div key="identity" className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Identity Information</h2>
                <p className="text-muted-foreground text-sm">This creates your Composite Identity Hash (CIH)</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="text-sm font-medium mb-1 block">Entity Name</label>
                    <Input placeholder="e.g., Solar Farm Pvt Ltd" value={formData.name} onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Registration ID (PAN / GSTIN / Aadhaar)</label>
                    <Input placeholder="e.g., ABCDE1234F" value={formData.registrationId} onChange={(e) => setFormData((p) => ({ ...p, registrationId: e.target.value }))} />
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Region</label>
                    <Input placeholder="e.g., Rajasthan, India" value={formData.region} onChange={(e) => setFormData((p) => ({ ...p, region: e.target.value }))} />
                </div>
            </div>
        </div>,

        // Step 2: Asset Binding
        <div key="asset" className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Bind Your Asset</h2>
                <p className="text-muted-foreground text-sm">Connect the physical asset that generates climate impact</p>
            </div>
            <div className="space-y-4 max-w-md mx-auto">
                <div>
                    <label className="text-sm font-medium mb-1 block">Asset Type</label>
                    <div className="grid grid-cols-2 gap-3">
                        {["LAND", "FACILITY", "MACHINE", "VEHICLE"].map((type) => (
                            <Card
                                key={type}
                                className={`cursor-pointer text-center p-3 transition-all ${formData.assetType === type ? "border-primary bg-primary/5" : "hover:border-primary/30"}`}
                                onClick={() => setFormData((p) => ({ ...p, assetType: type }))}
                            >
                                <p className="text-sm font-medium">{type}</p>
                            </Card>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="text-sm font-medium mb-1 block">Description</label>
                    <Input placeholder="e.g., 50-acre solar farm in Jaisalmer" value={formData.assetDesc} onChange={(e) => setFormData((p) => ({ ...p, assetDesc: e.target.value }))} />
                </div>
            </div>
        </div>,

        // Step 3: Verification
        <div key="verify" className="text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                {isVerifying ? <Loader2 size={28} className="text-primary animate-spin" /> : <CheckCircle size={28} className="text-primary" />}
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">
                    {isVerifying ? "Generating Identity Hash..." : "Ready to Launch"}
                </h2>
                <p className="text-muted-foreground text-sm max-w-sm mx-auto">
                    {isVerifying
                        ? "Binding your entity + asset into a Composite Identity Hash"
                        : "Your identity will be cryptographically bound to the CarbonCore infrastructure"}
                </p>
            </div>
            {!isVerifying && (
                <div className="bg-card border border-border rounded-xl p-4 max-w-sm mx-auto text-left space-y-2">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Entity</span><span className="font-mono text-xs">{formData.name || "—"}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Asset</span><span className="font-mono text-xs">{formData.assetType || "—"}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Region</span><span className="font-mono text-xs">{formData.region || "—"}</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Role</span><Badge variant="outline" className="text-xs">{role}</Badge></div>
                </div>
            )}
        </div>,
    ];

    const canProceed = step === 0 ? !!role : step === 1 ? !!(formData.name && formData.registrationId) : step === 2 ? !!(formData.assetType) : true;

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="border-b border-border/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Shield size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-sm font-bold">CarbonCore</span>
                        <span className="text-[9px] tracking-[0.3em] text-muted-foreground uppercase">Onboarding</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {[0, 1, 2, 3].map((s) => (
                        <div key={s} className={`w-8 h-1 rounded-full transition-all ${s <= step ? "bg-primary" : "bg-muted"}`} />
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6">
                <div className="w-full max-w-xl">{steps[step]}</div>
            </div>

            {/* Footer Controls */}
            <div className="border-t border-border/50 px-6 py-4 flex justify-between">
                <Button variant="ghost" onClick={() => step > 0 ? setStep(step - 1) : router.push("/")} className="gap-2 cursor-pointer">
                    <ArrowLeft size={14} /> {step === 0 ? "Home" : "Back"}
                </Button>
                {step < 3 ? (
                    <Button onClick={() => setStep(step + 1)} disabled={!canProceed} className="gap-2 cursor-pointer">
                        Continue <ArrowRight size={14} />
                    </Button>
                ) : (
                    <Button onClick={handleComplete} disabled={isVerifying} className="gap-2 cursor-pointer">
                        {isVerifying ? <><Loader2 size={14} className="animate-spin" /> Verifying...</> : <>Launch Dashboard <ArrowRight size={14} /></>}
                    </Button>
                )}
            </div>
        </div>
    );
}

export default function OnboardingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="animate-spin text-primary" size={32} /></div>}>
            <OnboardingContent />
        </Suspense>
    );
}
