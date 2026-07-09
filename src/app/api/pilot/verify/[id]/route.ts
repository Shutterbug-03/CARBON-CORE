import { NextResponse } from "next/server";

import { getVerificationResponse } from "@/lib/pilot/store";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const response = await getVerificationResponse(id);

  if (!response.valid) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json(response);
}
