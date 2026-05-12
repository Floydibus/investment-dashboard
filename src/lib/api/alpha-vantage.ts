/**
 * Alpha Vantage — Live-Kurse (GLOBAL_QUOTE), Tages-Serie, OVERVIEW, SYMBOL_SEARCH.
 *
 * API-Key (Reihenfolge):
 * 1. `NEXT_PUBLIC_ALPHA_VANTAGE_KEY` — wie im Projekt vorgegeben (Hinweis: wird ins Client-Bundle eingebettet).
 * 2. `ALPHA_VANTAGE_API_KEY` — nur Server, empfohlen für Produktion.
 *
 * @see https://www.alphavantage.co/documentation/
 */

const ALPHA_BASE = "https://www.alphavantage.co/query";

/** Liest den konfigurierten Alpha-Vantage-Key (öffentlich oder server-only). */
export function getAlphaVantageApiKey(): string | null {
  const k =
    process.env.NEXT_PUBLIC_ALPHA_VANTAGE_KEY?.trim() ||
    process.env.ALPHA_VANTAGE_API_KEY?.trim();
  return k || null;
}

export type QuoteSnapshot = {
  symbol: string;
  currency: string;
  lastClose: number;
  previousClose: number;
  changePercent: number;
  asOf: string;
  sessionHigh: number | null;
  sessionLow: number | null;
  /** Handelsvolumen (Stückzahl), nicht in Mio. */
  volume: number | null;
};

export type DailyClosePoint = {
  date: string;
  close: number;
};

/** Auszug aus Alpha Vantage OVERVIEW (Company Overview). */
export type CompanyOverview = {
  symbol: string;
  name: string;
  sector: string | null;
  industry: string | null;
  description: string | null;
  analystTargetPrice: number | null;
  /** Marktkapitalisierung in Mrd. (USD), aus Rohstring geparst. */
  marketCapBln: number | null;
};

function getApiKey(): string {
  const key = getAlphaVantageApiKey();
  if (!key) {
    throw new Error(
      "Alpha Vantage Key fehlt. Setzen Sie NEXT_PUBLIC_ALPHA_VANTAGE_KEY oder ALPHA_VANTAGE_API_KEY in .env.local.",
    );
  }
  return key;
}

function num(v: string | undefined): number | null {
  if (v == null || v === "") return null;
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : null;
}

function parseChangePercent(raw: string | undefined): number {
  if (!raw) return 0;
  const cleaned = raw.replace("%", "").trim();
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) ? Math.round(n * 100) / 100 : 0;
}

/**
 * Aktueller Kurs und Vortagsvergleich (GLOBAL_QUOTE).
 */
export async function fetchQuoteSnapshot(symbol: string): Promise<QuoteSnapshot> {
  const key = getApiKey();
  const sym = symbol.trim().toUpperCase();
  const url = `${ALPHA_BASE}?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(sym)}&apikey=${key}`;

  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) {
    throw new Error(`Alpha Vantage HTTP ${res.status}`);
  }

  const json: unknown = await res.json();
  if (!json || typeof json !== "object") {
    throw new Error("Alpha Vantage: leere Antwort");
  }

  const errMsg = (json as { "Error Message"?: string })["Error Message"];
  if (errMsg) {
    throw new Error(errMsg);
  }

  const note = (json as { Note?: string; Information?: string }).Note;
  const info = (json as { Information?: string }).Information;
  if (note || info) {
    throw new Error(
      note ||
        info ||
        "Alpha Vantage: Limit oder Warteschlange — bitte später erneut versuchen.",
    );
  }

  const gq = (json as { "Global Quote"?: Record<string, string> })["Global Quote"];
  if (!gq || typeof gq !== "object") {
    throw new Error("Alpha Vantage: kein Global Quote (Symbol prüfen)");
  }

  const last = num(gq["05. price"]);
  const prev = num(gq["08. previous close"]);
  if (last == null || prev == null) {
    throw new Error("Alpha Vantage: Kursfelder fehlen");
  }

  const changePct =
    gq["10. change percent"] != null
      ? parseChangePercent(gq["10. change percent"])
      : prev !== 0
        ? Math.round(((last - prev) / prev) * 10000) / 100
        : 0;

  const vol = num(gq["06. volume"]);
  const hi = num(gq["03. high"]);
  const lo = num(gq["04. low"]);
  const day = gq["07. latest trading day"]?.trim() || new Date().toISOString().slice(0, 10);

  return {
    symbol: gq["01. symbol"]?.trim() || sym,
    currency: "USD",
    lastClose: last,
    previousClose: prev,
    changePercent: changePct,
    asOf: day,
    sessionHigh: hi,
    sessionLow: lo,
    volume: vol != null ? Math.round(vol) : null,
  };
}

/**
 * Letzte `points` Handelstage (Schlusskurs), aufsteigend nach Datum — für Sparklines.
 */
export async function fetchDailyCloses(
  symbol: string,
  points = 14,
): Promise<DailyClosePoint[]> {
  const key = getApiKey();
  const sym = symbol.trim().toUpperCase();
  const url = `${ALPHA_BASE}?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(sym)}&outputsize=compact&apikey=${key}`;

  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) {
    throw new Error(`Alpha Vantage HTTP ${res.status}`);
  }

  const json: unknown = await res.json();
  if (!json || typeof json !== "object") {
    throw new Error("Alpha Vantage: leere Antwort (Serie)");
  }

  const errMsg = (json as { "Error Message"?: string })["Error Message"];
  if (errMsg) {
    throw new Error(errMsg);
  }

  const note = (json as { Note?: string; Information?: string }).Note;
  const info = (json as { Information?: string }).Information;
  if (note || info) {
    throw new Error(note || info || "Alpha Vantage: Serien-Limit");
  }

  const series = (json as { "Time Series (Daily)"?: Record<string, Record<string, string>> })[
    "Time Series (Daily)"
  ];
  if (!series || typeof series !== "object") {
    throw new Error("Alpha Vantage: keine Tages-Serie");
  }

  const dates = Object.keys(series).sort();
  const tail = dates.slice(-points);
  return tail.map((date) => {
    const row = series[date];
    const c = num(row?.["4. close"]);
    return {
      date,
      close: c ?? 0,
    };
  });
}

function parseMarketCapBln(raw: string | undefined): number | null {
  const n = num(raw);
  if (n == null || n <= 0) return null;
  return Math.round((n / 1e9) * 100) / 100;
}

/**
 * Firmenprofil OVERVIEW — Sektor, Beschreibung, optional Kursziel / Marktkap.
 * Wirft bei API-/Key-Fehlern (gleiche Fehlerbehandlung wie GLOBAL_QUOTE).
 */
export async function fetchCompanyOverview(symbol: string): Promise<CompanyOverview> {
  const key = getApiKey();
  const sym = symbol.trim().toUpperCase();
  const url = `${ALPHA_BASE}?function=OVERVIEW&symbol=${encodeURIComponent(sym)}&apikey=${key}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) {
    throw new Error(`Alpha Vantage OVERVIEW HTTP ${res.status}`);
  }

  const json: unknown = await res.json();
  if (!json || typeof json !== "object") {
    throw new Error("Alpha Vantage OVERVIEW: leere Antwort");
  }

  const errMsg = (json as { "Error Message"?: string })["Error Message"];
  if (errMsg) {
    throw new Error(errMsg);
  }

  const note = (json as { Note?: string; Information?: string }).Note;
  const info = (json as { Information?: string }).Information;
  if (note || info) {
    throw new Error(
      note ||
        info ||
        "Alpha Vantage OVERVIEW: Limit oder Warteschlange — später erneut versuchen.",
    );
  }

  const row = json as Record<string, string | undefined>;
  const name = row.Name?.trim() || sym;
  const sector = row.Sector?.trim() || null;
  const industry = row.Industry?.trim() || null;
  const description = row.Description?.trim() || null;
  const atp = num(row.AnalystTargetPrice);
  const mcap = parseMarketCapBln(row.MarketCapitalization);

  return {
    symbol: row.Symbol?.trim() || sym,
    name,
    sector,
    industry,
    description,
    analystTargetPrice: atp,
    marketCapBln: mcap,
  };
}

export type SymbolSearchMatch = {
  symbol: string;
  name: string;
  region: string;
  type: string;
};

/**
 * SYMBOL_SEARCH — Treffer weltweit (Ticker + Name), serverseitig mit API-Key.
 */
export async function fetchSymbolSearch(keywords: string): Promise<SymbolSearchMatch[]> {
  const key = getApiKey();
  const kw = keywords.trim().slice(0, 100);
  if (!kw) return [];

  const url = `${ALPHA_BASE}?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(kw)}&apikey=${key}`;
  const res = await fetch(url, { next: { revalidate: 120 } });
  if (!res.ok) {
    throw new Error(`Alpha Vantage SYMBOL_SEARCH HTTP ${res.status}`);
  }

  const json: unknown = await res.json();
  if (!json || typeof json !== "object") {
    throw new Error("Alpha Vantage SYMBOL_SEARCH: leere Antwort");
  }

  const errMsg = (json as { "Error Message"?: string })["Error Message"];
  if (errMsg) {
    throw new Error(errMsg);
  }

  const note = (json as { Note?: string; Information?: string }).Note;
  const info = (json as { Information?: string }).Information;
  if (note || info) {
    throw new Error(
      note || info || "Alpha Vantage SYMBOL_SEARCH: Limit oder Warteschlange.",
    );
  }

  const raw = (json as { bestMatches?: Record<string, string>[] }).bestMatches;
  if (!Array.isArray(raw)) return [];

  return raw
    .map((m) => ({
      symbol: m["1. symbol"]?.trim() ?? "",
      name: m["2. name"]?.trim() ?? "",
      type: m["3. type"]?.trim() ?? "",
      region: m["4. region"]?.trim() ?? "",
    }))
    .filter((m) => m.symbol.length > 0);
}