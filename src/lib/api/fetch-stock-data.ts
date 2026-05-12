import type {
  CompanyOverview,
  DailyClosePoint,
  QuoteSnapshot,
} from "@/lib/api/alpha-vantage";
import {
  fetchCompanyOverview,
  fetchDailyCloses,
  fetchQuoteSnapshot,
} from "@/lib/api/alpha-vantage";

export type StockDataBundle = {
  quote: QuoteSnapshot;
  dailyCloses: DailyClosePoint[];
  /** OVERVIEW; null wenn Limit/Fehler — Kurs bleibt trotzdem nutzbar. */
  overview: CompanyOverview | null;
};

async function safeOverview(sym: string): Promise<CompanyOverview | null> {
  try {
    return await fetchCompanyOverview(sym);
  } catch {
    return null;
  }
}

/**
 * Live-Marktdaten: GLOBAL_QUOTE + TIME_SERIES_DAILY + OVERVIEW (Sektor, Text, Ziel).
 * Key: `NEXT_PUBLIC_ALPHA_VANTAGE_KEY` oder `ALPHA_VANTAGE_API_KEY` (siehe alpha-vantage.ts).
 */
export async function fetchStockData(ticker: string): Promise<StockDataBundle> {
  const sym = ticker.trim().toUpperCase();
  const [quote, dailyCloses, overview] = await Promise.all([
    fetchQuoteSnapshot(sym),
    fetchDailyCloses(sym, 14),
    safeOverview(sym),
  ]);
  return { quote, dailyCloses, overview };
}

export type { CompanyOverview } from "@/lib/api/alpha-vantage";
