import { NextResponse } from "next/server";

import { listBecknTransactions } from "@/lib/pilot/store";

export async function GET() {
  return NextResponse.json({
    events: listBecknTransactions(),
  });
}
