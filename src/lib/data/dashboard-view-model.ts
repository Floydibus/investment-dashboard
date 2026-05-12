import type { NewsArticle } from "@/lib/api/finnhub";
import {
  getAlphaVantageApiKey,
  type CompanyOverview,
  type QuoteSnapshot,
} from "@/lib/api/alpha-vantage";
import type { AppLocale } from "@/lib/i18n/app-locale";
import { shellInstitutionalHint } from "@/lib/i18n/shell-copy";
import { uiT } from "@/lib/i18n/ui-messages";
import {
  buildSmartAnalysis,
  buildStrategicFromTemplates,
  type StrategicSectionTitles,
} from "@/lib/analysis/sector-smart-templates";
import {
  mapAlphaVantageSectorToKey,
  resolveMappedSector,
  rootSymbol,
  type DashboardSectorKey,
} from "@/lib/data/sector-keys";

export type { DashboardSectorKey };
export { resolveMappedSector, SECTOR_LABEL_DE } from "@/lib/data/sector-keys";

export type DashboardQuote = {
  last: number;
  changePercent: number;
  currency: string;
  asOfDate: string;
};

export type DashboardSparkPoint = {
  date: string;
  close: number;
};

export type DashboardPriceContext = {
  previousClose: number;
  sessionHigh: number | null;
  sessionLow: number | null;
  volumeMln: number | null;
  marketCapBln: number | null;
};

export type DashboardAISummary = {
  mappedSector: DashboardSectorKey;
  sectorLabelDe: string;
  headline: string;
  investmentThesis: string;
  operationsCapacityNarrative: string;
  technologyInnovationNarrative: string;
  contractsCommercialNarrative: string;
  risksCatalystsAndConclusion: string;
};

export type MarketDataState = "live" | "unavailable" | "no_api_key";

export type DashboardKeyStat = {
  label: string;
  value: string;
};

export type DashboardViewModel = {
  ticker: string;
  /** Symbol wie an Alpha Vantage übergeben (z. B. ROG.SW). */
  displaySymbol: string;
  marketDataState: MarketDataState;
  companyName: string | null;
  companyDescription: string | null;
  avSectorRaw: string | null;
  avIndustry: string | null;
  strategicSectionTitles: StrategicSectionTitles;
  quote: DashboardQuote;
  priceContext: DashboardPriceContext;
  sparkline: DashboardSparkPoint[];
  analystConsensusUsd: number | null;
  analystConsensusHighUsd: number | null;
  fairValueUsd: number | null;
  keyStats: DashboardKeyStat[];
  institutionalLabel: string;
  institutionalPositive: boolean;
  news: NewsArticle[];
  strategic: {
    construction: string;
    tech: string;
    contracts: string;
  };
  aiSummary: DashboardAISummary;
  /** Kurzer Hinweis unter der Sparkline (z. B. Fallback-Kurve). */
  sparklineHint: string | null;
};

function resolveAlphaVantageSymbol(tickerRaw: string): string {
  const upper = tickerRaw.trim().toUpperCase();
  if (upper.includes(".")) return upper;
  return rootSymbol(upper);
}

function buildShellModel(
  displayTicker: string,
  avSym: string,
  state: "no_api_key" | "unavailable",
  locale: AppLocale,
): DashboardViewModel {
  const sector = resolveMappedSector(displayTicker);
  const { aiSummary, strategicTitles } = buildSmartAnalysis(
    displayTicker,
    sector,
    null,
  );
  const strategic = buildStrategicFromTemplates(sector, displayTicker);
  const isoToday = new Date().toISOString().slice(0, 10);

  const hint = shellInstitutionalHint(state, locale);

  return {
    ticker: displayTicker,
    displaySymbol: avSym,
    marketDataState: state,
    companyName: null,
    companyDescription: null,
    avSectorRaw: null,
    avIndustry: null,
    strategicSectionTitles: strategicTitles,
    quote: {
      last: 0,
      changePercent: 0,
      currency: "USD",
      asOfDate: isoToday,
    },
    priceContext: {
      previousClose: 0,
      sessionHigh: null,
      sessionLow: null,
      volumeMln: null,
      marketCapBln: null,
    },
    sparkline: [],
    analystConsensusUsd: null,
    analystConsensusHighUsd: null,
    fairValueUsd: null,
    keyStats: [],
    institutionalLabel: hint,
    institutionalPositive: true,
    news: [],
    strategic,
    aiSummary: aiSummary as DashboardAISummary,
    sparklineHint: null,
  };
}

function mergeFromLive(
  displayTicker: string,
  avSym: string,
  snap: QuoteSnapshot,
  daily: DashboardSparkPoint[],
  overview: CompanyOverview | null,
  locale: AppLocale,
): DashboardViewModel {
  const sector = overview?.sector
    ? mapAlphaVantageSectorToKey(overview.sector)
    : resolveMappedSector(displayTicker);

  const { aiSummary, strategicTitles, institutionalLabel } = buildSmartAnalysis(
    displayTicker,
    sector,
    overview,
  );
  const strategic = buildStrategicFromTemplates(sector, displayTicker);

  const volMln =
    snap.volume != null
      ? Math.round((snap.volume / 1e6) * 100) / 100
      : null;

  let spark = daily.filter((p) => p.close > 0);
  let sparklineHint: string | null = null;

  if (spark.length < 2 && snap.previousClose > 0 && snap.lastClose > 0) {
    const asOf = snap.asOf;
    const d = new Date(`${asOf}T12:00:00Z`);
    d.setUTCDate(d.getUTCDate() - 1);
    const approxPrevDay = d.toISOString().slice(0, 10);
    spark = [
      { date: approxPrevDay, close: snap.previousClose },
      { date: asOf, close: snap.lastClose },
    ];
    sparklineHint =
      uiT(locale, "dash.sparklineHint");
  } else if (spark.length < 2) {
    spark = [];
  }

  const keyStats: DashboardKeyStat[] = [];
  if (overview?.industry) {
    keyStats.push({ label: uiT(locale, "dash.statIndustry"), value: overview.industry });
  }
  if (overview?.sector) {
    keyStats.push({ label: uiT(locale, "dash.statSector"), value: overview.sector });
  }

  return {
    ticker: displayTicker,
    displaySymbol: avSym,
    marketDataState: "live",
    companyName: overview?.name ?? null,
    companyDescription: overview?.description ?? null,
    avSectorRaw: overview?.sector ?? null,
    avIndustry: overview?.industry ?? null,
    strategicSectionTitles: strategicTitles,
    quote: {
      last: snap.lastClose,
      changePercent: snap.changePercent,
      currency: snap.currency,
      asOfDate: snap.asOf,
    },
    priceContext: {
      previousClose: snap.previousClose,
      sessionHigh: snap.sessionHigh,
      sessionLow: snap.sessionLow,
      volumeMln: volMln,
      marketCapBln: overview?.marketCapBln ?? null,
    },
    sparkline: spark,
    analystConsensusUsd: overview?.analystTargetPrice ?? null,
    analystConsensusHighUsd: null,
    fairValueUsd: null,
    keyStats,
    institutionalLabel,
    institutionalPositive: snap.changePercent >= 0,
    news: [],
    strategic,
    aiSummary: aiSummary as DashboardAISummary,
    sparklineHint,
  };
}

/** Display-Ticker + Alpha-Vantage-Symbol (z. B. Root-Symbol) — gleiche Logik wie SSR. */
export function getDashboardTickerParams(tickerRaw: string): {
  displayTicker: string;
  avSym: string;
} {
  const trimmed = tickerRaw.trim();
  const displayTicker = (trimmed.length > 0 ? trimmed : "AAPL").toUpperCase();
  const avSym = resolveAlphaVantageSymbol(trimmed.length > 0 ? trimmed : "AAPL");
  return { displayTicker, avSym };
}

export function getDashboardShellFor(
  displayTicker: string,
  avSym: string,
  state: "no_api_key" | "unavailable",
  locale: AppLocale = "de",
): DashboardViewModel {
  return buildShellModel(displayTicker, avSym, state, locale);
}

export function buildDashboardViewModelFromBundle(
  displayTicker: string,
  avSym: string,
  quote: QuoteSnapshot,
  dailyCloses: DashboardSparkPoint[],
  overview: CompanyOverview | null,
  locale: AppLocale = "de",
): DashboardViewModel {
  return mergeFromLive(displayTicker, avSym, quote, dailyCloses, overview, locale);
}

/**
 * Globale Marktanalyse: Live-Daten per Alpha Vantage für jeden Ticker.
 * API-Key nur serverseitig; bei Fehler oder fehlendem Key Platzhalter-UI.
 */
export async function getDashboardViewModel(
  tickerRaw: string,
  locale: AppLocale,
): Promise<DashboardViewModel> {
  const trimmed = tickerRaw.trim();
  const displayTicker = (trimmed.length > 0 ? trimmed : "AAPL").toUpperCase();
  const avSym = resolveAlphaVantageSymbol(trimmed.length > 0 ? trimmed : "AAPL");
  const loc = locale;

  if (!getAlphaVantageApiKey()) {
    return buildShellModel(displayTicker, avSym, "no_api_key", loc);
  }

  try {
    const { fetchStockData } = await import("@/lib/api/fetch-stock-data");
    const { quote: snap, dailyCloses, overview } = await fetchStockData(avSym);
    const spark: DashboardSparkPoint[] = dailyCloses.map((p) => ({
      date: p.date,
      close: p.close,
    }));
    return mergeFromLive(displayTicker, avSym, snap, spark, overview, loc);
  } catch (e) {
    console.error("[getDashboardViewModel] Alpha Vantage:", avSym, e);
    return buildShellModel(displayTicker, avSym, "unavailable", loc);
  }
}
