import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const envStatus = {
    NEXT_PUBLIC_SUPABASE_URL: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
    SUPABASE_SERVICE_ROLE_KEY: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  };

  const isConfigured = envStatus.NEXT_PUBLIC_SUPABASE_URL && envStatus.SUPABASE_SERVICE_ROLE_KEY;

  let dbStatus = "NOT_CONFIGURED";
  let dbLatencyMs = null;
  let dbError = null;

  if (isConfigured) {
    const startTime = Date.now();
    try {
      const supabase = createAdminClient();
      // Run a lightweight test query to check DB connectivity
      const { error } = await supabase
        .from("certificates")
        .select("certificate_id")
        .limit(1);

      dbLatencyMs = Date.now() - startTime;

      if (error) {
        dbStatus = "ERROR";
        dbError = error.message;
      } else {
        dbStatus = "CONNECTED";
      }
    } catch (err) {
      dbLatencyMs = Date.now() - startTime;
      dbStatus = "ERROR";
      dbError = err instanceof Error ? err.message : "Unknown database connection error";
    }
  }

  return NextResponse.json({
    status: dbStatus === "CONNECTED" ? "HEALTHY" : "DEGRADED",
    timestamp: new Date().toISOString(),
    environment: envStatus,
    database: {
      status: dbStatus,
      latencyMs: dbLatencyMs,
      error: dbError,
    },
  });
}
