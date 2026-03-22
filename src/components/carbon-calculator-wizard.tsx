"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Calculator, FileCheck, Download, Loader2 } from "lucide-react";

interface Step {
  id: number;
  title: string;
  status: "pending" | "active" | "completed";
}

interface CarbonResult {
  carbonImpact: number;
  confidence: number;
  trustScore: string;
  breakdown: Array<{
    category: string;
    carbonImpact: number;
  }>;
  recommendations: string[];
}

interface CertificateData {
  certificateId: string;
  verificationUrl: string;
  pdf: string;
}

export function CarbonCalculatorWizard() {
  const [steps, setSteps] = useState<Step[]>([
    { id: 1, title: "Upload Data", status: "active" },
    { id: 2, title: "Calculate Impact", status: "pending" },
    { id: 3, title: "Generate Certificate", status: "pending" },
  ]);

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [generating, setGenerating] = useState(false);

  const [uploadedData, setUploadedData] = useState<string | null>(null);
  const [carbonResult, setCarbonResult] = useState<CarbonResult | null>(null);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  const [error, setError] = useState<string | null>(null);

  // Step 1: Upload File
  const handleFileUpload = async () => {
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/agents/ingest", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setUploadedData(data.textContent);

      // Move to next step
      updateStep(1, "completed");
      updateStep(2, "active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Step 2: Calculate Carbon Impact
  const handleCalculate = async () => {
    if (!uploadedData) return;

    setCalculating(true);
    setError(null);

    try {
      const res = await fetch("/api/carbon/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dataType: file?.name.split(".").pop(),
          rawData: uploadedData,
        }),
      });

      if (!res.ok) throw new Error("Calculation failed");

      const data = await res.json();
      setCarbonResult(data.result);

      // Move to next step
      updateStep(2, "completed");
      updateStep(3, "active");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setCalculating(false);
    }
  };

  // Step 3: Generate Certificate
  const handleGenerate = async () => {
    if (!carbonResult) return;

    setGenerating(true);
    setError(null);

    try {
      const res = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityName: "Sample Entity", // TODO: Get from form
          entityId: "ENT-001",
          entityType: "COMPANY",
          assetDescription: file?.name || "Uploaded Asset",
          assetType: "OTHER",
          carbonImpact: carbonResult.carbonImpact,
          confidence: carbonResult.confidence,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          dataPoints: carbonResult.breakdown.map((item) => ({
            value: item.carbonImpact,
            unit: "kg CO2e",
            trustScore: carbonResult.trustScore as "HIGH" | "MEDIUM" | "LOW",
          })),
        }),
      });

      if (!res.ok) throw new Error("Certificate generation failed");

      const data = await res.json();
      setCertificate(data);

      // Complete wizard
      updateStep(3, "completed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Certificate generation failed");
    } finally {
      setGenerating(false);
    }
  };

  const updateStep = (id: number, status: "pending" | "active" | "completed") => {
    setSteps((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const downloadCertificate = () => {
    if (!certificate) return;

    const link = document.createElement("a");
    link.href = certificate.pdf;
    link.download = `certificate-${certificate.certificateId}.pdf`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                  step.status === "completed"
                    ? "bg-emerald-500 text-white"
                    : step.status === "active"
                    ? "bg-emerald-100 text-emerald-700 border-2 border-emerald-500"
                    : "bg-slate-100 text-slate-400"
                }`}
              >
                {step.id}
              </div>
              <span className="text-xs mt-2 font-medium text-slate-600">
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-1 w-32 mx-4 ${
                  step.status === "completed" ? "bg-emerald-500" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Upload */}
      {steps[0].status === "active" && (
        <div className="p-8 border-2 border-dashed border-slate-300 rounded-lg text-center space-y-4">
          <Upload className="w-16 h-16 mx-auto text-slate-400" />
          <div>
            <h3 className="font-bold text-lg">Upload Carbon Data</h3>
            <p className="text-sm text-slate-600 mt-1">
              Supported: CSV, Excel, PDF with energy usage, emissions, or activity data
            </p>
          </div>
          <input
            type="file"
            accept=".csv,.xlsx,.xls,.pdf"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block mx-auto"
          />
          {file && (
            <Button
              onClick={handleFileUpload}
              disabled={uploading}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Uploading...
                </>
              ) : (
                "Upload & Continue"
              )}
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Calculate */}
      {steps[1].status === "active" && uploadedData && (
        <div className="p-8 border border-slate-200 rounded-lg space-y-4">
          <Calculator className="w-12 h-12 text-emerald-600" />
          <div>
            <h3 className="font-bold text-lg">Calculate Carbon Impact</h3>
            <p className="text-sm text-slate-600 mt-1">
              AI will analyze your data and calculate carbon footprint using ISO 14064-3 standards
            </p>
          </div>
          <div className="bg-slate-50 p-4 rounded text-xs font-mono max-h-40 overflow-auto">
            {uploadedData.substring(0, 500)}...
          </div>
          <Button
            onClick={handleCalculate}
            disabled={calculating}
            className="bg-emerald-600 hover:bg-emerald-500"
          >
            {calculating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Calculating...
              </>
            ) : (
              "Calculate Impact"
            )}
          </Button>
        </div>
      )}

      {/* Step 3: Generate Certificate */}
      {steps[2].status === "active" && carbonResult && (
        <div className="p-8 border border-slate-200 rounded-lg space-y-4">
          <FileCheck className="w-12 h-12 text-emerald-600" />
          <div>
            <h3 className="font-bold text-lg">Carbon Impact Calculated</h3>
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
              <div className="text-3xl font-bold text-emerald-700">
                {carbonResult.carbonImpact.toFixed(2)} tCO2e
              </div>
              <div className="text-sm text-emerald-600 mt-1">
                Confidence: {carbonResult.confidence}% | Trust: {carbonResult.trustScore}
              </div>
            </div>
            {carbonResult.breakdown.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="font-medium text-sm">Breakdown:</p>
                {carbonResult.breakdown.map((item, i) => (
                  <div key={i} className="text-sm flex justify-between">
                    <span>{item.category}</span>
                    <span className="font-mono">{item.carbonImpact.toFixed(2)} kg</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <Button
            onClick={handleGenerate}
            disabled={generating}
            className="bg-emerald-600 hover:bg-emerald-500"
          >
            {generating ? (
              <>
                <Loader2 className="animate-spin mr-2" size={16} />
                Generating...
              </>
            ) : (
              "Generate Certificate"
            )}
          </Button>
        </div>
      )}

      {/* Certificate Ready */}
      {certificate && (
        <div className="p-8 border-2 border-emerald-500 rounded-lg space-y-4 bg-emerald-50">
          <div className="flex items-center gap-3">
            <FileCheck className="w-12 h-12 text-emerald-600" />
            <div>
              <h3 className="font-bold text-lg text-emerald-900">
                Certificate Generated!
              </h3>
              <p className="text-sm text-emerald-700">
                ID: {certificate.certificateId}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={downloadCertificate}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              <Download className="mr-2" size={16} />
              Download PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => window.open(certificate.verificationUrl, "_blank")}
            >
              Verify Certificate
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
