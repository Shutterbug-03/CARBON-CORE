"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { rooftopSolarSample } from "@/lib/pilot/sample";
import type { BecknTransaction, VerificationJob } from "@/lib/pilot/types";

interface VerificationResponse {
  success: boolean;
  verificationJob: VerificationJob;
  certificate: VerificationJob["gic"];
  pdfUrl?: string | null;
  pdf?: string;
}

const sampleJson = JSON.stringify(rooftopSolarSample, null, 2);

async function parseUpload(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/mrv/upload", {
    method: "POST",
    body: formData,
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error || "Upload failed");
  }

  return JSON.stringify(payload.data ?? payload, null, 2);
}

export function PilotConsole() {
  const [inputJson, setInputJson] = useState(sampleJson);
  const [verification, setVerification] = useState<VerificationResponse | null>(null);
  const [becknEvents, setBecknEvents] = useState<BecknTransaction[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function refreshEvents() {
    const response = await fetch("/api/pilot/beckn-events");
    if (!response.ok) return;
    const payload = await response.json();
    setBecknEvents(payload.events ?? []);
  }

  async function runVerification() {
    setLoading("verify");
    setError(null);

    try {
      const parsed = JSON.parse(inputJson);
      const response = await fetch("/api/pilot/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: parsed }),
      });
      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload.error || "Verification failed");
      }

      setVerification(payload);
      await refreshEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(null);
    }
  }

  async function simulateBecknFlow() {
    setLoading("beckn");
    setError(null);

    try {
      const input = JSON.parse(inputJson);
      const contextBase = {
        domain: "nic2004:403",
        city: "std:080",
        country: "IND",
        core_version: "1.1.0",
        bap_id: "pilot-buyer-app",
        bap_uri: "",
        bpp_id: "greenpe-pilot",
        bpp_uri: `${window.location.origin}/api/beckn`,
        transaction_id: `txn-${Date.now()}`,
      };

      async function post(action: string, body: Record<string, unknown>) {
        const response = await fetch(`/api/beckn/${action}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            context: {
              ...contextBase,
              action,
              version: "1.1.0",
              message_id: `${action}-${Date.now()}`,
              timestamp: new Date().toISOString(),
            },
            ...body,
          }),
        });

        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload.error || `${action} failed`);
        }

        return payload;
      }

      await post("search", { message: { intent: { item: { descriptor: { name: "Rooftop Solar Verification" } } } } });
      await post("select", { message: { order: { provider: { id: "greenpe-provider" } } } });
      const initPayload = await post("init", { message: { order: { provider: { id: "greenpe-provider" } } } });
      const orderId = (initPayload.message?.order as { id?: string } | undefined)?.id;
      const confirmPayload = await post("confirm", {
        message: {
          order: {
            id: orderId,
            provider: { id: "greenpe-provider" },
            xinput: input,
          },
        },
      });
      const finalOrderId = (confirmPayload.message?.order as { id?: string } | undefined)?.id ?? orderId;
      await post("status", { message: { order_id: finalOrderId } });
      await refreshEvents();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Beckn simulation failed");
    } finally {
      setLoading(null);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading("upload");
    setError(null);

    try {
      const parsed = await parseUpload(file);
      setInputJson(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not parse upload");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <section className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
              India pilot workflow
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-950">
              CDIF to deterministic MRV to GIC to Beckn status
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              This console is the clean pilot slice. Upload an MRV workbook or use the rooftop solar sample, then
              issue a verifiable GIC and simulate the Beckn provider flow.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setInputJson(sampleJson)}>
              Load sample
            </Button>
            <label className="inline-flex cursor-pointer items-center rounded-md border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
              Upload workbook
              <input className="hidden" type="file" accept=".xlsx,.xls,.csv,.json" onChange={handleFileChange} />
            </label>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-950">
          <textarea
            className="min-h-[420px] w-full resize-y rounded-2xl bg-transparent p-4 font-mono text-sm leading-6 text-emerald-100 outline-none"
            value={inputJson}
            onChange={(event) => setInputJson(event.target.value)}
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={runVerification} disabled={Boolean(loading)}>
            {loading === "verify" ? "Running verification..." : "Run pilot verification"}
          </Button>
          <Button variant="outline" onClick={simulateBecknFlow} disabled={Boolean(loading)}>
            {loading === "beckn" ? "Simulating Beckn..." : "Simulate Beckn flow"}
          </Button>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}
      </section>

      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Verification output</p>
          {verification?.verificationJob?.gic ? (
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl bg-emerald-50 p-4">
                <div className="text-sm text-emerald-700">Net verified reduction</div>
                <div className="mt-1 text-4xl font-semibold text-emerald-900">
                  {verification.verificationJob.gic.impact.amount} tCO2e
                </div>
                <div className="mt-2 text-sm text-emerald-700">
                  Confidence {verification.verificationJob.gic.verification.confidenceScore}/100
                </div>
              </div>
              <dl className="grid gap-3 text-sm text-slate-700">
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">CIH binding</dt>
                  <dd className="mt-1 font-mono text-xs">{verification.verificationJob.cihBinding.cihId}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Methodology</dt>
                  <dd className="mt-1">{verification.verificationJob.mrvRun?.methodology.title}</dd>
                </div>
                <div className="rounded-xl border border-slate-200 p-3">
                  <dt className="text-xs uppercase tracking-wide text-slate-500">Public verification</dt>
                  <dd className="mt-1 break-all text-emerald-700">
                    <Link href={verification.verificationJob.gic.verification.publicVerificationUrl} target="_blank">
                      {verification.verificationJob.gic.verification.publicVerificationUrl}
                    </Link>
                  </dd>
                </div>
              </dl>
              <div className="flex flex-wrap gap-3">
                {verification.pdf ? (
                  <a
                    className="inline-flex items-center rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                    download={`${verification.verificationJob.gic.id}.pdf`}
                    href={verification.pdf}
                  >
                    Download GIC PDF
                  </a>
                ) : null}
                <Link
                  className="inline-flex items-center rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700"
                  href={`/verify/${verification.verificationJob.gic.id}`}
                  target="_blank"
                >
                  Open public verification page
                </Link>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-slate-600">
              No GIC issued yet. Run the pilot verification to create a persistent verification job and public proof.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Beckn trace</p>
          <div className="mt-4 space-y-3">
            {becknEvents.length ? (
              becknEvents.map((event) => (
                <div key={event.id} className="rounded-2xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {event.direction.toUpperCase()} {event.action}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">{event.createdAt}</div>
                    </div>
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {event.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm leading-6 text-slate-600">
                No Beckn events yet. Run the simulation to create inbound and outbound provider-rail traces.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
