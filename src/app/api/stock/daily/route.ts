import { NextResponse } from "next/server";
import { fetchDailyCloses, getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";

export const dynamic = "force-dynamic";
export const maxDuration = 25;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.trim() ?? "";
  if (!ticker) {
    return NextResponse.json({ ok: false, error: "MISSING_TICKER", dailyCloses: [] }, { status: 400 });
  }
  if (!getAlphaVantageApiKey()) {
    return NextResponse.json({ ok: false, error: "NO_KEY", dailyCloses: [] }, { status: 503 });
  }
  try {
    const dailyCloses = await fetchDailyCloses(ticker, 14);
    return NextResponse.json({ ok: true, dailyCloses });
  } catch {
    return NextResponse.json({ ok: true, dailyCloses: [] as { date: string; close: number }[] });
  }
}
