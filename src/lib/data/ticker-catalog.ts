/** Typ für Suchzeilen (Alpha Vantage SYMBOL_SEARCH + Direktwahl). */
export type TickerSuggestion = {
  symbol: string;
  name: string;
  exchange?: string;
};

/** Statischer Katalog entfällt — Vorschläge kommen von `/api/search/tickers`. */
export const TICKER_CATALOG: TickerSuggestion[] = [];
