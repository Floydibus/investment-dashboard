import { NextResponse } from "next/server";
import { fetchSymbolSearch, getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";

export const dynamic = "force-dynamic";

/**
 * Serverseitige Tickersuche (Alpha Vantage SYMBOL_SEARCH). API-Key bleibt im Server.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) {
    return NextResponse.json({ matches: [] });
  }

  if (!getAlphaVantageApiKey()) {
    return NextResponse.json({ matches: [], noApiKey: true });
  }

  try {
    const matches = await fetchSymbolSearch(q);
    return NextResponse.json({ matches: matches.slice(0, 20) });
  } catch {
    return NextResponse.json({ matches: [] });
  }
}
