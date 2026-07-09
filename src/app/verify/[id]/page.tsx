import { Building2, Calendar, CheckCircle2, Shield } from "lucide-react";

import { getVerificationResponse } from "@/lib/pilot/store";

export default async function VerifyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const response = await getVerificationResponse(id);

  if (!response.valid || !response.certificate || !response.verificationJob) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Certificate Not Found</h1>
          <p className="mt-2 text-slate-600">
            The certificate ID <code className="rounded bg-slate-100 px-2 py-1">{id}</code> could not be verified or
            is not active in the pilot registry.
          </p>
        </div>
      </div>
    );
  }

  const certificate = response.certificate;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-slate-100 p-4 md:p-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-white">
            <CheckCircle2 size={20} />
            VERIFIED PILOT CERTIFICATE
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 p-8 text-white">
            <h1 className="text-3xl font-black tracking-tight">Green Impact Certificate</h1>
            <p className="mt-2 text-sm text-emerald-100">Issued from the GreenPe Beckn verification rail</p>
          </div>

          <div className="space-y-6 p-8">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Certificate ID</label>
              <div className="mt-1 font-mono text-lg font-bold text-slate-900">{certificate.id}</div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Issued To</label>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">{certificate.entity.companyName}</div>
                  <div className="text-sm text-slate-500">{certificate.entity.gstin}</div>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-emerald-50 p-6">
              <label className="text-xs font-bold uppercase tracking-wider text-emerald-700">Carbon Impact</label>
              <div className="mt-2 text-4xl font-black text-emerald-600">
                {certificate.impact.amount} <span className="text-2xl">tCO2e</span>
              </div>
              <div className="mt-1 text-sm text-emerald-600">
                Confidence {certificate.verification.confidenceScore}/100
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Issued On</label>
              <div className="mt-2 flex items-center gap-2 text-slate-700">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">
                  {new Date(certificate.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Verification Hash</label>
              <div className="mt-1 break-all rounded bg-slate-100 p-3 font-mono text-xs text-slate-700">
                {certificate.hash}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-bold text-green-700">
                <CheckCircle2 size={16} />
                {certificate.status}
              </div>
              {response.pdfUrl ? (
                <a
                  href={response.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition-colors duration-200 hover:bg-emerald-700"
                >
                  Download Official PDF
                </a>
              ) : null}
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 p-6 text-center">
            <p className="text-xs text-slate-600">
              This pilot certificate is digitally verified, identity-bound through CIH, and issued from the GreenPe
              Beckn verification rail.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
