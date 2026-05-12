import { NextResponse } from "next/server";
import { getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";

export const dynamic = "force-dynamic";

/**
 * Schnelltest: ob der Server einen Alpha-Vantage-Key sieht (ohne Key-Wert preiszugeben).
 * Im Browser öffnen: `/api/stock/health`
 */
export async function GET() {
  const hasAlphaVantageKey = Boolean(getAlphaVantageApiKey());
  return NextResponse.json({
    ok: true,
    hasAlphaVantageKey,
    hint: hasAlphaVantageKey
      ? "Key ist gesetzt — bei fehlenden Kursen Alpha-Vantage-Limit oder Symbol prüfen."
      : "Kein Key: ALPHA_VANTAGE_API_KEY oder NEXT_PUBLIC_ALPHA_VANTAGE_KEY in Vercel (Production) setzen und redeployen.",
  });
}
