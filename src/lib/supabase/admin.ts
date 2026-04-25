import { createClient } from "@supabase/supabase-js";

/**
 * Service role client — bypasses RLS.
 * Only use server-side in API routes, never expose to browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  if (!url || !serviceKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}
