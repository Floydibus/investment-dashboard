import { NextResponse } from "next/server";
import { fetchCompanyOverview, getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";

export const dynamic = "force-dynamic";
export const maxDuration = 25;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.trim() ?? "";
  if (!ticker) {
    return NextResponse.json({ ok: false, overview: null }, { status: 400 });
  }
  if (!getAlphaVantageApiKey()) {
    return NextResponse.json({ ok: false, overview: null }, { status: 503 });
  }
  try {
    const overview = await fetchCompanyOverview(ticker);
    return NextResponse.json({ ok: true, overview });
  } catch {
    return NextResponse.json({ ok: true, overview: null });
  }
}
