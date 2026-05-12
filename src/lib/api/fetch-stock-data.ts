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

/** Free-Tier: kurze Pause zwischen Requests reduziert „Note/Information“-Limit-Antworten. */
const BETWEEN_AV_CALLS_MS = 900;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

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
 * Live-Marktdaten: nacheinander (GLOBAL_QUOTE → Daily → Overview), damit das
 * Alpha-Vantage-Free-Tier nicht durch parallele Requests sofort mit „Note/Information“ aussteigt.
 * Daily/Overview dürfen ausfallen — der Kurs aus GLOBAL_QUOTE bleibt nutzbar.
 */
export async function fetchStockData(ticker: string): Promise<StockDataBundle> {
  const sym = ticker.trim().toUpperCase();
  const quote = await fetchQuoteSnapshot(sym);

  await sleep(BETWEEN_AV_CALLS_MS);

  let dailyCloses: DailyClosePoint[] = [];
  try {
    dailyCloses = await fetchDailyCloses(sym, 14);
  } catch {
    dailyCloses = [];
  }

  await sleep(BETWEEN_AV_CALLS_MS);

  const overview = await safeOverview(sym);
  return { quote, dailyCloses, overview };
}

export type { CompanyOverview } from "@/lib/api/alpha-vantage";
