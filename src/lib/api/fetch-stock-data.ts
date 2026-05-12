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
/** Nach GLOBAL_QUOTE etwas länger warten, bevor TIME_SERIES_DAILY folgt. */
const AFTER_QUOTE_BEFORE_DAILY_MS = 1200;
/** Einmaliges Retry nach Limit-Fehler bei der Tages-Serie. */
const DAILY_RETRY_BACKOFF_MS = 2800;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchDailyClosesWithRetry(
  sym: string,
  points: number,
): Promise<DailyClosePoint[]> {
  try {
    return await fetchDailyCloses(sym, points);
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchStockData] TIME_SERIES_DAILY first try failed:", sym, e);
    }
    await sleep(DAILY_RETRY_BACKOFF_MS);
    return await fetchDailyCloses(sym, points);
  }
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

  await sleep(AFTER_QUOTE_BEFORE_DAILY_MS);

  let dailyCloses: DailyClosePoint[] = [];
  try {
    dailyCloses = await fetchDailyClosesWithRetry(sym, 14);
  } catch (e) {
    dailyCloses = [];
    if (process.env.NODE_ENV === "development") {
      console.warn("[fetchStockData] TIME_SERIES_DAILY failed after retry:", sym, e);
    }
  }

  await sleep(BETWEEN_AV_CALLS_MS);

  const overview = await safeOverview(sym);
  return { quote, dailyCloses, overview };
}

export type { CompanyOverview } from "@/lib/api/alpha-vantage";
