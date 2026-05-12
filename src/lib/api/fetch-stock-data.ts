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

/** Nach GLOBAL_QUOTE kurz warten, bevor weitere Alpha-Vantage-Calls starten. */
const AFTER_QUOTE_MS = 800;
/** Daily zuerst starten, Overview leicht versetzt — weniger gleichzeitige Treffer, kürzere SSR-Zeit als rein sequenziell. */
const BEFORE_OVERVIEW_STAGGER_MS = 350;
/** Einmaliges Retry nach Limit-Fehler bei der Tages-Serie (Hobby: SSR ~10s Budget). */
const DAILY_RETRY_BACKOFF_MS = 1800;

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
 * Live-Marktdaten: GLOBAL_QUOTE zuerst, danach Daily + Overview mit kleinem Offset parallel,
 * damit SSR auf Vercel (u. a. ~10s Hobby-Limit) zuverlässiger fertig wird und das Free-Tier
 * weniger stark trifft als drei strikt sequenzielle Calls mit langen Pausen.
 * Daily/Overview dürfen ausfallen — der Kurs aus GLOBAL_QUOTE bleibt nutzbar.
 */
export async function fetchStockData(ticker: string): Promise<StockDataBundle> {
  const sym = ticker.trim().toUpperCase();
  const quote = await fetchQuoteSnapshot(sym);

  await sleep(AFTER_QUOTE_MS);

  const dailyPromise = (async (): Promise<DailyClosePoint[]> => {
    try {
      return await fetchDailyClosesWithRetry(sym, 14);
    } catch (e) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[fetchStockData] TIME_SERIES_DAILY failed after retry:", sym, e);
      }
      return [];
    }
  })();

  await sleep(BEFORE_OVERVIEW_STAGGER_MS);
  const overviewPromise = safeOverview(sym);

  const [dailyCloses, overview] = await Promise.all([dailyPromise, overviewPromise]);
  return { quote, dailyCloses, overview };
}

export type { CompanyOverview } from "@/lib/api/alpha-vantage";
