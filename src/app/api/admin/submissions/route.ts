import { NextResponse } from "next/server";
import { getSubmissions } from "@/lib/data";

export const runtime = "nodejs";

export async function GET() {
  const submissions = await getSubmissions();
  return NextResponse.json({ ok: true, submissions });
}
