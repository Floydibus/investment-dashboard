import { NextResponse } from "next/server";
import { fetchQuoteSnapshot, getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";

export const dynamic = "force-dynamic";
export const maxDuration = 25;

const FRIENDLY = "Marktdaten werden geladen... bitte kurz warten.";

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
    const quote = await fetchQuoteSnapshot(ticker);
    return NextResponse.json({ ok: true, quote });
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
