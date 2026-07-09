import { createAdminClient } from "@/lib/supabase/admin";

import type { BecknTransaction, GICVerificationResponse, VerificationJob } from "./types";

interface StoredBundle {
  job: VerificationJob;
  pdfDataUri?: string;
  pdfUrl?: string | null;
}

const jobs = new Map<string, StoredBundle>();
const certificates = new Map<string, StoredBundle>();
const becknEvents: BecknTransaction[] = [];

function hasSupabaseConfig(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function persistSupabaseBundle(bundle: StoredBundle): Promise<string | null> {
  if (!hasSupabaseConfig() || !bundle.job.gic) {
    return bundle.pdfUrl ?? null;
  }

  try {
    const supabase = createAdminClient();
    let pdfUrl = bundle.pdfUrl ?? null;

    if (bundle.pdfDataUri) {
      const base64 = bundle.pdfDataUri.split(",")[1];
      if (base64) {
        const buffer = Buffer.from(base64, "base64");
        const path = `pilot/${bundle.job.gic.id}.pdf`;
        const { data, error } = await supabase.storage
          .from("certificates")
          .upload(path, buffer, { contentType: "application/pdf", upsert: true });

        if (!error && data?.path) {
          const { data: publicData } = supabase.storage.from("certificates").getPublicUrl(data.path);
          pdfUrl = publicData.publicUrl;
        }
      }
    }

    await supabase.from("pilot_verification_jobs").upsert(
      {
        job_id: bundle.job.id,
        certificate_id: bundle.job.gic.id,
        beckn_transaction_id: bundle.job.becknTransactionId ?? null,
        status: bundle.job.status,
        input_payload: bundle.job.input,
        cih_binding: bundle.job.cihBinding,
        mrv_run: bundle.job.mrvRun,
        audit_trail: bundle.job.auditTrail,
        created_at: bundle.job.createdAt,
        updated_at: bundle.job.updatedAt,
      },
      { onConflict: "job_id" },
    );

    await supabase.from("pilot_certificates").upsert(
      {
        certificate_id: bundle.job.gic.id,
        job_id: bundle.job.id,
        status: bundle.job.gic.status,
        gic_document: bundle.job.gic,
        pdf_url: pdfUrl,
        issued_at: bundle.job.gic.createdAt,
      },
      { onConflict: "certificate_id" },
    );

    await supabase.from("certificates").upsert(
      {
        certificate_id: bundle.job.gic.id,
        entity_id: null,
        project_name: bundle.job.input.projectIdentity.projectName,
        project_type: bundle.job.input.physicalAsset.assetType,
        location: bundle.job.input.projectIdentity.location,
        carbon_reduced: bundle.job.gic.impact.amount,
        vintage: bundle.job.input.monitoringPeriod.reportingQuarter,
        issued_date: bundle.job.gic.createdAt,
        verifier: "GreenPe Beckn Pilot Verification Rail",
        status: bundle.job.gic.status,
        pdf_url: pdfUrl,
        metadata: {
          pilot: true,
          verificationJob: bundle.job,
          gic: bundle.job.gic,
        },
      },
      { onConflict: "certificate_id" },
    );

    return pdfUrl;
  } catch {
    return bundle.pdfUrl ?? null;
  }
}

export async function persistVerificationBundle(bundle: StoredBundle): Promise<StoredBundle> {
  const pdfUrl = await persistSupabaseBundle(bundle);
  const persistedBundle = {
    ...bundle,
    pdfUrl,
  };

  jobs.set(bundle.job.id, persistedBundle);
  if (bundle.job.gic) {
    certificates.set(bundle.job.gic.id, persistedBundle);
  }

  return persistedBundle;
}

export async function getVerificationResponse(id: string): Promise<GICVerificationResponse> {
  const byJob = jobs.get(id);
  if (byJob?.job.gic) {
    return {
      valid: true,
      certificate: byJob.job.gic,
      verificationJob: byJob.job,
      pdfUrl: byJob.pdfUrl ?? null,
      artifacts: {
        pdfDataUri: byJob.pdfDataUri,
      },
    };
  }

  const byCertificate = certificates.get(id);
  if (byCertificate?.job.gic) {
    return {
      valid: true,
      certificate: byCertificate.job.gic,
      verificationJob: byCertificate.job,
      pdfUrl: byCertificate.pdfUrl ?? null,
      artifacts: {
        pdfDataUri: byCertificate.pdfDataUri,
      },
    };
  }

  if (hasSupabaseConfig()) {
    try {
      const supabase = createAdminClient();
      const { data } = await supabase
        .from("certificates")
        .select("certificate_id, pdf_url, metadata")
        .eq("certificate_id", id)
        .maybeSingle();

      const metadata = data?.metadata as { gic?: GICVerificationResponse["certificate"]; verificationJob?: VerificationJob } | null;
      if (metadata?.gic && metadata?.verificationJob) {
        return {
          valid: true,
          certificate: metadata.gic,
          verificationJob: metadata.verificationJob,
          pdfUrl: data?.pdf_url ?? null,
        };
      }
    } catch {
      return { valid: false };
    }
  }

  return { valid: false };
}

export function appendBecknTransaction(event: BecknTransaction): void {
  becknEvents.unshift(event);
  if (becknEvents.length > 100) {
    becknEvents.length = 100;
  }

  if (hasSupabaseConfig()) {
    void createAdminClient()
      .from("pilot_beckn_transactions")
      .insert({
        transaction_id: event.id,
        action: event.action,
        direction: event.direction,
        status: event.status,
        context_payload: event.context,
        message_payload: event.payload,
        created_at: event.createdAt,
      });
  }
}

export function listBecknTransactions(): BecknTransaction[] {
  return becknEvents;
}
