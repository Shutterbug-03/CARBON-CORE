"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CarbonWizardSimple() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [parsedData, setParsedData] = useState<string | null>(null);
  const [carbonResult, setCarbonResult] = useState<any>(null);
  const [certificate, setCertificate] = useState<any>(null);

  // Step 1: Upload
  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/agents/ingest", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setParsedData(data.textContent);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Calculate
  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/carbon/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dataType: "csv", rawData: parsedData }),
      });
      if (!res.ok) throw new Error("Calculation failed");

      const data = await res.json();
      setCarbonResult(data.result);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Calculation failed");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Generate
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityName: "Demo Entity",
          entityId: "DEMO-001",
          entityType: "COMPANY",
          assetDescription: file?.name || "Test Asset",
          assetType: "OTHER",
          carbonImpact: carbonResult.carbonImpact,
          confidence: carbonResult.confidence,
          startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          endDate: new Date().toISOString().split("T")[0],
          dataPoints: [{ value: carbonResult.carbonImpactKg, unit: "kg CO2e", trustScore: "HIGH" }],
        }),
      });
      if (!res.ok) throw new Error("Generation failed");

      const data = await res.json();
      setCertificate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!certificate) return;
    const link = document.createElement("a");
    link.href = certificate.pdf;
    link.download = `certificate-${certificate.certificateId}.pdf`;
    link.click();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-2 flex-1 rounded ${step >= i ? "bg-emerald-500" : "bg-gray-200"}`} />
        ))}
      </div>

      {error && <div className="p-4 bg-red-50 text-red-700 rounded">{error}</div>}

      {/* Step 1: Upload */}
      {step === 1 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <h3 className="font-bold text-lg mb-2">Upload Data</h3>
          <p className="text-gray-600 text-sm mb-4">CSV, Excel, or PDF</p>
          <input type="file" accept=".csv,.xlsx,.pdf" onChange={(e) => setFile(e.target.files?.[0] || null)} className="mb-4" />
          {file && (
            <Button onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading..." : "Continue"}
            </Button>
          )}
        </div>
      )}

      {/* Step 2: Calculate */}
      {step === 2 && parsedData && (
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Calculate Carbon Impact</h3>
          <div className="bg-gray-50 p-4 rounded text-xs max-h-32 overflow-auto mb-4">
            {parsedData.substring(0, 300)}...
          </div>
          <Button onClick={handleCalculate} disabled={loading}>
            {loading ? "Calculating..." : "Calculate"}
          </Button>
        </div>
      )}

      {/* Step 3: Generate */}
      {step === 3 && carbonResult && !certificate && (
        <div className="border rounded-lg p-6">
          <h3 className="font-bold text-lg mb-2">Carbon Impact</h3>
          <div className="text-4xl font-bold text-emerald-600 mb-2">
            {carbonResult.carbonImpact.toFixed(2)} tCO2e
          </div>
          <p className="text-sm text-gray-600 mb-4">Confidence: {carbonResult.confidence}%</p>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? "Generating..." : "Generate Certificate"}
          </Button>
        </div>
      )}

      {/* Certificate Ready */}
      {certificate && (
        <div className="border-2 border-emerald-500 rounded-lg p-6 bg-emerald-50">
          <h3 className="font-bold text-lg mb-2">Certificate Generated!</h3>
          <p className="text-sm mb-4">ID: {certificate.certificateId}</p>
          <div className="flex gap-3">
            <Button onClick={downloadPDF}>Download PDF</Button>
            <Button variant="outline" onClick={() => window.open(certificate.verificationUrl, "_blank")}>
              Verify
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
