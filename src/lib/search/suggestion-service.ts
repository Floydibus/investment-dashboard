import type { TickerSuggestion } from "@/lib/data/ticker-catalog";
import { TICKER_CATALOG } from "@/lib/data/ticker-catalog";

function normalize(s: string) {
  return s.trim().toUpperCase();
}

/**
 * Legacy-Helfer — leer; Autocomplete läuft über Alpha Vantage (siehe TickerSearch).
 */
export function getTickerSuggestions(query: string, limit = 8): TickerSuggestion[] {
  void query;
  void limit;
  return [];
}

export function findExactTicker(symbol: string): TickerSuggestion | undefined {
  const s = normalize(symbol);
  return TICKER_CATALOG.find((t) => t.symbol === s);
}
