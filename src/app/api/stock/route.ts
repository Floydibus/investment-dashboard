import { NextResponse } from "next/server";
import { getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";
import { fetchStockData } from "@/lib/api/fetch-stock-data";
export const dynamic = "force-dynamic";

const FRIENDLY =
  "Marktdaten werden geladen... bitte kurz warten.";

/**
 * Universelle Marktdaten für einen Ticker (Quote + Daily + Overview).
 * Key: `ALPHA_VANTAGE_API_KEY` oder `NEXT_PUBLIC_ALPHA_VANTAGE_KEY` (siehe getAlphaVantageApiKey).
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const ticker = searchParams.get("ticker")?.trim() ?? "";
  if (!ticker) {
    return NextResponse.json(
      { ok: false, error: "MISSING_TICKER", message: FRIENDLY },
      { status: 400 },
    );
  }

  if (!getAlphaVantageApiKey()) {
    return NextResponse.json(
      { ok: false, error: "NO_KEY", message: FRIENDLY },
      { status: 503 },
    );
  }

  try {
    const data = await fetchStockData(ticker);
    return NextResponse.json({
      ok: true,
      ticker: data.quote.symbol,
      quote: data.quote,
      overview: data.overview,
      dailyCloses: data.dailyCloses,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const rateLimited =
      /limit|Note|Information|Warteschlange|429/i.test(msg) ||
      msg.includes("call frequency");

    return NextResponse.json(
      {
        ok: false,
        error: rateLimited ? "RATE_LIMIT" : "FETCH_FAILED",
        message: FRIENDLY,
        detail: process.env.NODE_ENV === "development" ? msg : undefined,
      },
      { status: rateLimited ? 429 : 502 },
    );
  }
}
