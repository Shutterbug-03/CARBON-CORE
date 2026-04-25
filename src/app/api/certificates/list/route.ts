import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("certificates")
      .select("*")
      .order("issued_date", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Supabase list error:", error.message);
      return NextResponse.json({ certificates: [], error: error.message });
    }

    return NextResponse.json({ certificates: data || [] });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("List certificates error:", msg);
    // Return empty list gracefully (Supabase not configured yet)
    return NextResponse.json({ certificates: [], error: msg });
  }
}
