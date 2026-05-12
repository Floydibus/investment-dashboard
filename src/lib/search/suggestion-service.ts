import type { TickerSuggestion } from "@/lib/data/ticker-catalog";
import { TICKER_CATALOG } from "@/lib/data/ticker-catalog";

function normalize(s: string) {
  return s.trim().toUpperCase();
}

/**
 * Filtert das statische Katalog-Array — später austauschbar gegen API / Edge.
 */
export function getTickerSuggestions(query: string, limit = 8): TickerSuggestion[] {
  const q = normalize(query);
  if (!q) {
    return TICKER_CATALOG.slice(0, limit);
  }
  return TICKER_CATALOG.filter(
    (t) =>
      t.symbol.includes(q) ||
      t.name.toUpperCase().includes(q) ||
      (t.exchange?.toUpperCase().includes(q) ?? false),
  ).slice(0, limit);
}

export function findExactTicker(symbol: string): TickerSuggestion | undefined {
  const s = normalize(symbol);
  return TICKER_CATALOG.find((t) => t.symbol === s);
}
